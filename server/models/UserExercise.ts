import { connect } from "./supabase"

const conn = connect()
const TABLE_NAME = "UserExercise"

/**
 * Get all UserExercise rows
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
 * Get UserExercise by id
 */
export async function get(id: number) {
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
 * Add a new UserExercise row
 */
export async function add(
	payload: Record<string, unknown>,
) {
	const { data, error } = await conn
		.from(TABLE_NAME)
		.insert([
			{
				user_id: payload.user_id ?? null,
				exercise_id: payload.exercise_id ?? null,
				weight_lb: payload.weight_lb ?? null,
				reps: payload.reps ?? null,
				durations_min: payload.durations_min ?? null,
				distance: payload.distance ?? null,
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
 * Update UserExercise by id
 */
export async function update(
	id: number,
	payload: Record<string, unknown>,
) {
	const { data, error } = await conn
		.from(TABLE_NAME)
		.update({
			user_id: payload.user_id,
			exercise_id: payload.exercise_id,
			weight_lb: payload.weight_lb,
			reps: payload.reps,
			durations_min: payload.durations_min,
			distance: payload.distance,
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
 * Remove UserExercise by id
 */
export async function remove(
	id: number,
) {
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
 * Seed UserExercise rows
 */
export async function seed(
	items: Record<string, unknown>[],
) {
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
