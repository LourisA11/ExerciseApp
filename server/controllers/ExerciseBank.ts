import { Router } from "express"
import { getAll, get, add, update, remove, seed } from "../models/ExerciseBank"

const app = Router()

app.get("/", async (_req, res) => {
	const response = await getAll()
	res.send(response)
})
	.get("/:id", async (req, res) => {
		const { id } = req.params
		const response = await get(id)
		res.send(response)
	})
	.post("/", async (req, res) => {
		const response = await add(req.body)
		res.send(response)
	})
	.patch("/:id", async (req, res) => {
		const { id } = req.params
		const response = await update(id, req.body)
		res.send(response)
	})
	.delete("/:id", async (req, res) => {
		const { id } = req.params
		const response = await remove(id)
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
