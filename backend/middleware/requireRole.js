module.exports = function(vloga) {
    return function(req, res, next) {
        if (!req.user || req.user.vloga !== vloga) {
            return res.status(403).json({ success: false, error: 'Nimaš pravice za to operacijo!.'});
        }
        next();
    };
};