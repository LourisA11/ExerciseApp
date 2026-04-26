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
