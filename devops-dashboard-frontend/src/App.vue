<script setup>
import WorkflowDashboard from './components/WorkflowDashboard.vue'
import JenkinsBuildsDashboard from './components/JenkinsBuildsDashboard.vue'
</script>

<template>
  <div class="app">
    <h1>DevOps Dashboard</h1>
    <div class="dashboard-container">
      <div class="dashboard-section">
        <WorkflowDashboard />
      </div>
      <div class="dashboard-section">
        <JenkinsBuildsDashboard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
}
</style>
