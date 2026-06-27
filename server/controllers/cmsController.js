const cmsModel = require('../models/CmsModel');
const logger = require('../config/logger');
const redisClient = require('../config/redis');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// === PUBLIC ===

const getPublicPage = async (req, res) => {
    try {
        const { slug } = req.params;
        const { preview, token } = req.query;

        // Preview mode — verify admin JWT, return page regardless of status
        if (preview === '1' && token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded && decoded.t === '0') {
                    // Admin verified — fetch page without status filter
                    const page = await db('web_pages').where({ slug, inactive: 0 }).first();
                    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
                    const result = await cmsModel.getFullPageForAdmin(page.id);
                    return res.status(200).json({ success: true, data: result });
                }
            } catch (e) { /* invalid token, fall through to normal flow */ }
        }

        // Check Redis cache
        const cacheKey = `cms_page:${slug}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        // Fetch from DB (only published)
        const result = await cmsModel.getFullPage(slug);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }

        const response = { success: true, data: result };

        // Cache for 5 minutes (300 seconds)
        await redisClient.set(cacheKey, JSON.stringify(response), { EX: 300 });

        res.status(200).json(response);
    } catch (error) {
        logger.error('Error fetching CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === CACHE INVALIDATION HELPERS ===

const invalidatePageCacheByPageId = async (pageId) => {
    const [page] = await cmsModel.select(['slug'], { id: pageId });
    if (page) await redisClient.del(`cms_page:${page.slug}`);
};

const invalidatePageCacheBySectionId = async (sectionId) => {
    const section = await db('web_sections').where({ id: sectionId }).select('id_page').first();
    if (section) await invalidatePageCacheByPageId(section.id_page);
};

// === ADMIN — PAGES ===

const listPages = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'asc', searchableColumns, ...filters } = req.query;
        const result = await cmsModel.getPaged({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            search,
            searchableColumns: searchableColumns ? searchableColumns.split(',') : [],
            filters,
            sortBy,
            sortOrder,
        });
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        logger.error('Error listing CMS pages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPageForEdit = async (req, res) => {
    try {
        const { id } = req.params;
        let result;
        if (!id || id === 'undefined') return res.status(400).json({ success: false, message: 'Invalid Page Reference' });

        if (isNaN(id)) {
            result = await cmsModel.getFullPageBySlugForAdmin(id);
        } else {
            result = await cmsModel.getFullPageForAdmin(id);
        }

        if (!result) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        logger.error('Error fetching CMS page for edit:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createPage = async (req, res) => {
    try {
        const { title, slug, meta_title, meta_desc, has_header, has_footer, status } = req.body;

        const existing = await db('web_pages').where({ slug, inactive: 0 }).first();
        if (existing) {
            return res.status(200).json({ success: false, message: 'Slug already exists' });
        }

        const data = { title, slug, meta_title, meta_desc, has_header, has_footer, status, created_by: req.user.id };
        const newPage = await cmsModel.insert(data);

        await redisClient.incr('resource_version:web_pages');

        res.status(201).json({ success: true, message: 'Page created', data: newPage });
    } catch (error) {
        logger.error('Error creating CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, meta_title, meta_desc, has_header, has_footer, status } = req.body;

        if (slug) {
            const existing = await db('web_pages').where({ slug, inactive: 0 }).whereNot({ id }).first();
            if (existing) {
                return res.status(200).json({ success: false, message: 'Slug already exists' });
            }
        }

        const data = {};
        if (title !== undefined) data.title = title;
        if (slug !== undefined) data.slug = slug;
        if (meta_title !== undefined) data.meta_title = meta_title;
        if (meta_desc !== undefined) data.meta_desc = meta_desc;
        if (has_header !== undefined) data.has_header = has_header;
        if (has_footer !== undefined) data.has_footer = has_footer;
        if (status !== undefined) data.status = status;

        await cmsModel.update({ id }, data, null, { userId: req.user.id });
        await redisClient.incr('resource_version:web_pages');

        const [page] = await cmsModel.select(['slug'], { id });
        if (page) await redisClient.del(`cms_page:${page.slug}`);

        res.status(200).json({ success: true, message: 'Page updated' });
    } catch (error) {
        logger.error('Error updating CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const publishPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { sections } = req.body;
        await cmsModel.publishPage(id, sections);
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheByPageId(id);
        res.status(200).json({ success: true, message: 'Published successfully' });
    } catch (error) {
        logger.error('Error publishing CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const [page] = await cmsModel.select(['slug'], { id });

        await cmsModel.softDelete({ id }, { userId: req.user.id });
        await redisClient.incr('resource_version:web_pages');

        if (page) await redisClient.del(`cms_page:${page.slug}`);

        res.status(200).json({ success: true, message: 'Page deleted' });
    } catch (error) {
        logger.error('Error deleting CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const archivePage = async (req, res) => {
    try {
        const { id } = req.params;
        await cmsModel.archive({ id }, { userId: req.user.id });
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheByPageId(id);
        res.status(200).json({ success: true, message: 'Page archived' });
    } catch (error) {
        logger.error('Error archiving CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const unarchivePage = async (req, res) => {
    try {
        const { id } = req.params;
        await cmsModel.unarchive({ id });
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheByPageId(id);
        res.status(200).json({ success: true, message: 'Page unarchived' });
    } catch (error) {
        logger.error('Error unarchiving CMS page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === ADMIN — SECTIONS ===

const getSections = async (req, res) => {
    try {
        const sections = await cmsModel.getSections(req.params.pageId);
        res.status(200).json({ success: true, data: sections });
    } catch (error) {
        logger.error('Error fetching CMS sections:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createSection = async (req, res) => {
    try {
        const { id_page, template, section_name, blocks, settings } = req.body;

        const maxOrd = await db('web_sections').where({ id_page, inactive: 0 }).max('ord as maxOrd').first();
        const ord = (maxOrd && maxOrd.maxOrd !== null) ? maxOrd.maxOrd + 1 : 0;

        let finalBlocks = blocks || [];
        let finalSettings = settings || {};

        // If template provided, load its default blocks and settings
        if (template && finalBlocks.length === 0) {
            const templateData = await cmsModel.getTemplateByKey(template);
            if (templateData) {
                if (templateData.default_blocks) {
                    try {
                        finalBlocks = typeof templateData.default_blocks === 'string' ? JSON.parse(templateData.default_blocks) : templateData.default_blocks;
                    } catch (e) { finalBlocks = []; }
                }
                if (templateData.default_settings) {
                    try {
                        const defaultSettings = typeof templateData.default_settings === 'string' ? JSON.parse(templateData.default_settings) : templateData.default_settings;
                        finalSettings = { ...defaultSettings, ...finalSettings };
                    } catch (e) { /* ignore */ }
                }
            }
        }

        const newSection = await cmsModel.createSection({
            id_page,
            template,
            section_name: section_name || '',
            ord,
            blocks: finalBlocks,
            settings: finalSettings
        }, req.user.id);

        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheByPageId(id_page);

        res.status(201).json({ success: true, data: { ...newSection, blocks: finalBlocks, settings: finalSettings, has_changes: true } });
    } catch (error) {
        logger.error('Error creating CMS section:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        await cmsModel.updateSection(id, req.body, { userId: req.user.id });
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheBySectionId(id);
        res.status(200).json({ success: true, message: 'Section updated (Draft)' });
    } catch (error) {
        logger.error('Error updating CMS section:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const publishSection = async (req, res) => {
    try {
        const { id } = req.params;
        await cmsModel.publishSection(id);
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheBySectionId(id);
        res.status(200).json({ success: true, message: 'Section published' });
    } catch (error) {
        logger.error('Error publishing CMS section:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteSection = async (req, res) => {
    try {
        const sectionId = req.params.id;
        await cmsModel.deleteSection(sectionId, { userId: req.user.id });
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheBySectionId(sectionId);
        res.status(200).json({ success: true, message: 'Section deleted' });
    } catch (error) {
        logger.error('Error deleting CMS section:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const archiveSection = async (req, res) => {
    try {
        const { id } = req.params;
        await cmsModel.archiveSection(id, { userId: req.user.id });
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheBySectionId(id);
        res.status(200).json({ success: true, message: 'Section archived' });
    } catch (error) {
        logger.error('Error archiving CMS section:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const unarchiveSection = async (req, res) => {
    try {
        const { id } = req.params;
        await cmsModel.unarchiveSection(id);
        await redisClient.incr('resource_version:web_pages');
        await invalidatePageCacheBySectionId(id);
        res.status(200).json({ success: true, message: 'Section unarchived' });
    } catch (error) {
        logger.error('Error unarchiving CMS section:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const reorderSections = async (req, res) => {
    try {
        const { orderedIds } = req.body;
        await cmsModel.reorderSections(orderedIds);
        await redisClient.incr('resource_version:web_pages');
        if (orderedIds.length > 0) await invalidatePageCacheBySectionId(orderedIds[0]);
        res.status(200).json({ success: true });
    } catch (error) {
        logger.error('Error reordering CMS sections:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === ADMIN — TEMPLATES ===

const getTemplates = async (req, res) => {
    try {
        const themes = await cmsModel.getThemes();
        const sectionPresets = await cmsModel.getSectionPresets();
        const blockTemplates = await cmsModel.getBlockTemplates();

        res.status(200).json({
            success: true,
            data: {
                themes,
                sections: sectionPresets,
                blocks: blockTemplates
            }
        });
    } catch (error) {
        logger.error('Error fetching CMS templates:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === ADMIN — FOOTERS ===

const getFooter = async (req, res) => {
    try {
        const { id, id_project } = req.query;
        const projectId = id_project !== undefined ? (id_project === 'null' || id_project === '' ? null : id_project) : null;
        
        let footer = await cmsModel.getFooterForAdmin(id ? parseInt(id, 10) : null, projectId);
        
        // If it doesn't exist for a specific project, fall back to the default project footer
        if (!footer && projectId) {
            footer = await cmsModel.getFooterForAdmin(null, null);
        }
        
        if (!footer) {
            return res.status(404).json({ success: false, message: 'Footer not found' });
        }
        
        res.status(200).json({ success: true, data: footer });
    } catch (error) {
        logger.error('Error fetching CMS footer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateFooter = async (req, res) => {
    try {
        const { id, name, blocks, settings } = req.body;
        if (!id) return res.status(400).json({ success: false, message: 'Footer ID required' });

        await cmsModel.updateFooter(id, { name, blocks, settings }, { userId: req.user.id });
        
        const footer = await db('web_footers').where({ id }).first();
        if (footer) {
            const projectId = footer.id_project || 0;
            await redisClient.del(`cms_footer:${projectId}`);
        }

        res.status(200).json({ success: true, message: 'Footer updated (Draft)' });
    } catch (error) {
        logger.error('Error updating CMS footer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const publishFooter = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: 'Footer ID required' });

        const success = await cmsModel.publishFooter(id);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Footer not found' });
        }

        const footer = await db('web_footers').where({ id }).first();
        if (footer) {
            const projectId = footer.id_project || 0;
            await redisClient.del(`cms_footer:${projectId}`);
        }

        res.status(200).json({ success: true, message: 'Footer published' });
    } catch (error) {
        logger.error('Error publishing CMS footer:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// === ADMIN — HEADERS ===

const getHeader = async (req, res) => {
    try {
        const { id, id_project } = req.query;
        const projectId = id_project !== undefined ? (id_project === 'null' || id_project === '' ? null : id_project) : null;
        
        let header = await cmsModel.getHeaderForAdmin(id ? parseInt(id, 10) : null, projectId);
        
        // If it doesn't exist for a specific project, fall back to the default project header
        if (!header && projectId) {
            header = await cmsModel.getHeaderForAdmin(null, null);
        }
        
        if (!header) {
            return res.status(404).json({ success: false, message: 'Header not found' });
        }
        
        res.status(200).json({ success: true, data: header });
    } catch (error) {
        logger.error('Error fetching CMS header:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateHeader = async (req, res) => {
    try {
        const { id, name, blocks, settings } = req.body;
        if (!id) return res.status(400).json({ success: false, message: 'Header ID required' });

        await cmsModel.updateHeader(id, { name, blocks, settings }, { userId: req.user.id });
        
        const header = await db('web_headers').where({ id }).first();
        if (header) {
            const projectId = header.id_project || 0;
            await redisClient.del(`cms_header:${projectId}`);
        }

        res.status(200).json({ success: true, message: 'Header updated (Draft)' });
    } catch (error) {
        logger.error('Error updating CMS header:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const publishHeader = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: 'Header ID required' });

        const success = await cmsModel.publishHeader(id);
        if (!success) {
            return res.status(404).json({ success: false, message: 'Header not found' });
        }

        const header = await db('web_headers').where({ id }).first();
        if (header) {
            const projectId = header.id_project || 0;
            await redisClient.del(`cms_header:${projectId}`);
        }

        res.status(200).json({ success: true, message: 'Header published' });
    } catch (error) {
        logger.error('Error publishing CMS header:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === ADMIN — NAVIGATIONS ===

const getNavigations = async (req, res) => {
    try {
        const navigations = await db('web_navigations')
            .where({ archived: 0, inactive: 0 })
            .orderBy('sort_order', 'asc');
        const parsedNavigations = navigations.map(nav => {
            let parsedSettings = nav.settings;
            if (typeof parsedSettings === 'string') {
                try { parsedSettings = JSON.parse(parsedSettings); } catch (e) { parsedSettings = {}; }
            }
            return { ...nav, settings: parsedSettings || {} };
        });
        res.status(200).json({ success: true, data: parsedNavigations });
    } catch (error) {
        logger.error('Error fetching CMS navigations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateNavigations = async (req, res) => {
    try {
        const { navigations } = req.body;
        if (!Array.isArray(navigations)) {
            return res.status(400).json({ success: false, message: 'Navigations array required' });
        }

        await db.transaction(async (trx) => {
            const currentNavs = await trx('web_navigations').select('id').where({ archived: 0, inactive: 0 });
            const currentIds = currentNavs.map(n => String(n.id));
            const incomingIds = [];
            const idMap = {};

            const sortedNavs = [...navigations].sort((a, b) => {
                if (!a.parent_id && b.parent_id) return -1;
                if (a.parent_id && !b.parent_id) return 1;
                return 0;
            });

            for (let i = 0; i < sortedNavs.length; i++) {
                const nav = sortedNavs[i];
                if (!nav.id) continue;

                const isNew = String(nav.id).startsWith('new_');
                let parentId = nav.parent_id;
                if (parentId && idMap[parentId]) {
                    parentId = idMap[parentId];
                }

                if (isNew) {
                    const [newId] = await trx('web_navigations').insert({
                        label: nav.label || 'New Link',
                        url: nav.url || '#',
                        target: nav.target || (nav.settings && nav.settings.target) || '_self',
                        parent_id: parentId || null,
                        sort_order: i,
                        settings: JSON.stringify(nav.settings || {})
                    });
                    idMap[nav.id] = newId;
                    incomingIds.push(String(newId));
                } else {
                    await trx('web_navigations').where({ id: nav.id }).update({
                        label: nav.label,
                        url: nav.url,
                        target: nav.target || (nav.settings && nav.settings.target) || '_self',
                        parent_id: parentId || null,
                        sort_order: i,
                        settings: JSON.stringify(nav.settings || {})
                    });
                    incomingIds.push(String(nav.id));
                }
            }

            const idsToDelete = currentIds.filter(id => !incomingIds.includes(id));
            if (idsToDelete.length > 0) {
                await trx('web_navigations').whereIn('id', idsToDelete).update({ inactive: 1, archived: 1 });
            }
        });

        const keys = await redisClient.keys('cms_navigations*');
        if (keys.length) await redisClient.del(keys);

        res.status(200).json({ success: true, message: 'Navigations updated' });
    } catch (error) {
        logger.error('Error updating CMS navigations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getPublicPage,
    listPages,
    getPageForEdit,
    createPage,
    updatePage,
    publishPage,
    deletePage,
    archivePage,
    unarchivePage,
    getSections,
    createSection,
    updateSection,
    publishSection,
    deleteSection,
    archiveSection,
    unarchiveSection,
    reorderSections,
    getTemplates,
    getFooter,
    updateFooter,
    publishFooter,
    getHeader,
    updateHeader,
    publishHeader,

    // Navigations
    getNavigations,
    updateNavigations,
};
