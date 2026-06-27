const ResourceModel = require('../models/ResourceModel');

exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const userTable = req.user.t === '0' ? 'users' : req.user.t === '1' ? 'employees' : 'clients';

        const preferences = {};
        if (req.body.sidebar !== undefined) { preferences.sidebar = req.body.sidebar; }
        if (req.body.dark !== undefined) { preferences.dark = req.body.dark; }

        if (Object.keys(preferences).length === 0) { return res.status(400).json({ success: false, message: 'No preference data provided.' }); }

        const user = new ResourceModel(userTable);
        await user.update({ id: userId }, preferences);

        res.status(200).json({ success: true, message: 'Preferences updated.' });
    }
    catch (error) { console.error('Update Preferences Error:', error); res.status(500).json({ success: false, message: 'Server error updating preferences.' }); }
};