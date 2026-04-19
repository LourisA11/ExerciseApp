import { reactive } from 'vue';

export const mockUsers = [
  {
    id: 1,
    name: 'Alice Admin',
    email: 'alice@admin.com',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Bob User',
    email: 'bob@user.com',
    role: 'user'
  },
  {
    id: 3,
    name: 'Charlie Mod',
    email: 'charlie@mod.com',
    role: 'moderator'
  }
];

export const authState = reactive({
  currentUser: null as typeof mockUsers[0] | null
});
