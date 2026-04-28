import { Router } from "express"
import { connect } from "../models/supabase"
import { getByEmail, getAll } from "../models/Users"

const router = Router()

type UserIdentity = {
    id: string
    email: string
}

router.get("/", async (req, res) => {
    const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : ""
    const supabase = connect()
    
    try {
        // Try Supabase Auth users first
        const { data, error } = await supabase.auth.admin.listUsers()

        if (!error && data?.users && data.users.length > 0) {
            const authUsers: UserIdentity[] = data.users.map((user) => ({
                id: user.id,
                email: user.email ?? "",
            }))

            const filteredUsers = email
                ? authUsers.filter((user) => user.email.toLowerCase() === email)
                : authUsers

            return res.send({ isSuccess: true, data: filteredUsers, total: filteredUsers.length })
        }

        // Fall back to app Users table
        if (email) {
            const result = await getByEmail(email)
            const appUsers: UserIdentity[] = (result.data ?? []).map((user: any) => ({
                id: user.id,
                email: user.email ?? "",
            }))
            return res.send({ isSuccess: true, data: appUsers, total: appUsers.length })
        } else {
            const result = await getAll()
            const appUsers: UserIdentity[] = (result.data ?? []).map((user: any) => ({
                id: user.id,
                email: user.email ?? "",
            }))
            return res.send({ isSuccess: true, data: appUsers, total: appUsers.length })
        }
    } catch (err: any) {
        res.send({
            isSuccess: false,
            message: `Error fetching users: ${err.message}`,
            data: [],
            total: 0,
        })
    }
})

export default router
