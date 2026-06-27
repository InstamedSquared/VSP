require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const compression = require('compression'); // Performance
const cluster = require('cluster'); // Multi-core
const os = require('os'); // Hardware detection

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { doubleCsrfProtection, csrfErrorHandler } = require('./middleware/csrfMiddleware'); // Updated import
const logger = require('./config/logger'); // Import logger

const mainRouter = require('./routes');
const emailService = require('./services/emailService');

const PORT = process.env.PORT || 5000;
const numCPUs = os.cpus().length;

// MASTER PROCESS (The Manager)
if (cluster.isMaster && process.env.NODE_ENV === 'production') {
    logger.info(`Master ${process.pid} is running`);
    logger.info(`Detected ${numCPUs} CPU Cores. Scaling to 8 workers...`);

    // Fork workers (1 per Core)
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Auto-restart workers if they crash
    cluster.on('exit', (worker, code, signal) => {
        logger.error(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

}

// WORKER PROCESS (The App)
else {
    const app = express();
    app.set('trust proxy', 1);

    // Request Logging
    app.use((req, res, next) => {
        // logger.info(`${req.method} ${req.url}`);     // jeric // user logs
        next();
    });

    // 1. Performance: Gzip Compression
    app.use(compression());

    // 2. Security: Allowed Origins
    const whitelist = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(item => item.trim()) : ['http://localhost:3010'];
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || whitelist.indexOf(origin) !== -1) { callback(null, true); }
            else { callback(new Error('Not allowed by CORS')); }
        },
        credentials: true
    }));

    // 3. Security: Headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'blob:'],
                connectSrc: ["'self'", ...whitelist],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
            },
        },
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));

    // 4. Parsing & Sanitization
    app.use(express.json({ limit: '50mb' })); // Increased limit for multiple base64 uploads
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(mongoSanitize());
    app.use((req, res, next) => {
        if (req.path.startsWith('/api/cms')) return next();
        xss()(req, res, next);
    });

    // 5. Security: Rate Limiting
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20, // Strict: Only 10 login attempts per IP per 15 mins   // Jeric
        message: 'Too many login attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000, // 1000 API requests per 15 mins
        standardHeaders: true,
        legacyHeaders: false,
    });

    // 6. Routes
    app.use('/auth', authLimiter);
    app.use('/api', apiLimiter);
    app.use('/', mainRouter);

    // 7. Static Files (Uploads) - Always available
    app.use('/defaults', express.static(path.join(__dirname, 'public/defaults')));

    // 8. CSRF Error Handling
    app.use(csrfErrorHandler);

    // 8. Global Error Handler
    app.use((err, req, res, next) => {
        logger.error(err.stack);

        // Handle Multer errors specifically
        if (err.name === 'MulterError') {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    success: false,
                    message: `File too large. Please check the maximum size allowed for this upload.`
                });
            }
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        }

        // Handle Express Body Parser errors (e.g. JSON too big)
        if (err.type === 'entity.too.large') {
            return res.status(413).json({
                success: false,
                message: 'Request data too large. Please reduce the amount of text or media and try again.'
            });
        }

        const message = process.env.NODE_ENV === 'production' ? 'Server error.' : err.message;
        res.status(500).json({ success: false, message });
    });

    // 9. Static Files (Production Cache)
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/build'), {
            maxAge: '1d', // Cache static assets for 1 day
            etag: false
        }));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
        });
    } else {
        // 404 for API in dev
        app.use((req, res) => {
            res.status(404).json({ success: false, message: `Not Found: ${req.originalUrl}` });
        });
    }

    app.listen(PORT, async () => {
        const isWorkerOne = cluster.isWorker && cluster.worker.id === 1;
        const isDev = process.env.NODE_ENV !== 'production';

        if (isDev || isWorkerOne) {
            logger.info(`Server active on port ${PORT}`);

            // Only check email connection once
            emailService.verifyConnection()
                .then(() => logger.info('✅ Email service ready'))
                .catch(e => logger.error("❌ Email service offline"));
        }
    });
}