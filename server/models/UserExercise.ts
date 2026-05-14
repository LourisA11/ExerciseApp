import { connect } from "./supabase"

const conn = connect()
const TABLE_NAME = "UserExercise"

interface UserExercisePayload {
	user_id?: string | number | null
	exercise_id?: string | number | null
	weight_lb?: number | null
	reps?: number | null
	durations_min?: number | null
	distance?: number | null
}

/**
 * Get paginated UserExercise rows
 */
export async function getAll(
	page: number = 1,
	limit: number = 10,
) {
	const safePage = Math.max(1, Number(page) || 1)
	const safeLimit = Math.max(1, Number(limit) || 10)

	const start = (safePage - 1) * safeLimit
	const end = start + safeLimit - 1

	const { data, error, count } = await conn
		.from(TABLE_NAME)
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(start, end)

	return {
		isSuccess: !error,
		message: error?.message ?? null,
		data: data ?? [],
		total: count ?? 0,
		page: safePage,
		limit: safeLimit,
		hasMore: end + 1 < (count ?? 0),
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
		message: error?.message ?? null,
		data: data ?? null,
	}
}

/**
 * Add a new UserExercise row
 */
export async function add(
	payload: UserExercisePayload,
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
		message: error?.message ?? null,
		data: data ?? null,
	}
}

/**
 * Update UserExercise by id
 */
export async function update(
	id: number,
	payload: UserExercisePayload,
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
		message: error?.message ?? null,
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
		message: error?.message ?? null,
		data: data ?? null,
	}
}

/**
 * Seed UserExercise rows
 */
export async function seed(
	items: UserExercisePayload[],
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