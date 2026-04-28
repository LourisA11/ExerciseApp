import { Router } from "express"
import { connect } from "../models/supabase"

const router = Router()

type UserIdentity = {
    id: string
    email: string
}

router.get("/", async (req, res) => {
    const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : ""
    const supabase = connect()
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
        res.send({
            isSuccess: false,
            message: `Unable to read Supabase Auth users: ${error.message}`,
            data: [],
            total: 0,
        })
        return
    }

    const authUsers: UserIdentity[] = (data?.users ?? []).map((user) => ({
        id: user.id,
        email: user.email ?? "",
    }))

    const filteredUsers = email
        ? authUsers.filter((user) => user.email.toLowerCase() === email)
        : authUsers

    res.send({ isSuccess: true, data: filteredUsers, total: filteredUsers.length })
})

export default router
