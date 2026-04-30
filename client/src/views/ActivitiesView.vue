<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { authState } from '../store/userData'
import { useUserActivityStore } from '../store/UserActivity'
import { getShortcuts, saveShortcut, deleteShortcut } from '../services/userShortcuts'
import UserExInputForm from '@/components/UserExInputForm.vue'
import QuickLogItem from '@/components/QuickLogItem.vue'
import { exerciseState } from '../store/exerciseBank'

const activityStore = useUserActivityStore()
const shortcuts = ref<any[]>([])
const editingId = ref<number | null>(null)

const loadAllData = async () => {
  const user = authState.currentUser;
  
  if (!user || !user.id) {
    shortcuts.value = [];
    return;
  }

  try {
    const data = await getShortcuts(user.id);
    shortcuts.value = data || []; 
    await activityStore.loadActivities();
  } catch (err) {
    console.error("Database fetch failed:", err);
  }
}

const handleAddShortcut = () => {
  const tempId = Date.now(); // Temporary ID for the UI logic
  const newShortcut = {
    id: tempId, // Assigning this so we can target it for editing
    label: 'New Favorite',
    exercise_id: '',
    weight_lb: 0,
    reps: 0,
    user_id: authState.currentUser?.id
  }
  shortcuts.value.push(newShortcut);
  editingId.value = tempId; // Automatically open the edit form for the new item
}
const handleSave = async (item: any) => {
  const userId = authState.currentUser?.id;
  if (!userId) return;

  // Clone the item so we don't mutate the original UI state directly
  const dataToSave = { ...item, user_id: userId };

  // Remove the ID if it's a temp timestamp from handleAddShortcut
  if (dataToSave.id && dataToSave.id > 1000000000000) {
    delete dataToSave.id;
  }

  try {
    await saveShortcut(dataToSave);
    editingId.value = null;
    await loadAllData();
  } catch (err) {
    console.error("Save failed:", err);
  }
};


const myActivities = computed(() => {
  const currentId = authState.currentUser?.id
  return activityStore.activities.filter(a => String(a.user_id) === String(currentId))
})

onMounted(async () => {
    // This fills the list that QuickLogItem is looking at
    await exerciseState.load(); 
    await loadAllData(); // Loads your shortcuts
});
</script>

<template>
  <div class="section">
    <div v-if="authState.currentUser">
      <div class="level">
        <div class="level-left"><h1 class="title">My Activities</h1></div>
        <div class="level-right">
          <button class="button is-primary is-light" @click="handleAddShortcut">
            + Add Quick Link
          </button>
        </div>
      </div>

      <!-- Grid of Shortcuts -->
      <div class="columns is-multiline mb-6">
        <div v-for="s in shortcuts" :key="s.id" class="column is-4">
          <QuickLogItem 
            :config="s" 
            @refresh="loadAllData"
            @added="activityStore.loadActivities" 
          />
        </div>
      </div>

      <h2 class="subtitle">Manual Entry</h2>
      <UserExInputForm @added="activityStore.loadActivities" />
      <UserExInputForm @added="activityStore.loadActivities" />

      <table class="table is-fullwidth mt-5">
        <thead>
          <tr><th>Exercise</th><th>Weight</th><th>Date</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="a in myActivities" :key="a.id">
            <td>{{ a.exercise_id }}</td>
            <td>{{ a.weight_lb }} lbs</td>
            <td>{{ new Date(a.created_at).toLocaleDateString() }}</td>
            <td><button class="button is-small is-danger" @click="activityStore.removeActivity(a.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>