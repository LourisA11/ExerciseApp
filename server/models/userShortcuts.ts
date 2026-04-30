import { connect } from "./supabase";
const conn = connect();

export async function getByUser(userId) {
    const { data, error } = await conn
        .from('UserShortcuts')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data || [];
}

export async function upsert(payload) {
    if (!payload.user_id) throw new Error("Database error: user_id is missing.");

    const dataToSave = {
        user_id: payload.user_id,
        label: payload.label || 'New Shortcut',
        // Ensure exercise_id is a valid UUID or NULL; never an empty string
        exercise_id: (payload.exercise_id && payload.exercise_id.length > 10) 
                     ? payload.exercise_id 
                     : null,
        weight_lb: Number(payload.weight_lb) || 0,
        reps: Number(payload.reps) || 0
    };

    if (payload.id && payload.id < 1000000000000) {
        dataToSave.id = payload.id;
    }

    const { data, error } = await conn
        .from('UserShortcuts')
        .upsert([dataToSave])
        .select()
        .single();

    if (error) {
        // LOOK AT YOUR SERVER TERMINAL FOR THIS LOG
        console.error("CRITICAL DB ERROR:", error.message, error.details);
        throw error;
    }
    return data;
}

export async function remove(id) {
    const { error } = await conn.from('UserShortcuts').delete().eq('id', id);
    if (error) throw error;
    return { isSuccess: true };
}

export async function add(activity) {
    const { data, error } = await conn
        .from('UserActivities') // <-- Verify this table name matches your DB
        .insert([activity])
        .select()
        .single();

    if (error) throw error;
    return data;
}