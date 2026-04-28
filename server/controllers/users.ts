import { Router } from "express"

const router = Router()

router.get("/", (_req, res) => {
    res.send({ isSuccess: true, data: [], total: 0 })
})

export default router
