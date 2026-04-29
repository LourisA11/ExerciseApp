import { Router } from "express"
import { getAll, update, get, remove} from "../models/users"
import { User, DataEnvelope, DataListEnvelope } from "../types"

const app = Router()

app.get("/", async (req, res) => {
    const { list, count } = await getAll(req.query)
    
    const sanitizedUsers = list.map((x) => ({
        ...x,
        password: undefined,
    }))
    
    const response: DataListEnvelope<User> = {
        data: sanitizedUsers,
        isSuccess: true,
        total: count,
    }
    res.send(response)
})
.get("/count", async (req, res) => {
    // 1. Await here as well
    const { count } = await getAll(req.query)
    const response: DataEnvelope<{ count: number }> = {
        data: { count },
        isSuccess: true,
    }
    res.send(response)
})
.get("/:id", async (req, res) => {
    const { id } = req.params
    // Since your DB uses UUIDs (strings), we don't convert to Number anymore
    const response: DataEnvelope<User> = {
        data: await get(id), 
        isSuccess: true,
    }
    res.send(response)
})
.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const result = await update(id, req.body);
    
    const response: DataEnvelope<User> = {
        data: result.data as User, 
        isSuccess: result.isSuccess,
    };
    res.send(response);
})
.delete("/:id", async (req, res) => {
    const { id } = req.params
    // Await the removal and don't convert ID to Number if using UUIDs
    const result = await remove(id) 
    
    const response: DataEnvelope<any> = {
        data: result,
        isSuccess: true,
    }
    res.send(response)
})

export default app