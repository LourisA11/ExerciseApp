import express from 'express';
import * as model from '../models/userShortcuts.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Extract the ID from the header we just allowed
        const userId = req.headers['user-id']; 
        
        if (!userId) {
            return res.status(400).send({ message: "User ID header is missing" });
        }

        const shortcuts = await model.getByUser(userId);
        res.send(shortcuts);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await model.upsert(req.body);
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await model.remove(req.params.id);
        res.send({ isSuccess: true });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

export default router;