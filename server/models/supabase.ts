import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { existsSync } from "node:fs"
import path from "node:path"

config()

const rootEnvPath = path.resolve(process.cwd(), ".env")
if (existsSync(rootEnvPath)) {
    config({ path: rootEnvPath })
}

const clientEnvPath = path.resolve(process.cwd(), "client/.env")
if (existsSync(clientEnvPath)) {
    config({ path: clientEnvPath })
}

export function connect() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ""
    const supabaseKey =
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        ""

    if (!supabaseUrl) {
        throw new Error(
            "Missing Supabase URL. Set SUPABASE_URL or VITE_SUPABASE_URL in your .env file.",
        )
    }

    if (!supabaseKey) {
        throw new Error(
            "Missing Supabase key. Set SUPABASE_SECRET_KEY/SUPABASE_ANON_KEY (or VITE_* equivalent) in your .env file.",
        )
    }

    return createClient(supabaseUrl, supabaseKey)
}

export function filterKeys<T extends object>(
    obj: T,
    keys: (keyof T)[],
): Partial<T> {
    const filtered: Partial<T> = {}
    for (const key of keys) {
        if (key in obj) {
            filtered[key] = obj[key]
        }
    }
    return filtered
}

export function toCamelCase(
    obj: Record<string, unknown>,
): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_match, p1) =>
            p1.toUpperCase(),
        )
        result[camelKey] = obj[key]
    }
    return result
}

export function toSnakeCase(
    obj: Record<string, unknown>,
): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key in obj) {
        const snakeKey = key.replace(
            /([A-Z])/g,
            (match) => `_${match.toLowerCase()}`,
        )
        result[snakeKey] = obj[key]
    }
    return result
}

 export { createClient } 
