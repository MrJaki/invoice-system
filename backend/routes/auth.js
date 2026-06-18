const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const dbUsers = require('../model/dbUsers');
const { signToken } = require('../lib/auth');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

/**
 * Adding new user
 */
router.post('/register', async (req, res) => {
    const { email, password, password_repeat, name, surname, invite_code } = req.body;
    if (!email || !password || !password_repeat || !name || !surname || !invite_code) {
        return res.status(400).json({ success: false, error: 'Manjkajo obvezna polja.' });
    }

    if (password.length < 10) {
        return res.status(400).json({ success: false, error: 'Geslo mora biti dolgo vsaj 10 znakov.' });
    }

    if (password_repeat !== password) {
        return res.status(400).json({ success: false, error: 'Gesli se ne ujemata!' });
    }

    try {
        const code = await dbUsers.getInviteCode(invite_code);
        if (!code) return res.status(400).json({ success: false, error: 'Koda za povabilo ni veljavna!' });

        const hash = await bcrypt.hash(process.env.APP_SECRET + password, 10);
        const user = await dbUsers.create(email, hash, name, surname);

        await dbUsers.updateState(invite_code);

        res.json({ success: true, data: user});
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, error: 'Uporabnik s tem emailom že ostaja!'});
        }
        console.log(err);
        res.status(500).json({ success: false, error: 'Napaka pri registraciji.'});
    }
});

/**
 * Logging in user
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Manjkata emal ali geslo.'});
    }

    try {
        const user = await dbUsers.getByEmail(email);

        if (!user || !user.aktiven) {
            return res.status(401).json({ success: false, error: 'Napačni podakti za prijavo.'});
        }

        const ok = await bcrypt.compare(process.env.APP_SECRET + password, user.password_hash);

        if (!ok) {
            return res.status(401).json({ success: false, error: 'Napačni podakti za prijavo.'});
        }

        const token = signToken(user);
        res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, email: user.email, ime: user.ime, priimek: user.priimek, vloga: user.vloga }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Napaka pri prijavi.'});
    }
});

/**
 * Generating and storing new invite code
 * Only admins can generate it
 */
router.post('/invite-code', requireAuth, requireRole('admin'), async (req, res ) =>{
    const invite_code = crypto.randomBytes(3).toString('hex').toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    try {
        const code = await dbUsers.addInviteCode(invite_code);

        res.json({ success: true, data: code });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Napaka pri prijavi.'});
    }
});

/**
 * Returns information about current user (check token)
 */
router.get('/me', requireAuth, async(req, res) => {
    const user = await dbUsers.getById(req.user.id);
    res.json({ success:true, data: user });
});

module.exports = router;