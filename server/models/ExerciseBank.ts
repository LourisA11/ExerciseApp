import { connect } from "./supabase"

const conn = connect()
const TABLE_NAME = "ExerciseBank"
const PAGE_SIZE = 1000

/**
 * Get all ExerciseBank rows
 */
export async function getAll() {
	const allRows: Record<string, unknown>[] = []
	let from = 0
	let to = PAGE_SIZE - 1
	let total = 0

	while (true) {
		const { data, error, count } = await conn
			.from(TABLE_NAME)
			.select("*", { count: "exact" })
			.order("created_at", { ascending: true })
			.range(from, to)

		if (error) {
			return {
				isSuccess: false,
				message: error.message,
				data: [],
				total: 0,
			}
		}

		const rows = data ?? []
		allRows.push(...rows)
		total = count ?? allRows.length

		if (rows.length < PAGE_SIZE) {
			break
		}

		from += PAGE_SIZE
		to += PAGE_SIZE
	}

	return {
		isSuccess: true,
		message: undefined,
		data: allRows,
		total,
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
