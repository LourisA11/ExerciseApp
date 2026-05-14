import type { User } from "../types"
import { PagingRequest } from "../types/dataEnvelope"
import { connect } from "./supabase"

/**
 * Get all users from Supabase with Paging, Sorting, and Search
 */
export async function getAll(params: PagingRequest) {
    const supabase = connect();
    
    // 1. Start the query on the "Users" table
    let query = supabase
        .from("Users")
        .select("*", { count: "exact" });

    // 2. Handle Search (First Name + Last Name)
    if (params?.search) {
        // Supabase uses 'ilike' for case-insensitive search
        // This checks if the search string exists in either name column
        query = query.or(`firstName.ilike.%${params.search}%,lastName.ilike.%${params.search}%`);
    }

    // 3. Handle Sorting
    if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: !params.descending });
    } else {
        query = query.order("firstName", { ascending: true });
    }

    // 4. Handle Paging
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query.range(from, to);

    if (error) {
        console.error("Supabase Fetch Error:", error.message);
        return { list: [], count: 0 };
    }

    return { 
        list: data as User[], 
        count: count || 0 
    };
}

/**
 * Update User by id
 */
export async function update(id: string, payload: Record<string, unknown>) {
  const { data, error } = await connect()
    .from("Users")
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
 * Delete User by id
 */
export async function remove(id: string) {
    const { data, error } = await connect()
        .from("Users")
        .delete()
        .eq("id", id);
        
    return { isSuccess: !error, message: error?.message };
}

export async function get(id: string) {
    const { data, error } = await connect()
        .from("Users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Supabase Fetch Error:", error.message);
        return null;
    }

    return data as User;
}