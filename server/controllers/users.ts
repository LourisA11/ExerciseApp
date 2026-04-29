import { Router } from "express"
import { getAll, update,get, remove} from "../models/users"
import { User, DataEnvelope, DataListEnvelope } from "../types"
import { toCamelCase } from "../models/supabase"

const app = Router()

app.get("/", async (req, res) => {
    const { list, count } = await getAll(req.query)
    
    const sanitizedUsers = list.map((x) => {
        // 1. Convert snake_case (DB) to camelCase (Frontend)
        const camelUser = toCamelCase(x as unknown as Record<string, unknown>);
        
        return {
            ...camelUser,
            password: undefined, 
        }
    })
    
    const response: DataListEnvelope<any> = { 
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
app.get("/:id", async (req, res) => {
    const { id } = req.params
    
    // 1. Fetch the raw data from the model
    const rawUser = await get(id) 
    
    // 2. Convert to camelCase if the user exists
    const camelUser = rawUser ? toCamelCase(rawUser as any) : null;

    // 3. Set the envelope type to <User | null> so TypeScript is happy
    const response: DataEnvelope<any> = {
        data: camelUser, 
        isSuccess: !!camelUser, // True if found, false if null
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