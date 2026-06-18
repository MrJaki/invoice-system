const { verifyToken } = require('../lib/auth');

module.exports = function(req, res, next) {
    const header = req.headers.authorization; // 'Bearer fdcd...'
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Manjka avtorizacija.' });
    }
    const token = header.slice('Bearer '.length);

    try {
        const payload = verifyToken(token);
        req.user = { id: payload.sub, vloga: payload.vloga };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Neveljaven ali potekel žeton.' });
    }
};