const webModel = require('../models/WebModel');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const redisClient = require('../config/redis');

const getSettings = async (req, res) => {
    try {
        const settings = await webModel.getSettings();
        // console.log('--- API RESPONSE (Settings):', Object.keys(settings));
        res.status(200).json({ success: true, settings });
    } catch (error) {
        logger.error('Error fetching web settings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPageContent = async (req, res) => {
    try {
        const { page } = req.params;
        const sections = await webModel.getPageContent(page);
        res.status(200).json({ success: true, page, sections });
    } catch (error) {
        logger.error(`Error fetching page content for ${req.params.page}:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        await webModel.updateSetting(key, value);
        res.status(200).json({ success: true, message: `Setting ${key} updated` });
    } catch (error) {
        logger.error(`Error updating setting ${req.body.key}:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updatePageSection = async (req, res) => {
    try {
        const { page, sectionKey, content } = req.body;
        await webModel.updatePageSection(page, sectionKey, content);
        res.status(200).json({ success: true, message: `Section ${sectionKey} on page ${page} updated` });
    } catch (error) {
        logger.error(`Error updating section ${req.body.sectionKey} on page ${req.body.page}:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { type } = req.body; // 'project' or 'dashboard'
        if (!type || !['project', 'dashboard'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid logo type' });
        }

        const extension = path.extname(req.file.originalname);
        const fileName = `${type === 'project' ? 'logo' : 'dashboard'}${extension}`;
        const targetDir = path.resolve(__dirname, `../public/defaults/${type === 'project' ? 'logo' : 'dashboard'}`);
        const targetPath = path.join(targetDir, fileName);

        // Ensure directory exists
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Remove existing logo/dashboard files in that directory to avoid duplicates
        const baseName = type === 'project' ? 'logo' : 'dashboard';
        const files = fs.readdirSync(targetDir);
        for (const file of files) {
            if (file.startsWith(`${baseName}.`) || file.startsWith('logo-')) {
                fs.unlinkSync(path.join(targetDir, file));
            }
        }

        // Move uploaded file
        fs.renameSync(req.file.path, targetPath);

        // Update database setting
        const settingKey = type === 'project' ? 'logo' : 'dashboard_logo';
        const settingValue = fileName;
        await webModel.updateSetting(settingKey, settingValue);

        const fullPath = `/defaults/${type === 'project' ? 'logo' : 'dashboard'}/${fileName}`;
        res.status(200).json({ success: true, message: `${type} logo updated`, path: fullPath });
    } catch (error) {
        logger.error('Error uploading logo:', error);
        res.status(500).json({ success: false, message: 'Server error uploading logo' });
    }
};

const getPublicFooter = async (req, res) => {
    try {
        const { id_project } = req.query;
        const projectId = id_project !== undefined ? (id_project === 'null' || id_project === '0' || id_project === '' ? 0 : parseInt(id_project, 10)) : 0;

        const cacheKey = `cms_footer:${projectId}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        // Query active, published footer scoped to the project
        let footer = null;
        if (projectId > 0) {
            footer = await db('web_footers')
                .where({ id_project: projectId, status: 'published', inactive: 0 })
                .first();
        }

        // Fall back to default project footer if none is found for custom project
        if (!footer) {
            footer = await db('web_footers')
                .where(builder => {
                    builder.where({ id_project: null }).orWhere({ id_project: 0 });
                })
                .where({ status: 'published', inactive: 0 })
                .first();
        }

        if (!footer) {
            return res.status(404).json({ success: false, message: 'Footer not found' });
        }

        let content = footer.content_live || '[]';
        let settings = footer.settings_live || '{}';

        try { content = typeof content === 'string' ? JSON.parse(content) : content; } catch (e) { content = []; }
        try { settings = typeof settings === 'string' ? JSON.parse(settings) : settings; } catch (e) { settings = {}; }

        const response = {
            success: true,
            data: {
                id: footer.id,
                id_project: footer.id_project,
                name: footer.name,
                settings,
                blocks: content
            }
        };

        // Cache for 10 minutes
        await redisClient.set(cacheKey, JSON.stringify(response), { EX: 600 });

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error fetching public footer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPublicHeader = async (req, res) => {
    try {
        const { id_project } = req.query;
        const projectId = id_project !== undefined ? (id_project === 'null' || id_project === '0' || id_project === '' ? 0 : parseInt(id_project, 10)) : 0;

        const cacheKey = `cms_header:${projectId}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        // Query active, published header scoped to the project
        let header = null;
        if (projectId > 0) {
            header = await db('web_headers')
                .where({ id_project: projectId, status: 'published', inactive: 0 })
                .first();
        }

        // Fall back to default project header if none is found for custom project
        if (!header) {
            header = await db('web_headers')
                .where(builder => {
                    builder.where({ id_project: null }).orWhere({ id_project: 0 });
                })
                .where({ status: 'published', inactive: 0 })
                .first();
        }

        if (!header) {
            return res.status(404).json({ success: false, message: 'Header not found' });
        }

        let content = header.content_live || '[]';
        let settings = header.settings_live || '{}';

        try { content = typeof content === 'string' ? JSON.parse(content) : content; } catch (e) { content = []; }
        try { settings = typeof settings === 'string' ? JSON.parse(settings) : settings; } catch (e) { settings = {}; }

        const response = {
            success: true,
            data: {
                id: header.id,
                id_project: header.id_project,
                name: header.name,
                settings,
                blocks: content
            }
        };

        // Cache for 10 minutes
        await redisClient.set(cacheKey, JSON.stringify(response), { EX: 600 });

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error fetching public header:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPublicNavigations = async (req, res) => {
    try {
        const { id_project } = req.query;
        const projectId = id_project !== undefined ? (id_project === 'null' || id_project === '0' || id_project === '' ? 0 : parseInt(id_project, 10)) : 0;

        const cacheKey = `cms_navigations:${projectId}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        // Query navigations (global or scoped to project)
        let navigations = [];
        if (projectId > 0) {
            navigations = await db('web_navigations')
                .where({ id_project: projectId, archived: 0, inactive: 0 })
                .orderBy('sort_order', 'asc');
        }

        // If none found or project is 0, fetch default navigations
        if (!navigations || navigations.length === 0) {
            navigations = await db('web_navigations')
                .where(builder => {
                    builder.where({ id_project: null }).orWhere({ id_project: 0 });
                })
                .where({ archived: 0, inactive: 0 })
                .orderBy('sort_order', 'asc');
        }

        const response = {
            success: true,
            data: navigations.map(nav => {
                let parsedSettings = nav.settings;
                if (typeof parsedSettings === 'string') {
                    try { parsedSettings = JSON.parse(parsedSettings); } catch (e) { parsedSettings = {}; }
                }
                return { ...nav, settings: parsedSettings || {} };
            })
        };

        // Cache for 10 minutes
        await redisClient.set(cacheKey, JSON.stringify(response), { EX: 600 });

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error fetching public navigations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getSettings,
    getPageContent,
    updateSetting,
    updatePageSection,
    uploadLogo,
    getPublicFooter,
    getPublicHeader,
    getPublicNavigations
};
