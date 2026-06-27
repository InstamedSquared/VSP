import api from '../api/api';

const CMS_URL = '/api/cms';

export const cmsAdminService = {
    // Pages — getAll follows the createResourceService pattern for DataTable compatibility
    getAll: (params = {}) => api.get(`${CMS_URL}/pages`, { params }),
    getPages: (params = {}) => api.get(`${CMS_URL}/pages`, { params }),
    getPageForEdit: (id) => api.get(`${CMS_URL}/pages/${id}`),
    create: (formData) => api.post(`${CMS_URL}/pages`, formData),
    update: (id, formData) => api.put(`${CMS_URL}/pages/${id}`, formData),
    remove: (id) => api.patch(`${CMS_URL}/pages/${id}/delete`),

    // Sections
    getSections: (pageId) => api.get(`${CMS_URL}/sections/${pageId}`),
    createSection: (data) => api.post(`${CMS_URL}/sections`, data),
    updateSection: (id, data) => api.put(`${CMS_URL}/sections/${id}`, data),
    deleteSection: (id) => api.patch(`${CMS_URL}/sections/${id}/delete`),
    reorderSections: (orderedIds) => api.put(`${CMS_URL}/sections/reorder`, { orderedIds }),

    // Blocks
    createBlock: (data) => api.post(`${CMS_URL}/blocks`, data),
    updateBlock: (id, data) => api.put(`${CMS_URL}/blocks/${id}`, data),
    deleteBlock: (id) => api.patch(`${CMS_URL}/blocks/${id}/delete`),
    reorderBlocks: (orderedIds) => api.put(`${CMS_URL}/blocks/reorder`, { orderedIds }),

    // Templates
    getTemplates: () => api.get(`${CMS_URL}/templates`),

    // Public
    getPublicPage: (slug) => api.get(`/api/cms/page/${slug}`),
};
