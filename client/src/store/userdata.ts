import { reactive } from 'vue';

const SESSION_KEY = 'currentUser'

// Matches your "ExerciseBank" table
export interface ExerciseBankRow {
  id: string; // UUID
  created_at: string;
  name: string;
  type: string;
}

// Matches your "UserExercise" table
export interface UserExercise {
  id: number; // This one is a bigint/identity
  created_at: string;
  user_id: string; // UUID
  exercise_id: string; // UUID
  weight_lb: number | null;
  reps: number | null;
  durations_min: number | null;
  distance: number | null;
}

// Matches your "Users" table EXACTLY
export interface User {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string | null;
  role: string | null;
  height: number;
  weight: number;
  age: number;
  created_at: string;
}

// This object is SHARED across the whole app
function loadCurrentUserFromSession(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    // Safety check: if the saved user has a numeric ID (old mock data), clear it
    if (typeof parsed.id === 'number') {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed as User;
  } catch {
    return null
  }
}

export const authState = reactive({
  currentUser: loadCurrentUserFromSession() as User | null
});

export function setCurrentUser(user: User | null) {
  authState.currentUser = user
  if (user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(SESSION_KEY)
  }
}
// export const mockUsers: User[] = [
//   { 
//     id: 1, 
//     dbId: '2d4c0f1e-4d7f-4c2c-9a8c-111111111111',
//     email: 'admin@test.com', 
//     role: 'admin', 
//     name: 'System Admin',
//     activities: [
//       { id: 101, type: 'Marathon Training', duration: 120, date: '2026-03-20' },
//       { id: 102, type: 'Powerlifting', duration: 60, date: '2026-03-21' },
//       { id: 103, type: 'Morning Jog', duration: 30, date: '2026-03-22' }
//     ],
//     totalCalories: 8500,
//     stats: { totalDistance: 350.5, workoutsThisMonth: 22, weight: 185, height: 72 }
//   },
//   { 
//     id: 2, 
//     dbId: '2d4c0f1e-4d7f-4c2c-9a8c-222222222222',
//     email: 'user@test.com', 
//     role: 'user', 
//     name: 'Jane Doe',
//     activities: [
//       { id: 201, type: 'Hot Yoga', duration: 75, date: '2026-03-18' },
//       { id: 202, type: 'Pilates', duration: 45, date: '2026-03-19' },
//       { id: 203, type: 'Hiking', duration: 150, date: '2026-03-22' }
//     ],
//     totalCalories: 3200,
//     stats: { totalDistance: 45.2, workoutsThisMonth: 14, weight: 135, height: 64 }
//   },
//   { 
//     id: 3, 
//     dbId: '2d4c0f1e-4d7f-4c2c-9a8c-333333333333',
//     email: 'guest@test.com', 
//     role: 'user', 
//     name: 'Guest User',
//     activities: [
//       { id: 301, type: 'Walking', duration: 20, date: '2026-03-22' }
//     ],
//     totalCalories: 150,
//     stats: { totalDistance: 1.2, workoutsThisMonth: 1, weight: 170, height: 68 }
//   }
// ];
