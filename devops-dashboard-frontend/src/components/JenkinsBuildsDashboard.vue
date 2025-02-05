<template>
  <div class="jenkins-dashboard">
    <h2>Jenkins Builds</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="build-list">
      <div v-for="build in builds" :key="build.id" class="build-item">
        <div class="build-header">
          <div class="build-name">{{ build.name }}</div>
          <div class="build-number"> Build No. {{build.number}}</div>
        </div>
        <div class="build-details">
          <span :class="['status', build.status.toLowerCase()]">Status: {{ build.status }}</span>
          <span class="commit-id">{{ build.commit_id ? build.commit_id.slice(0, 7) : 'N/A' }}</span>
        </div>
        <div class="build-meta">
          <div class="meta-item">
            <i class="meta-icon">🕒</i>
            Started: {{ formatDate(build.timestamp) }}
          </div>
          <div class="meta-item">
            <i class="meta-icon">⏱️</i>
            Duration: {{ formatDuration(build.duration) }}
          </div>
          <!-- <div class="meta-item">
            <i class="meta-icon">👤</i>
            Started by: {{ build.started_by || 'Unknown' }}
          </div> -->
        </div>
        <div class="build-stages" v-if="build.stages">
          <div class="stages-title">Stages:</div>
          <div class="stage-list">
            <div v-for="stage in build.stages" :key="stage.id" class="stage-item">
              <span class="stage-name">{{ stage.name }}</span>
              <div class="stage-info">
                <span class="stage-duration">{{ formatDuration(stage.duration) }}</span>
                <span :class="['stage-status', stage.status.toLowerCase()]">{{ stage.status }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="build-artifacts" v-if="build.artifacts && build.artifacts.length">
          <div class="artifacts-title">Artifacts:</div>
          <div class="artifact-list">
            <div v-for="artifact in build.artifacts" :key="artifact.name" class="artifact-item">
              <span class="artifact-name">{{ artifact.name }}</span>
              <span class="artifact-size">{{ formatSize(artifact.size) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const builds = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString()
}

const formatDuration = (duration) => {
  if (!duration) return 'N/A'
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

const formatSize = (bytes) => {
  if (!bytes) return 'N/A'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const fetchBuilds = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/jenkins-builds')
    builds.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch Jenkins builds: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBuilds()
})
</script>

<style scoped>
.jenkins-dashboard {
  padding: 20px;
}

.build-list {
  display: grid;
  gap: 16px;
}

.build-item {
  background: #6149e9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
}

.build-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.build-name {
  font-size: 1.2em;
  font-weight: bold;
}

.build-number {
  font-size: 1.1em;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: bold;
}

.build-details {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.commit-id {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.build-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
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

.build-stages {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stages-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.stage-list {
  display: grid;
  gap: 8px;
}

.stage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
}

.stage-name {
  font-size: 0.9em;
}

.stage-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.stage-duration {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.8);
}

.stage-status {
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 3px;
}

.build-artifacts {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.artifacts-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.artifact-list {
  display: grid;
  gap: 8px;
}

.artifact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
}

.artifact-name {
  font-size: 0.9em;
}

.artifact-size {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.8);
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  background: rgba(255, 255, 255, 0.2);
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
.success {
  background: #28a745;
}

.failure, .failed {
  background: #dc3545;
}

.in_progress, .running {
  background: #ffc107;
  color: #000;
}

.unstable {
  background: #fd7e14;
}

.aborted {
  background: #6c757d;
}
</style>
