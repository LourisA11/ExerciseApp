import { Router } from "express"
import { getAll, update, get, remove} from "../models/users"

import { User, DataEnvelope, DataListEnvelope } from "../types"


const app = Router()

app.get("/", async(req, res) => {
    const { list, count } = getAll(req.query)
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
        const { count } = getAll(req.query)
        const response: DataEnvelope<{ count: number }> = {
            data: { count },
            isSuccess: true,
        }
        res.send(response)
    })
    .get("/:id", async (req, res) => {
        const { id } = req.params
        const response: DataEnvelope<User> = {
            data: await get(Number(id)),
            isSuccess: true,
        }
        res.send(response)
    })

    // .post("/", async (req, res) => {
    //     const newUser = await create(req.body)
    //     const response: DataEnvelope<User> = {
    //         data: newUser,
    //         isSuccess: true,
    //     }
    //     res.send(response)
    // })
.patch("/:id", async (req, res) => {
    const { id } = req.params;
    
    // 1. Call the update function
    const result = await update(id, req.body);
    
    // 2. Extract the actual user from the result's data property
    // We assume 'result' is the envelope coming from your model/service
    const response: DataEnvelope<User> = {
        data: result.data as User, 
        isSuccess: result.isSuccess,
    };
    
    res.send(response);
})
    .delete("/:id", async (req, res) => {
        const { id } = req.params
        const removedUser = await remove(Number(id))
        const response: DataEnvelope<User> = {
            data: removedUser,
            isSuccess: true,
            message: `User ${removedUser.firstName} ${removedUser.lastName} has been removed.`,
        }
        res.send(response)
    })

export default app
