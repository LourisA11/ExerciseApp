import express from 'express';
import * as model from '../models/userActivities';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch real data from the database
        const activities = await model.getAll(); 
        res.send({ 
            list: activities, 
            count: activities.length 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ isSuccess: false, message: 'Failed to fetch activities' });
    }
});

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        
        // Ensure the payload has the required fields before saving
        if (!payload.user_id || !payload.exercise_id) {
            return res.status(400).send({ 
                isSuccess: false, 
                message: 'Missing user_id or exercise_id' 
            });
        }
        const newActivity = await model.create(payload);
        res.status(201).send(newActivity);
    } catch (err) {
        console.error(err);
        res.status(500).send({ isSuccess: false, message: 'Failed to create activity' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await model.remove(id);
        res.send({ isSuccess: true, message: 'Activity deleted' });
    } catch (err) {
        res.status(500).send({ isSuccess: false, message: 'Failed to delete activity' });
    }
});

export default router;