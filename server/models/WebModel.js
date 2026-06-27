const ResourceModel = require('./ResourceModel');

class WebModel extends ResourceModel {
    constructor() {
        super('settings');
    }

    async getSettings() {
        try {
            const results = await this.select(['setting_key', 'setting_value'], { inactive: 0, archived: 0 });
            // console.log('--- DB SETTINGS FETCHED ---', results.length, 'rows');

            return results.reduce((acc, current) => {
                let value = current.setting_value;
                try {
                    if (value && typeof value === 'string' && (value.trim().startsWith('[') || value.trim().startsWith('{'))) {
                        value = JSON.parse(value);
                    }
                } catch (e) {
                    console.warn(`Failed to parse setting ${current.setting_key}:`, value);
                }
                acc[current.setting_key] = value;
                return acc;
            }, {});
        } catch (error) {
            console.error('CRITICAL: WebModel.getSettings failed:', error);
            throw error;
        }
    }

    async getPageContent(pageName) {
        const db = require('../config/db');
        const results = await db('settings_pages')
            .select('section_key', 'content', 'ord')
            .where({ page: pageName, inactive: 0, archived: 0 })
            .orderBy('ord');

        return results.map(section => {
            let contentValue = section.content;
            try {
                if (contentValue && (typeof contentValue === 'string') && (contentValue.trim().startsWith('[') || contentValue.trim().startsWith('{'))) {
                    contentValue = JSON.parse(contentValue);
                }
            } catch (e) {
                // Keep as string
            }
            return {
                key: section.section_key,
                content: contentValue,
                order: section.ord
            };
        });
    }

    async updateSetting(key, value) {
        try {
            const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            const [existing] = await this.select('id', { setting_key: key });

            if (existing) {
                console.log(`Updating setting: ${key}`);
                return await this.update({ id: existing.id }, { setting_value: strValue });
            } else {
                console.log(`Inserting new setting: ${key}`);
                return await this.insert({ setting_key: key, setting_value: strValue });
            }
        } catch (error) {
            console.error(`Error in updateSetting for ${key}:`, error);
            throw error;
        }
    }

    async updatePageSection(page, sectionKey, content) {
        const pageModel = new ResourceModel('settings_pages');
        const strContent = typeof content === 'object' ? JSON.stringify(content) : String(content);
        return await pageModel.update({ page, section_key: sectionKey }, { content: strContent });
    }
}

module.exports = new WebModel();
