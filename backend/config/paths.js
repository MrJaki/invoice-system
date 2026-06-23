const path = require('path');

function getConfigPath() {
    try {
        const { app } = require('electron');

        if (app && typeof app.isReady === 'function' && app.isReady()) {
            return path.join(
                app.getPath('userData'),
                'user_preferences.json'
            );
        }
    } catch (err) {
        // Electron is not available (running outside Electron)
        console.warn('Electron app path unavailable:', err.message);
    }

    return path.join(
        __dirname,
        '..',
        'user_preferences.json'
    );
}

module.exports = {
    getConfigPath
};