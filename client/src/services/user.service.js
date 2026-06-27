import api from '../api/api';

const updatePreferences = (preferences) => {
    return api.put('/api/user/preferences', preferences);
};

export const userPreferenceService = {
    updatePreferences,
};