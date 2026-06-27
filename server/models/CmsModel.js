const ResourceModel = require('./ResourceModel');
const db = require('../config/db');

class CmsModel extends ResourceModel {
    constructor() {
        super('web_pages');
    }

    // === PAGE METHODS ===

    async getPageBySlug(slug) {
        return db('web_pages').where({ slug, inactive: 0 }).first();
    }

    async getFullPage(slug) {
        const page = await db('web_pages').where({ slug, inactive: 0, status: 'published' }).first();
        if (!page) return null;

        const sections = await db('web_sections').where({ id_page: page.id, inactive: 0 }).orderBy('ord');
        
        const sectionsWithBlocks = sections.map(section => {
            let blocks = section.content_live || '[]';
            let settings = section.settings_live || '{}';
            try { blocks = typeof blocks === 'string' ? JSON.parse(blocks) : blocks; } catch (e) { blocks = []; }
            try { settings = typeof settings === 'string' ? JSON.parse(settings) : settings; } catch (e) { settings = {}; }
            
            return { 
                ...section, 
                blocks, 
                settings,
                // Clean up draft columns for public view
                content_draft: undefined,
                content_live: undefined,
                settings_draft: undefined,
                settings_live: undefined
            };
        });

        return { page, sections: sectionsWithBlocks };
    }

    async getFullPageForAdmin(pageId) {
        const page = await db('web_pages').where({ id: pageId, inactive: 0 }).first();
        if (!page) return null;
        return this._populateAdminPage(page);
    }

    async getFullPageBySlugForAdmin(slug) {
        const page = await db('web_pages').where({ slug, inactive: 0 }).first();
        if (!page) return null;
        return this._populateAdminPage(page);
    }

    async _populateAdminPage(page) {
        const sections = await db('web_sections').where({ id_page: page.id, inactive: 0 }).orderBy('ord');
        
        let hasUnpublished = false;
        const sectionsWithBlocks = sections.map(section => {
            let blocks = section.content_draft || '[]';
            let liveBlocks = section.content_live || '[]';
            let settings = section.settings_draft || '{}';
            let liveSettings = section.settings_live || '{}';

            try { blocks = typeof blocks === 'string' ? JSON.parse(blocks) : blocks; } catch (e) { blocks = []; }
            try { liveBlocks = typeof liveBlocks === 'string' ? JSON.parse(liveBlocks) : liveBlocks; } catch (e) { liveBlocks = []; }
            try { settings = typeof settings === 'string' ? JSON.parse(settings) : settings; } catch (e) { settings = {}; }
            try { liveSettings = typeof liveSettings === 'string' ? JSON.parse(liveSettings) : liveSettings; } catch (e) { liveSettings = {}; }
            
            const sectionChanges = JSON.stringify(blocks) !== JSON.stringify(liveBlocks) || 
                                 JSON.stringify(settings) !== JSON.stringify(liveSettings);

            if (sectionChanges) hasUnpublished = true;

            return { ...section, blocks, settings, has_changes: sectionChanges };
        });

        return { ...page, sections: sectionsWithBlocks, has_unpublished: hasUnpublished };
    }

    async publishPage(pageId, sectionsData = null) {
        return db.transaction(async (trx) => {
            if (sectionsData && Array.isArray(sectionsData)) {
                // If data provided from client, update draft columns AND live columns in one go
                for (const section of sectionsData) {
                    const updateData = {
                        content_draft: JSON.stringify(section.blocks || []),
                        settings_draft: JSON.stringify(section.settings || {}),
                        content_live: JSON.stringify(section.blocks || []),
                        settings_live: JSON.stringify(section.settings || {}),
                        section_name: section.section_name || ''
                    };
                    await trx('web_sections').where({ id: section.id, id_page: pageId }).update(updateData);
                }
            } else {
                // Fallback to old behavior: just copy existing draft to live
                const sections = await trx('web_sections').where({ id_page: pageId, inactive: 0 });
                for (const section of sections) {
                    await trx('web_sections').where({ id: section.id }).update({
                        content_live: section.content_draft,
                        settings_live: section.settings_draft
                    });
                }
            }
            // Update page status to published if it was draft
            await trx('web_pages').where({ id: pageId }).update({ status: 'published' });
        });
    }

    // === SECTION METHODS ===

    async getSections(pageId) {
        return db('web_sections').where({ id_page: pageId, inactive: 0 }).orderBy('ord');
    }

    async createSection(data, userId = null) {
        // Ensure JSON strings for draft columns
        if (data.blocks && typeof data.blocks === 'object') {
            data.content_draft = JSON.stringify(data.blocks);
            delete data.blocks;
        }
        if (data.settings && typeof data.settings === 'object') {
            data.settings_draft = JSON.stringify(data.settings);
            delete data.settings;
        }

        if (userId) {
            data.created_by = userId;
        }
        
        const [inserted] = await db('web_sections').insert(data).returning('id');
        const newId = inserted.id || inserted;
        return db('web_sections').where({ id: newId }).first();
    }

    async updateSection(id, data, logData = null) {
        const updateData = { ...data };
        if (updateData.blocks && typeof updateData.blocks === 'object') {
            updateData.content_draft = JSON.stringify(updateData.blocks);
            delete updateData.blocks;
        }
        if (updateData.settings && typeof updateData.settings === 'object') {
            updateData.settings_draft = JSON.stringify(updateData.settings);
            delete updateData.settings;
        }

        if (logData) {
            const [oldRecord] = await db('web_sections').where({ id }).select('*');
            if (oldRecord) {
                const excludedColumns = ['changelog', 'deleted_at', 'deleted_by', 'archived_at', 'archived_by', 'inactive', 'archived'];
                const changes = {};
                for (const key of Object.keys(updateData)) {
                    if (excludedColumns.includes(key)) continue;
                    const oldVal = oldRecord[key] ?? null;
                    const newVal = updateData[key] ?? null;
                    if (String(oldVal) !== String(newVal)) {
                        changes[key] = { from: oldVal, to: newVal };
                    }
                }
                if (Object.keys(changes).length > 0) {
                    let existing = [];
                    try { existing = oldRecord.changelog ? JSON.parse(oldRecord.changelog) : []; } catch { existing = []; }
                    existing.unshift({ timestamp: new Date().toISOString(), userId: logData.userId, changes });
                    updateData.changelog = JSON.stringify(existing);
                }
            }
        }

        return db('web_sections').where({ id }).update(updateData);
    }

    async publishSection(id) {
        const section = await db('web_sections').where({ id }).first();
        if (!section) return false;
        return db('web_sections').where({ id }).update({
            content_live: section.content_draft,
            settings_live: section.settings_draft
        });
    }

    async deleteSection(id, logData = null) {
        const data = { inactive: 1 };
        if (logData) {
            data.deleted_by = logData.userId;
            data.deleted_at = db.fn.now();
        }
        return db('web_sections').where({ id }).update(data);
    }

    async archiveSection(id, logData = null) {
        const data = { archived: 1 };
        if (logData) {
            data.archived_by = logData.userId;
            data.archived_at = db.fn.now();
        }
        return db('web_sections').where({ id }).update(data);
    }

    async unarchiveSection(id) {
        return db('web_sections').where({ id }).update({ archived: 0 });
    }

    async reorderSections(orderedIds) {
        await db.transaction(async (trx) => {
            for (let i = 0; i < orderedIds.length; i++) {
                await trx('web_sections').where({ id: orderedIds[i] }).update({ ord: i });
            }
        });
    }

    // === TEMPLATE METHODS ===

    async getThemes() {
        return db('layout_themes').where({ inactive: 0 }).orderBy('name');
    }

    async getSectionPresets() {
        return db('layout_sections').where({ inactive: 0 }).orderBy('category');
    }

    async getBlockTemplates() {
        return db('layout_blocks').where({ inactive: 0 }).orderBy('name');
    }

    async getTemplateByKey(key) {
        return db('layout_sections').where({ template_key: key, inactive: 0 }).first();
    }

    // === FOOTER METHODS ===

    async getFooterForAdmin(id, projectId = null) {
        let query = db('web_footers').where({ inactive: 0 });
        if (id) {
            query = query.where({ id });
        } else if (projectId !== undefined) {
            // Scope by project
            if (projectId === null || projectId === 0 || projectId === '0' || projectId === '') {
                query = query.where(builder => {
                    builder.where({ id_project: null }).orWhere({ id_project: 0 });
                });
            } else {
                query = query.where({ id_project: projectId });
            }
        }
        const footer = await query.first();
        if (!footer) return null;

        let content = footer.content_draft || '[]';
        let liveContent = footer.content_live || '[]';
        let settings = footer.settings_draft || '{}';
        let liveSettings = footer.settings_live || '{}';

        try { content = typeof content === 'string' ? JSON.parse(content) : content; } catch (e) { content = []; }
        try { liveContent = typeof liveContent === 'string' ? JSON.parse(liveContent) : liveContent; } catch (e) { liveContent = []; }
        try { settings = typeof settings === 'string' ? JSON.parse(settings) : settings; } catch (e) { settings = {}; }
        try { liveSettings = typeof liveSettings === 'string' ? JSON.parse(liveSettings) : liveSettings; } catch (e) { liveSettings = {}; }

        const hasChanges = JSON.stringify(content) !== JSON.stringify(liveContent) || 
                           JSON.stringify(settings) !== JSON.stringify(liveSettings);

        return { ...footer, content, settings, has_changes: hasChanges };
    }

    async updateFooter(id, data, logData = null) {
        const updateData = { ...data };
        if (updateData.blocks && typeof updateData.blocks === 'object') {
            updateData.content_draft = JSON.stringify(updateData.blocks);
            delete updateData.blocks;
        }
        if (updateData.settings && typeof updateData.settings === 'object') {
            updateData.settings_draft = JSON.stringify(updateData.settings);
            delete updateData.settings;
        }

        if (logData) {
            const [oldRecord] = await db('web_footers').where({ id }).select('*');
            if (oldRecord) {
                const excludedColumns = ['changelog', 'deleted_at', 'deleted_by', 'archived_at', 'archived_by', 'inactive', 'archived'];
                const changes = {};
                for (const key of Object.keys(updateData)) {
                    if (excludedColumns.includes(key)) continue;
                    const oldVal = oldRecord[key] ?? null;
                    const newVal = updateData[key] ?? null;
                    if (String(oldVal) !== String(newVal)) {
                        changes[key] = { from: oldVal, to: newVal };
                    }
                }
                if (Object.keys(changes).length > 0) {
                    let existing = [];
                    try { existing = oldRecord.changelog ? JSON.parse(oldRecord.changelog) : []; } catch { existing = []; }
                    existing.unshift({ timestamp: new Date().toISOString(), userId: logData.userId, changes });
                    updateData.changelog = JSON.stringify(existing);
                }
            }
        }

        return db('web_footers').where({ id }).update(updateData);
    }

    async publishFooter(id) {
        const footer = await db('web_footers').where({ id }).first();
        if (!footer) return false;
        return db('web_footers').where({ id }).update({
            status: 'published',
            content_live: footer.content_draft,
            settings_live: footer.settings_draft
        });
    }

    // === HEADER METHODS ===

    async getHeaderForAdmin(id, projectId = null) {
        let query = db('web_headers').where({ inactive: 0 });
        if (id) {
            query = query.where({ id });
        } else if (projectId !== undefined) {
            // Scope by project
            if (projectId === null || projectId === 0 || projectId === '0' || projectId === '') {
                query = query.where(builder => {
                    builder.where({ id_project: null }).orWhere({ id_project: 0 });
                });
            } else {
                query = query.where({ id_project: projectId });
            }
        }
        const header = await query.first();
        if (!header) return null;

        let content = header.content_draft || '[]';
        let liveContent = header.content_live || '[]';
        let settings = header.settings_draft || '{}';
        let liveSettings = header.settings_live || '{}';

        try { content = typeof content === 'string' ? JSON.parse(content) : content; } catch (e) { content = []; }
        try { liveContent = typeof liveContent === 'string' ? JSON.parse(liveContent) : liveContent; } catch (e) { liveContent = []; }
        try { settings = typeof settings === 'string' ? JSON.parse(settings) : settings; } catch (e) { settings = {}; }
        try { liveSettings = typeof liveSettings === 'string' ? JSON.parse(liveSettings) : liveSettings; } catch (e) { liveSettings = {}; }

        const hasChanges = JSON.stringify(content) !== JSON.stringify(liveContent) || 
                           JSON.stringify(settings) !== JSON.stringify(liveSettings);

        return { ...header, content, settings, has_changes: hasChanges };
    }

    async updateHeader(id, data, logData = null) {
        const updateData = { ...data };
        if (updateData.blocks && typeof updateData.blocks === 'object') {
            updateData.content_draft = JSON.stringify(updateData.blocks);
            delete updateData.blocks;
        }
        if (updateData.settings && typeof updateData.settings === 'object') {
            updateData.settings_draft = JSON.stringify(updateData.settings);
            delete updateData.settings;
        }

        if (logData) {
            const [oldRecord] = await db('web_headers').where({ id }).select('*');
            if (oldRecord) {
                const excludedColumns = ['changelog', 'deleted_at', 'deleted_by', 'archived_at', 'archived_by', 'inactive', 'archived'];
                const changes = {};
                for (const key of Object.keys(updateData)) {
                    if (excludedColumns.includes(key)) continue;
                    const oldVal = oldRecord[key] ?? null;
                    const newVal = updateData[key] ?? null;
                    if (String(oldVal) !== String(newVal)) {
                        changes[key] = { from: oldVal, to: newVal };
                    }
                }
                if (Object.keys(changes).length > 0) {
                    let existing = [];
                    try { existing = oldRecord.changelog ? JSON.parse(oldRecord.changelog) : []; } catch { existing = []; }
                    existing.unshift({ timestamp: new Date().toISOString(), userId: logData.userId, changes });
                    updateData.changelog = JSON.stringify(existing);
                }
            }
        }

        return db('web_headers').where({ id }).update(updateData);
    }

    async publishHeader(id) {
        const header = await db('web_headers').where({ id }).first();
        if (!header) return false;
        return db('web_headers').where({ id }).update({
            status: 'published',
            content_live: header.content_draft,
            settings_live: header.settings_draft
        });
    }
}

module.exports = new CmsModel();

