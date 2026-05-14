import { Router } from "express"
import { add, get, getAll, remove, seed, update } from "../models/UserExercise"

const app = Router()

app.get("/", async (req, res) => {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const response = await getAll(page, limit)

    res.send(response)
})
    .get("/:id", async (req, res) => {
        const { id } = req.params
        const response = await get(Number(id))
        res.send(response)
    })
    .post("/", async (req, res) => {
        const response = await add(req.body)
        res.send(response)
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
