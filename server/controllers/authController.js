
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const ResourceModel = require('../models/ResourceModel');
const emailService = require('../services/emailService');
const logger = require('../config/logger');

// const userModel = new ResourceModel({u:'users' }, {folderName:'users', subfolder:'profile'});
const userModel = require('../models/UserModel');

const generateToken = (userId, userType = '0', rememberMe = false) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) { throw new Error('JWT_SECRET is not defined. Set process.env.JWT_SECRET'); }
    const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '1d');
    return jwt.sign({ id: userId, t: userType }, secret, { expiresIn });
};

const getActiveUser = async (req, res) => {
    try {
        const system = await userModel.userActive(req.user.id, req.user.t);
        if (!system) { return res.status(404).json({ success: false, message: 'User not found' }); }

        res.status(200).json({ success: true, system: system });
    }
    catch (error) {
        logger.error('Error fetching active user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const loginUser = [
    body('username').trim().escape().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ success: false, message: errors.array()[0].msg }); }

        try {
            const { username, password, rememberMe } = req.body;
            const user = await userModel.userAuth(username);

            const isMatch = user ? await bcrypt.compare(password, user.pw) : false;
            if (!isMatch) {
                // logger.warn(`Failed login attempt for user: ${username}`);
                return res.status(200).json({ success: false, message: 'Invalid username or password.' });
            }

            // Check if OTP is enabled for this user
            const system = await userModel.userActive(user.id, user.t);
            const otpEnabled = system.user.otp === 1;

            if (otpEnabled) {
                // Generate 6-digit OTP
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

                // Construct full name
                const nameParts = [system.user.fn, system.user.mn, system.user.sn].filter(part => part && part.trim());
                const fullName = nameParts.join(' ').trim() || user.un;

                // Send OTP email
                try {
                    const emailResult = await emailService.sendOtpEmail(system.user.email, otpCode, fullName);
                    if (emailResult.success) { logger.info(`OTP email sent to ${system.user.email}`); }
                    else { logger.error('Failed to send OTP email:', emailResult.error); }
                } catch (emailError) { logger.error('Error sending OTP email:', emailError); }

                // Generate temporary token with OTP embedded (expires in 5 minutes, like password reset)
                const tempToken = jwt.sign({
                    userId: user.id,
                    userType: user.t,
                    otpCode: otpCode,
                    email: system.user.email,
                    otpVerification: true
                }, process.env.JWT_SECRET, { expiresIn: '5m' });

                return res.status(200).json({
                    success: true,
                    requiresOtp: true,
                    tempToken: tempToken,
                    message: 'OTP sent to your email. Please verify to continue.'
                });
            }

            // Normal login flow (OTP not enabled)
            const token = generateToken(user.id, user.t, rememberMe);

            const cookieOptions = { httpOnly: true };

            if (rememberMe) {
                const cookieDays = 30; // 30 days
                const cookieExpires = new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000);
                cookieOptions.expires = cookieExpires;
            }

            if (process.env.NODE_ENV === 'production') { cookieOptions.secure = true; cookieOptions.sameSite = 'lax'; }
            else { cookieOptions.secure = false; cookieOptions.sameSite = undefined; }

            //logger.info(`User logged in: ${username}`);      
            res.status(200).cookie('token', token, cookieOptions).json({ success: true, system: system });
        }
        catch (error) {
            logger.error("Login Error:", error);
            res.status(500).json({ success: false, message: 'Server error during login.' });
        }
    }
];

const logoutUser = (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS
        sameSite: 'Strict', // Strongest CSRF protection
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
    };
    if (process.env.NODE_ENV === 'production') { cookieOptions.secure = true; cookieOptions.sameSite = 'lax'; }
    else { cookieOptions.sameSite = undefined; cookieOptions.secure = false; }

    res.cookie('token', 'loggedout', cookieOptions);
    res.status(200).json({ success: true, message: 'User logged out successfully.' });
};

const forgotPassword = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { email } = req.body;
            const user = await userModel.userEmail(email);

            if (!user) {
                logger.info(`Forgot password requested for non-existent email: ${email}`);
                return res.status(200).json({
                    success: true,
                    message: 'If an account with that email exists, you will receive a password reset link.'
                });
            }

            const resetToken = jwt.sign({ userId: user.id, email: user.email, t: user.t }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Construct full name from first, middle, and last name
            const nameParts = [user.fn, user.mn, user.sn].filter(part => part && part.trim());
            const fullName = nameParts.join(' ').trim() || user.un;

            try {
                const emailResult = await emailService.sendPasswordResetEmail(email, resetToken, fullName);
                if (emailResult.success) { logger.info(`Password reset email sent to ${email}`); }
                else { logger.error('Failed to send password reset email:', emailResult.error); }
            }
            catch (emailError) { logger.error('Error sending password reset email:', emailError); }

            res.status(200).json({ success: true, message: 'If an account with that email exists, you will receive a password reset link.' });
        }
        catch (error) { logger.error('Forgot password error:', error); res.status(500).json({ success: false, message: 'Server error processing request.' }); }
    }
];

const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.userResetVerify(decoded.userId, decoded.t);

        if (!user) { return res.status(400).json({ valid: false, message: 'Invalid token.' }); }
        return res.status(200).json({ valid: true });
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') { return res.status(400).json({ valid: false, message: 'Token has expired.' }); }
    }
    return res.status(400).json({ valid: false, message: 'Invalid token.' });
};

const resetPassword = [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { token, password } = req.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.userResetVerify(decoded.userId, decoded.t);
            if (!user) { return res.status(400).json({ success: false, message: 'Invalid token.' }); }

            const userTable = decoded.t === '0' ? 'users' : decoded.t === '1' ? 'employees' : 'clients';
            const model = new ResourceModel(userTable);

            const hashedPassword = await bcrypt.hash(password, 12);
            await model.update({ id: decoded.userId }, { pw: hashedPassword });

            logger.info(`Password reset successfully for user ID: ${decoded.userId} in table: ${userTable}`);
            res.status(200).json({
                success: true,
                message: 'Password reset successfully.'
            });
        } catch (error) {
            logger.error('Reset password error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ success: false, message: 'Reset token has expired.' });
            }
            res.status(500).json({ success: false, message: 'Server error resetting password.' });
        }
    }
];

const registerUser = [
    body('username').trim().escape().isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { username, email, password, firstName, lastName } = req.body;

            const [existingUser] = await userModel.select('u.id', { un: username });
            if (existingUser) { return res.status(400).json({ success: false, message: 'Username already exists.' }); }

            const [existingEmail] = await userModel.select('u.id', { email: email });
            if (existingEmail) { return res.status(400).json({ success: false, message: 'Email already exists.' }); }
            const hashedPassword = await bcrypt.hash(password, 12);

            const userData = {
                un: username,
                email: email,
                pw: hashedPassword,
                fn: firstName || '',
                sn: lastName || ''
            };
            const [newUserId] = await userModel.insert(userData);
            logger.info(`New user registered: ${username} (${email})`);
            try { await emailService.sendWelcomeEmail(email, username); }
            catch (emailError) { logger.error('Welcome email failed:', emailError); }

            res.status(201).json({ success: true, message: 'User registered successfully.', userId: newUserId });
        }
        catch (error) { logger.error('Registration error:', error); res.status(500).json({ success: false, message: 'Server error during registration.' }); }
    }
];

const testEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }
        const result = await emailService.sendTestEmail(email);
        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Test email sent successfully!',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send test email.',
                error: result.error
            });
        }
    } catch (error) {
        logger.error('Test email error:', error);
        res.status(500).json({ success: false, message: 'Server error sending test email.' });
    }
};

const verifyOtp = [
    body('tempToken').notEmpty().withMessage('Temporary token is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { tempToken, otp, rememberMe } = req.body;

            // Verify temporary token (will automatically check expiration)
            const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

            if (!decoded.otpVerification) {
                return res.status(400).json({ success: false, message: 'Invalid verification token.' });
            }

            // Check if OTP matches the one in the token
            if (decoded.otpCode !== otp) {
                return res.status(400).json({ success: false, message: 'Invalid OTP code.' });
            }

            const userId = decoded.userId;
            const userType = decoded.userType;

            // Verify user still exists and is active
            const user = await userModel.userResetVerify(userId, userType);
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found.' });
            }

            // Generate actual authentication token
            const token = generateToken(userId, userType, rememberMe);
            const system = await userModel.userActive(userId, userType);

            // Set cookie
            const cookieOptions = { httpOnly: true };

            if (rememberMe) {
                const cookieDays = 30; // 30 days
                const cookieExpires = new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000);
                cookieOptions.expires = cookieExpires;
            }

            if (process.env.NODE_ENV === 'production') { cookieOptions.secure = true; cookieOptions.sameSite = 'lax'; }
            else { cookieOptions.secure = false; cookieOptions.sameSite = undefined; }

            logger.info(`User ${userId} successfully verified OTP and logged in`);
            res.status(200).cookie('token', token, cookieOptions).json({ success: true, system: system });

        } catch (error) {
            logger.error('OTP verification error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ success: false, message: 'OTP has expired. Please login again.' });
            }
            res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
        }
    }
];

const resendOtp = [
    body('tempToken').notEmpty().withMessage('Temporary token is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        try {
            const { tempToken } = req.body;

            // We allow resending even if the current token is expired, 
            // but we must ensure it was a valid OTP verification token.
            let decoded;
            try {
                decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    decoded = jwt.decode(tempToken);
                } else {
                    return res.status(400).json({ success: false, message: 'Invalid token.' });
                }
            }

            if (!decoded || !decoded.otpVerification) {
                return res.status(400).json({ success: false, message: 'Invalid verification token.' });
            }

            // Generate NEW 6-digit OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Get user details for the email
            const system = await userModel.userActive(decoded.userId, decoded.userType);
            const nameParts = [system.user.fn, system.user.mn, system.user.sn].filter(part => part && part.trim());
            const fullName = nameParts.join(' ').trim() || system.user.un;

            // Send OTP email
            try {
                const emailResult = await emailService.sendOtpEmail(decoded.email, otpCode, fullName);
                if (emailResult.success) { logger.info(`Resent OTP email to ${decoded.email}`); }
                else { logger.error('Failed to resend OTP email:', emailResult.error); }
            } catch (emailError) { logger.error('Error resending OTP email:', emailError); }

            // Generate NEW temporary token with the NEW OTP
            const newToken = jwt.sign({
                userId: decoded.userId,
                userType: decoded.userType,
                otpCode: otpCode,
                email: decoded.email,
                otpVerification: true
            }, process.env.JWT_SECRET, { expiresIn: '5m' });

            res.status(200).json({
                success: true,
                tempToken: newToken,
                message: 'A new OTP has been sent to your email.'
            });

        } catch (error) {
            logger.error('Resend OTP error:', error);
            res.status(500).json({ success: false, message: 'Server error during OTP resend.' });
        }
    }
];

module.exports = {
    loginUser,
    logoutUser,
    getActiveUser,
    registerUser,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    testEmail,
    verifyOtp,
    resendOtp,
};