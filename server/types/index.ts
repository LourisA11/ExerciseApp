export type { DataEnvelope, DataListEnvelope } from "./dataEnvelope"

export type Exercise = {
    id: number
    name: string
    sets: number
    reps: number
    weight: number
    type: string
    duration: number
    date: string
}
   



export type UserRole = "admin" | "moderator" | "user"

export type User = {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    birthDate: string
    role: UserRole
}

export type UserStats = {
    workoutsThisMonth: number
    weight: number
    height: number
    gender: string
    age: number
}

