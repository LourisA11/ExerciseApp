import type { User } from "../types"
import data1 from "../data/users.json"
import { PagingRequest } from "../types/dataEnvelope"
import { connect } from "./supabase"

type ItemType = User
const data = {
    ...data1,
    items: data1.users,
}

export function getAll(params: PagingRequest) {
    let list = data.items as ItemType[]
    const count = list.length

    if (params?.search) {
        const search = params.search.toLowerCase()
        list = list.filter((item) =>
            `${item.firstName} ${item.lastName}`.toLowerCase().includes(search),
        )
    }
   if (params?.sortBy) {
        list = list.sort((a, b) => {
            const aVal = a[params.sortBy as keyof ItemType]
            const bVal = b[params.sortBy as keyof ItemType]
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
            return params.descending ? -comparison : comparison
        })
    }
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    list = list.slice(start, start + pageSize)

    return { list, count }
}

/**
 * Update User by id
 */
export async function update(id: string, payload: Record<string, unknown>) {
  const { data, error } = await connect()
    .from("Users")
    .update({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      age: payload.age,
      height: payload.height,
      weight: payload.weight,
      role: payload.role,
    })
    .eq("id", id)
    .select("*")
    .single()

  return {
    isSuccess: !error,
    message: error?.message,
    data: data ?? null,
}
}

// export function update(id: number, user: Partial<ItemType>) {
//     const index = data.items.findIndex((u) => u.id === id)
//     if (index === -1) {
//         const error = { status: 404, message: "ItemType not found" }
//         throw error
//     }
//     const updatedItemType = {
//         ...data.items[index],
//         ...user,
//     }
//     data.items[index] = updatedItemType as any
//     return updatedItemType
// }

export function remove(id: number) {
    const index = data.items.findIndex((u) => u.id === id)
    if (index === -1) {
        const error = { status: 404, message: "ItemType not found" }
        throw error
    }
    const removedItemType = data.items.splice(index, 1)[0]
    return removedItemType as ItemType
}

export function get (id: number) {
    const itemType = data.items.find((u) => u.id === id)
    if (!itemType) {
        const error = { status: 404, message: "ItemType not found" }
        throw error
    }
    return itemType as ItemType
}

