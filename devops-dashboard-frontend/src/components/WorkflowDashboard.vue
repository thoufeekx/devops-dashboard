<template>
  <div class="workflow-dashboard">
    <h2>GitHub Actions Workflows</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="workflow-list">
      <div v-for="(workflow, index) in parsedWorkflows" :key="index" class="workflow-item">
        <div class="workflow-header">
          <div class="workflow-name">{{ workflow?.buildName || 'Unnamed Workflow' }}</div>
          <div class="branch-name">Branch: {{ workflow?.branch || 'main' }}</div>
        </div>
        <div class="workflow-title" style="text-align: left;">
          Commit Message: "{{ workflow?.displayTitle || 'No title available' }}"
          
        </div>
        <div class="workflow-details">
          <span :class="['status', (workflow?.status || 'unknown').toLowerCase()]">
            {{ workflow?.status || 'Unknown Status' }}
          </span>
          <span :class="['conclusion', (workflow?.conclusion || 'unknown').toLowerCase()]">
            {{ workflow?.conclusion || 'No Conclusion' }}
          </span>
        </div>
        <div class="workflow-meta">
          <div class="meta-item">
            <i class="meta-icon">🕒</i>
            Started: {{ formatDate(workflow?.startedTime) }}
          </div>
          <div class="meta-item">
            <a :href="workflow?.url" target="_blank" class="workflow-link" v-if="workflow?.url">
              <i class="meta-icon">🔗</i>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const workflows = ref([])
const loading = ref(true)
const error = ref(null)

const parsedWorkflows = computed(() => {
  return workflows.value.map(workflow => {
    if (typeof workflow === 'string') {
      try {
        return JSON.parse(workflow)
      } catch {
        return workflow
      }
    }
    return workflow
  })
})

const formatDate = (dateString) => {
  if (!dateString) return 'Not available'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    
    return date.toLocaleString()
  } catch {
    return 'Invalid date'
  }
}

const fetchWorkflows = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/workflows')
    workflows.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch workflows: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWorkflows()
})
</script>

<style scoped>
.workflow-dashboard {
  padding: 20px;
}

.workflow-list {
  display: grid;
  gap: 16px;
}

.workflow-item {
  background: #6149e9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.workflow-name {
  font-size: 1.2em;
  font-weight: bold;
}

.branch-name {
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
}

.workflow-title {
  font-size: 1.1em;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.workflow-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.workflow-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.meta-icon {
  font-style: normal;
}

.workflow-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.workflow-link:hover {
  background: rgba(255, 255, 255, 0.3);
}

.status, .conclusion {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.2);
  text-transform: capitalize;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.error {
  color: #dc3545;
  padding: 20px;
  text-align: center;
  background: #ffe6e6;
  border-radius: 8px;
}

/* Status colors */
.completed {
  background: #28a745;
}

.in_progress {
  background: #ffc107;
  color: #000;
}

.queued {
  background: #17a2b8;
}

.unknown {
  background: #6c757d;
}

.success {
  background: #28a745;
}

.failure {
  background: #dc3545;
}
</style>
