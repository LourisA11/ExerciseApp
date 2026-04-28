import { connect } from "./supabase"

const conn = connect()
const TABLE_NAME = "Users"

export interface UserRecord {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  age?: number
  height?: number
  weight?: number
  role?: string
  created_at?: string
}

/**
 * Get all Users rows
 */
export async function getAll() {
  const { data, error, count } = await conn
    .from(TABLE_NAME)
    .select("*", { count: "estimated" })

  return {
    isSuccess: !error,
    message: error?.message,
    data: data ?? [],
    total: count ?? 0,
  }
}

/**
 * Get User by id
 */
export async function get(id: string) {
  const { data, error } = await conn
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single()

  return {
    isSuccess: !error,
    message: error?.message,
    data: data ?? null,
  }
}

/**
 * Get User by email
 */
export async function getByEmail(email: string) {
  const { data, error } = await conn
    .from(TABLE_NAME)
    .select("*")
    .eq("email", email.toLowerCase())

  return {
    isSuccess: !error,
    message: error?.message,
    data: data ?? [],
  }
}

/**
 * Add a new User row
 */
export async function add(payload: Record<string, unknown>) {
  const { data, error } = await conn
    .from(TABLE_NAME)
    .insert([
      {
        email: payload.email ?? null,
        firstName: payload.firstName ?? null,
        lastName: payload.lastName ?? null,
        age: payload.age ?? null,
        height: payload.height ?? null,
        weight: payload.weight ?? null,
        role: payload.role ?? "user",
      },
    ])
    .select("*")
    .single()

  return {
    isSuccess: !error,
    message: error?.message,
    data: data ?? null,
  }
}

/**
 * Update User by id
 */
export async function update(id: string, payload: Record<string, unknown>) {
  const { data, error } = await conn
    .from(TABLE_NAME)
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

/**
 * Remove User by id
 */
export async function remove(id: string) {
  const { data, error } = await conn
    .from(TABLE_NAME)
    .delete()
    .eq("id", id)
    .select("*")
    .single()

  return {
    isSuccess: !error,
    message: error?.message,
    data: data ?? null,
  }
}

/**
 * Seed Users rows
 */
export async function seed(items: Record<string, unknown>[]) {
  const inserted: unknown[] = []

  for (const item of items) {
    const result = await add(item)
    if (result.data) {
      inserted.push(result.data)
    }
  }

  return {
    isSuccess: true,
    data: inserted,
  }
}
