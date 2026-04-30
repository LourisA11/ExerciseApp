import { api } from "./myFetch";

export async function getShortcuts(userId: string) {
    return api('/user-shortcuts', undefined, { headers: { 'user-id': userId } });
}

export async function saveShortcut(payload: any) {
    return api('/user-shortcuts', payload, { method: 'POST' });
}

export async function deleteShortcut(id: number | string) {
    return api(`/user-shortcuts/${id}`, undefined, { method: 'DELETE' });
}