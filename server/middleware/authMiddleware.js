const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;

    if(req.cookies && req.cookies.token){ token = req.cookies.token; }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ 
        token = req.headers.authorization.split(' ')[1]; 
    }

    if(!token){ return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' }); }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // t: '0'=Admin, '1'=Employee, '2'=Client
        req.user = { id: decoded.id, t: decoded.t }; 
        next();
    } 
    catch(error){ 
        res.status(401).json({ success: false, message: 'Not authorized, token is invalid or has expired.' }); 
    }
};

// NEW: Restrict access to specific user types
// Usage: router.delete('/:id', protect, restrictTo('0'), controller.remove);
exports.restrictTo = (...allowedTypes) => {
    return (req, res, next) => {
        if (!allowedTypes.includes(req.user.t)) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to perform this action.' 
            });
        }
        next();
    };
};