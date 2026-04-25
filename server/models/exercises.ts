import type { Exercise } from "../types"
import data1 from "../data/exercises.json"
import { PagingRequest } from "../types/dataEnvelope"
import { connect } from "./supabase"

type ItemType = Exercise
const data = {
    ...data1,
    items: data1.excercise.map((item: any) => ({
        ...item,
        type: item.type.join(", "), // Convert string array to a comma-separated string
    })),
}

export function getAll(params: PagingRequest) {
    let list = data.items as ItemType[]
    const count = list.length

    if (params?.search) {
        const search = params.search.toLowerCase()
        list = list.filter((item) =>
            `${item.name}`.toLowerCase().includes(search),
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

export function get(id: number): ItemType {
    const item = data.items.find((item) => item.id === id)
    if (!item) {
        const error = { status: 404, message: "ExerciseType not found" }
        throw error
    }
    return item as ItemType
}

export function create(exerciseType: ItemType) {
    const newItemType = {
        ...exerciseType,
        id: data.items.length + 1,
    }
    data.items.push(newItemType as any)
    return newItemType
}

export function update(id: number, exerciseType: Partial<ItemType>) {
    const index = data.items.findIndex((u) => u.id === id)
    if (index === -1) {
        const error = { status: 404, message: "ExerciseType not found" }
        throw error
    }
    const updatedItemType = {
        ...data.items[index],
        ...exerciseType,
    }
    data.items[index] = updatedItemType as any
    return updatedItemType
}

export function remove(id: number) {
    const index = data.items.findIndex((u) => u.id === id)
    if (index === -1) {
        const error = { status: 404, message: "ExerciseType not found" }
        throw error
    }
    const removedItemType = data.items.splice(index, 1)[0]
    return removedItemType as ItemType
}