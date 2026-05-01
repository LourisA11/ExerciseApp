import { Router } from "express"
import { add, get, getAll, remove, seed, update } from "../models/UserExercise"

const app = Router()

app.get("/", async (_req, res) => {
    const response = await getAll()
    res.send(response)
})
    .get("/:id", async (req, res) => {
        const { id } = req.params
        const response = await get(Number(id))
        res.send(response)
    })
   .post('/', (req, res) => {
    const user_id = req.headers['user-id']; // Get from header
    const { exercise_id, weight_lb } = req.body; 

    if (!user_id || !exercise_id) {
        return res.status(400).json({ message: "Missing user_id or exercise_id" });
    }
    // ... save to database
})
    .patch("/:id", async (req, res) => {
        const { id } = req.params
        const response = await update(Number(id), req.body)
        res.send(response)
    })
    .delete("/:id", async (req, res) => {
        const { id } = req.params
        const response = await remove(Number(id))
        res.send(response)
    })
    .post("/seed", async (req, res) => {
        const items = Array.isArray(req.body?.items)
            ? req.body.items
            : Array.isArray(req.body)
                ? req.body
                : []

        const response = await seed(items)
        res.send(response)
    })

export default app
