// models/userActivities.js
import { connect } from "./supabase"
const conn = connect()

export async function getAll() {
    // Matches the TABLE_NAME pattern used in source 3
    const { data, error } = await conn
        .from('UserExercise') // Source 3 uses 'UserExercise'
        .select('*');

    if (error) throw new Error(error.message); 
    return data || [];
}

export async function create(payload) {
    const { data, error } = await conn
        .from('UserExercise') // Table name from your SQL schema
        .insert([{
            user_id: payload.user_id,     // Ensure these match Step A
            exercise_id: payload.exercise_id, 
            weight_lb: payload.weight_lb,
            reps: payload.reps
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}