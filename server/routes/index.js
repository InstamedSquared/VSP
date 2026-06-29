const express = require('express');
const ResourceModel = require('../models/ResourceModel');
const createResourceController = require('../controllers/resourceController');
const createResourceRouter = require('./resourceRouter');
const userPreferenceController = require('../controllers/userPreferenceController');
const webController = require('../controllers/webController');
const cmsController = require('../controllers/cmsController');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const workforceRouter = require('./domain/workforceRouter');
const recruitmentRouter = require('./domain/recruitmentRouter');
const operationsRouter = require('./domain/operationsRouter');
const financeRouter = require('./domain/financeRouter');
const lmsRouter = require('./domain/lmsRouter');
// Import the entire module
const csrfMiddleware = require('../middleware/csrfMiddleware');
const path = require('path');
const fs = require('fs');
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/uploadMiddleware');
const mediaUploadMiddleware = require('../middleware/mediaUploadMiddleware');
const createResourceMediaController = require('../controllers/resourceMediaController');
const resourceMediaUpload = require('../middleware/resourceMediaUpload');


const mainRouter = express.Router();

// --- Public Media Serving (No Auth Required) ---
mainRouter.get('/images/:filename', mediaController.getMedia);
mainRouter.get('/images/projects/:projectId/:filename', mediaController.getProjectMedia);

// --- Public API Routes (No Auth Required) ---
const publicRouter = express.Router();
const clientRequestController = require('../controllers/domain/clientRequestController');
publicRouter.post('/v1/client-requests/submit', upload.none(), clientRequestController.submitRequest);

mainRouter.use('/api', publicRouter);

// --- Authentication (Public) ---
const authRouter = express.Router();
authRouter.post('/login', authController.loginUser);
authRouter.post('/signup', authController.registerUser);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.get('/verify-reset-token/:token', authController.verifyResetToken);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/verify-otp', authController.verifyOtp);
authRouter.post('/resend-otp', authController.resendOtp);
authRouter.post('/logout', authController.logoutUser);
authRouter.post('/test-email', authController.testEmail);
mainRouter.use('/auth', authRouter);

// --- Web (Public) ---
const webRouter = express.Router();
webRouter.get('/settings', webController.getSettings);
webRouter.get('/page/:page', webController.getPageContent);
webRouter.get('/footer', webController.getPublicFooter);
webRouter.get('/header', webController.getPublicHeader);
webRouter.get('/navigations', webController.getPublicNavigations);
mainRouter.use('/api/web', webRouter);

// --- CMS Public (no auth) ---
const cmsPublicRouter = express.Router();
cmsPublicRouter.get('/page/:slug', cmsController.getPublicPage);
mainRouter.use('/api/cms', cmsPublicRouter);


// --- Secure API Routes ---
const apiRouter = express.Router();
apiRouter.use(protect);

// CSRF Token Endpoint
apiRouter.get('/csrf-token', (req, res) => {
    if (typeof csrfMiddleware.generateToken !== 'function') {
        console.error("API Error: generateToken function is missing in csrfMiddleware");
        return res.status(500).json({ success: false, message: "Server Configuration Error" });
    }
    // console.log('Generating CSRF token for user:', req.user ? req.user.id : 'anonymous');
    const csrfToken = csrfMiddleware.generateToken(req, res);
    // console.log('Token generated, cookie should be set');
    res.json({ csrfToken });
});

// Apply CSRF protection to mutation routes (POST/PUT/DELETE)
apiRouter.use(csrfMiddleware.doubleCsrfProtection);

apiRouter.get('/auth/user', authController.getActiveUser);
apiRouter.put('/user/preferences', userPreferenceController.updatePreferences);
apiRouter.put('/web/settings', webController.updateSetting);
apiRouter.put('/web/page-section', webController.updatePageSection);
apiRouter.post('/web/upload-logo', upload.single('logo'), webController.uploadLogo);

// --- Media Routes ---
apiRouter.get('/media', mediaController.getMediaList);
apiRouter.post('/media/upload', mediaUploadMiddleware.single('file'), mediaController.uploadMedia);
apiRouter.delete('/media/:filename', mediaController.deleteMedia);

// --- Resource Media Routes ---
// Registered dynamically below


// --- CMS Admin Routes ---

// Pages
apiRouter.get('/cms/pages', cmsController.listPages);
apiRouter.get('/cms/pages/:id', cmsController.getPageForEdit);
apiRouter.post('/cms/pages', cmsController.createPage);
apiRouter.post('/cms/pages/:id/publish', cmsController.publishPage);
apiRouter.put('/cms/pages/:id', cmsController.updatePage);
apiRouter.patch('/cms/pages/:id/delete', cmsController.deletePage);
apiRouter.patch('/cms/pages/:id/archive', cmsController.archivePage);
apiRouter.patch('/cms/pages/:id/unarchive', cmsController.unarchivePage);

// Sections (reorder BEFORE :id to avoid Express matching 'reorder' as :id)
apiRouter.get('/cms/sections/:pageId', cmsController.getSections);
apiRouter.post('/cms/sections', cmsController.createSection);
apiRouter.post('/cms/sections/:id/publish', cmsController.publishSection);
apiRouter.put('/cms/sections/reorder', cmsController.reorderSections);
apiRouter.put('/cms/sections/:id', cmsController.updateSection);
apiRouter.patch('/cms/sections/:id/delete', cmsController.deleteSection);
apiRouter.patch('/cms/sections/:id/archive', cmsController.archiveSection);
apiRouter.patch('/cms/sections/:id/unarchive', cmsController.unarchiveSection);


// Templates
apiRouter.get('/cms/templates', cmsController.getTemplates);

// Footers
apiRouter.get('/cms/footers', cmsController.getFooter);
apiRouter.put('/cms/footers', cmsController.updateFooter);
apiRouter.post('/cms/footers/:id/publish', cmsController.publishFooter);

// Headers
apiRouter.get('/cms/headers', cmsController.getHeader);
apiRouter.put('/cms/headers', cmsController.updateHeader);
apiRouter.post('/cms/headers/:id/publish', cmsController.publishHeader);

// Navigations
apiRouter.get('/cms/navigations', cmsController.getNavigations);
apiRouter.put('/cms/navigations', cmsController.updateNavigations);

// --- Domain Routes (v1) ---
apiRouter.use('/v1/workforce', workforceRouter);
apiRouter.use('/v1/recruitment', recruitmentRouter);
apiRouter.use('/v1/operations', operationsRouter);
apiRouter.use('/v1/finance', financeRouter);
apiRouter.use('/v1/lms', lmsRouter);

// Client Self-Service Routes
const clientRouter = require('./domain/clientRouter');
apiRouter.use('/v1/client', clientRouter);

// --- DYNAMIC RESOURCE REGISTRATION ---        // jeric
const defColumn = ['id', 'fn', 'mn', 'sn', 'gender', 'bday', 'phone', 'email', 'address', 'photo_filename', 'id_position'];
const resources = [
    { name: 'users', tableName: 'users', allowedColumns: defColumn, fileConfig: { folderName: 'users', subfolder: 'profile', imageProcessing: { resize: true, width: 400, format: 'webp', quality: 95 } } },
    { name: 'employees', tableName: 'employees', allowedColumns: defColumn, fileConfig: { folderName: 'employees', subfolder: 'profile', imageProcessing: { resize: true, width: 800, quality: 95 } } },
    { name: 'clients', tableName: 'clients', allowedColumns: defColumn, fileConfig: { folderName: 'clients', subfolder: 'profile', imageProcessing: { resize: false, format: 'jpeg', quality: 90 } } },
    { name: 'positions', tableName: 'user_position', allowedColumns: ['id', 'name', 'type', 'remarks'] },
    { name: 'projects', tableName: 'projects', allowedColumns: ['id', 'title', 'subtitle', 'venue', 'dated', 'remarks'], mediaScan: true },
    /*
    {
        name: 'position', tableName: 'user_position', allowedColumns: ['id', 'u', 'name'],
        countFields: [{alias:'u', table:'users', matchColumn:'id_position', type:'thousand' }], 
        fileConfig: { folderName: 'regional', subfolder: 'logo', imageProcessing: defLogo }
    },*/
];

const cacheMiddleware = require('../middleware/cacheMiddleware'); // Import Cache Middleware

resources.forEach(resource => {
    const model = new ResourceModel(resource.tableName, resource.fileConfig, resource.allowedColumns, resource.countFields, resource.joinFields, resource.relatedTables, resource.mediaScan);
    const controller = createResourceController(model, resource.name);
    const router = createResourceRouter(controller);

    // --- Dynamic Media Routes ---
    if (resource.mediaScan) {
        const resMediaController = createResourceMediaController(resource.name);
        
        // Public Media Access
        publicRouter.get(`/${resource.name}/:id/media/:filename`, resMediaController.getSingleMedia);
        
        // Protected Media Management
        apiRouter.get(`/${resource.name}/:id/media`, resMediaController.getMedia);
        apiRouter.post(`/${resource.name}/:id/media`, resourceMediaUpload.array('files'), resMediaController.uploadMedia);
        apiRouter.delete(`/${resource.name}/:id/media/:filename`, resMediaController.deleteMedia);
        apiRouter.post(`/${resource.name}/:id/media/bulk-delete`, resMediaController.bulkDeleteMedia);
    }

    if (resource.fileConfig) {
        publicRouter.get(`/${resource.name}/:id/photo`, async (req, res) => {
            try {
                res.set('Cache-Control', 'no-cache');
                const [record] = await model.select('photo_filename', { id: req.params.id });

                if (!record || !record.photo_filename) { return res.status(404).send('Photo not found.'); }
                const photoPath = path.resolve(
                    process.env.PHOTO_STORAGE_PATH,
                    resource.fileConfig.folderName,
                    req.params.id,
                    resource.fileConfig.subfolder,
                    record.photo_filename
                );
                if (fs.existsSync(photoPath)) { res.sendFile(photoPath); }
                else { res.status(404).send('Photo file not found on disk.'); }
            } catch (error) { res.status(500).send('Server Error retrieving photo'); }
        });
    }
    // Apply Cache Middleware (60 seconds) to GET requests AND Invalidation to others
    apiRouter.use(`/${resource.name}`, router);
});

mainRouter.use('/api', apiRouter);

module.exports = mainRouter;