import { reactive } from 'vue';

export interface Activity {
  id: number;
  type: string;
  duration: number; // in minutes
  date: string;
}

export interface Stats {
  totalDistance: number;
  workoutsThisMonth: number;
  weight: number;
  height: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  role: 'admin' | 'user';
  activities: Activity[];
  totalCalories: number;
  stats: Stats;
}

export const mockUsers: User[] = [
  { 
    id: 1, 
    email: 'admin@test.com', 
    role: 'admin', 
    name: 'System Admin',
    activities: [
      { id: 101, type: 'Marathon Training', duration: 120, date: '2026-03-20' },
      { id: 102, type: 'Powerlifting', duration: 60, date: '2026-03-21' },
      { id: 103, type: 'Morning Jog', duration: 30, date: '2026-03-22' }
    ],
    totalCalories: 8500,
    stats: { totalDistance: 350.5, workoutsThisMonth: 22, weight: 185, height: 72 }
  },
  { 
    id: 2, 
    email: 'user@test.com', 
    role: 'user', 
    name: 'Jane Doe',
    activities: [
      { id: 201, type: 'Hot Yoga', duration: 75, date: '2026-03-18' },
      { id: 202, type: 'Pilates', duration: 45, date: '2026-03-19' },
      { id: 203, type: 'Hiking', duration: 150, date: '2026-03-22' }
    ],
    totalCalories: 3200,
    stats: { totalDistance: 45.2, workoutsThisMonth: 14, weight: 135, height: 64 }
  },
  { 
    id: 3, 
    email: 'guest@test.com', 
    role: 'user', 
    name: 'Guest User',
    activities: [
      { id: 301, type: 'Walking', duration: 20, date: '2026-03-22' }
    ],
    totalCalories: 150,
    stats: { totalDistance: 1.2, workoutsThisMonth: 1, weight: 170, height: 68 }
  }
];

// This object is SHARED across the whole app
export const authState = reactive({
  currentUser: null as User | null
});