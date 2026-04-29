import express from 'express';
const router = express.Router();

// Mock data or Database call
router.get('/', (req, res) => {
    // This handles GET /api/user-activities
    res.send({ list: [], count: 0 });
});

router.post('/', (req, res) => {
    // This handles POST /api/user-activities (creating a workout)
    const newActivity = req.body;
    res.send(newActivity);
});

export default router;