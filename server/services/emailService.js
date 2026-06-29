const nodemailer = require('nodemailer');

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false }
};

const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
const verifyConnection = async () => {
  try {
    await transporter.verify();
    // console.log('Email server is ready to send emails');
    return true;
  }
  catch (error) { console.error('Email server connection error:', error); return false; }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, fullName = '') => {
  try {
    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'http://localhost:3010';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: {
        name: 'Your App Support',
        address: emailConfig.auth.user
      },
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #007bff;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .reset-button {
              display: inline-block;
              background-color: #007bff;
              color:#fff;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .reset-button:hover { background-color: #0056b3; }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 12px;
              color: #6c757d;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h3>Hello${fullName ? ' ' + fullName : ''},</h3>
            
            <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-button" style="color:#FFF;">Reset Your Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 3px;">
              ${resetUrl}
            </p>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
            
            <p>If you're having trouble clicking the reset password button, copy and paste the URL above into your web browser.</p>
            
            <p>For security reasons, this link can only be used once and will expire in 1 hour.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>If you need additional help, please contact our support team.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hello${fullName ? ' ' + fullName : ''},
        
        We received a request to reset your password. If you made this request, use the link below to reset your password:
        
        ${resetUrl}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        
        For security reasons, this link can only be used once.
        
        This is an automated message, please do not reply to this email.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  }
  catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, username = '', tempPassword = '', fullName = '') => {
  try {
    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0] : 'http://localhost:3010';
    const loginUrl = `${clientUrl}/login`;

    const mailOptions = {
      from: {
        name: 'VSP Recruitment',
        address: emailConfig.auth.user
      },
      to: email,
      subject: 'Welcome to VSP! Your Account Details',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 5px 5px; }
            .credentials { background-color: #fff; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .login-button { display: inline-block; background-color: #10b981; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to the Team!</h1>
          </div>
          <div class="content">
            <h3>Hello${fullName ? ' ' + fullName : ''},</h3>
            <p>Congratulations on your new role! Your employee account has been successfully created.</p>
            <p>Below are your login credentials. We recommend logging in and changing your password immediately.</p>
            
            <div class="credentials">
              <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
              <p><strong>Username:</strong> ${username}</p>
              ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${loginUrl}" class="login-button">Login to Your Account</a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to the Team!
        
        Hello${fullName ? ' ' + fullName : ''},
        
        Congratulations on your new role! Your employee account has been successfully created.
        
        Login URL: ${loginUrl}
        Username: ${username}
        ${tempPassword ? `Temporary Password: ${tempPassword}` : ''}
        
        We recommend logging in and changing your password immediately.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Test email function
const sendTestEmail = async (email) => {
  try {
    const mailOptions = {
      from: {
        name: 'Your App Support',
        address: emailConfig.auth.user
      },
      to: email,
      subject: 'Email Server Test',
      html: `
        <h2>Email Server Test</h2>
        <p>This is a test email to verify that your email server is working correctly.</p>
        <p><strong>Time sent:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your email configuration is working properly!</p>
      `,
      text: `
        Email Server Test
        
        This is a test email to verify that your email server is working correctly.
        
        Time sent: ${new Date().toLocaleString()}
        
        If you received this email, your email configuration is working properly!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email
const sendOtpEmail = async (email, otpCode, fullName = '') => {
  try {
    const mailOptions = {
      from: {
        name: 'Your App Support',
        address: emailConfig.auth.user
      },
      to: email,
      subject: 'Your One-Time Password (OTP)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #28a745;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .otp-code {
              background-color: #fff;
              border: 2px dashed #28a745;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #28a745;
              margin: 20px 0;
              border-radius: 5px;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 12px;
              color: #6c757d;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>OTP Verification</h1>
          </div>
          <div class="content">
            <h3>Hello${fullName ? ' ' + fullName : ''},</h3>
            
            <p>You have requested to log in to your account. Please use the following One-Time Password (OTP) to complete your login:</p>
            
            <div class="otp-code">
              ${otpCode}
            </div>
            
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>This OTP will expire in 5 minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this login, please ignore this email and secure your account</li>
              </ul>
            </div>
            
            <p>Enter this code on the verification page to complete your login.</p>
            
            <p>For security reasons, this code can only be used once and will expire shortly.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>If you need additional help, please contact our support team.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        OTP Verification
        
        Hello${fullName ? ' ' + fullName : ''},
        
        You have requested to log in to your account. Please use the following One-Time Password (OTP) to complete your login:
        
        ${otpCode}
        
        This OTP will expire in 5 minutes.
        
        Do not share this code with anyone. If you didn't request this login, please ignore this email and secure your account.
        
        Enter this code on the verification page to complete your login.
        
        For security reasons, this code can only be used once.
        
        This is an automated message, please do not reply to this email.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  verifyConnection,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendTestEmail,
  sendOtpEmail
};