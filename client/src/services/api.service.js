import api from '../api/api';

export const createResourceService = (resourceName) => {
    const resourceUrl = `/api/${resourceName}`;

    return {
        getAll: (params = {}) => api.get(resourceUrl, { params }),
        getPhoto: (photoUrl, config = {}) => { return api.get(photoUrl, { responseType: 'blob', ...config }); },
        create: (formData) => api.post(resourceUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
        update: (id, formData) => api.put(`${resourceUrl}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
        remove: (id, deleteLog = true) => api.patch(`${resourceUrl}/${id}/delete`, { deleteLog }),
        undelete: (id) => api.patch(`${resourceUrl}/${id}/undelete`),
        archive: (id, archivedLog = true) => api.patch(`${resourceUrl}/${id}/archive`, { archivedLog }),
        unarchive: (id) => api.patch(`${resourceUrl}/${id}/unarchive`),
    };
};

const baseUserService = createResourceService('users');

export const userService = {
    ...baseUserService,
    getAdminList: () => api.get('/api/admin/users'),
    create: (formData) => api.post('/api/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (userId, formData) => api.put(`/api/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export const positionService = createResourceService('positions');
export const projectService = createResourceService('projects');

export const apiService = {
    users: userService,
    positions: positionService,
    projects: projectService
};

export default apiService;