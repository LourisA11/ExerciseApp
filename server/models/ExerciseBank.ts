import { connect } from "./supabase"

const conn = connect()
const TABLE_NAME = "ExerciseBank"

/**
 * Get all ExerciseBank rows
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
 * Get ExerciseBank by id
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
 * Add a new ExerciseBank row
 */
export async function add(payload: Record<string, unknown>) {
	const { data, error } = await conn
		.from(TABLE_NAME)
		.insert([
			{
				name: payload.name ?? null,
				type: payload.type ?? null,
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
 * Update ExerciseBank by id
 */
export async function update(id: string, payload: Record<string, unknown>) {
	const { data, error } = await conn
		.from(TABLE_NAME)
		.update({
			name: payload.name,
			type: payload.type,
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
 * Remove ExerciseBank by id
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
 * Seed ExerciseBank rows
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
