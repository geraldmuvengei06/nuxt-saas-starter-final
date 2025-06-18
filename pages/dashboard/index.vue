<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

// Statistics data for the dashboard
const stats = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2.5%',
    icon: 'i-heroicons-document-text',
    color: 'primary',
  },
  {
    title: 'Active Users',
    value: '24K',
    change: '+3.2%',
    icon: 'i-heroicons-users',
    color: 'secondary',
  },
  {
    title: 'Revenue',
    value: '$45K',
    change: '+5.4%',
    icon: 'i-heroicons-currency-dollar',
    color: 'success',
  },
  {
    title: 'Pending Tasks',
    value: '8',
    change: '-1.2%',
    icon: 'i-heroicons-clipboard-document-check',
    color: 'warning',
  },
]

// Recent activity data
const activities = [
  {
    user: { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=1' },
    action: 'created a new project',
    project: 'Marketing Website',
    time: '30 minutes ago',
  },
  {
    user: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=5' },
    action: 'completed the task',
    project: 'User Authentication',
    time: '2 hours ago',
  },
  {
    user: { name: 'Robert Johnson', avatar: 'https://i.pravatar.cc/150?img=8' },
    action: 'commented on',
    project: 'API Integration',
    time: '5 hours ago',
  },
  {
    user: { name: 'Sarah Parker', avatar: 'https://i.pravatar.cc/150?img=9' },
    action: 'added a new member to',
    project: 'Dashboard UI',
    time: '1 day ago',
  },
]
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-neutral-500">Welcome to your dashboard. Here's what's happening today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard
        v-for="(stat, index) in stats"
        :key="index"
        class="border border-neutral-200 dark:border-neutral-800"
      >
        <div class="flex items-center">
          <div
            class="rounded-lg p-2 mr-4"
            :class="`bg-${stat.color}-100 text-${stat.color}-500 dark:bg-${stat.color}-900/20 dark:text-${stat.color}-400`"
          >
            <UIcon :name="stat.icon" class="size-6" />
          </div>
          <div>
            <div class="text-sm font-medium text-neutral-500">
              {{ stat.title }}
            </div>
            <div class="text-xl font-bold">
              {{ stat.value }}
            </div>
            <div
              class="text-xs mt-1"
              :class="stat.change.startsWith('+') ? 'text-success-500' : 'text-error-500'"
            >
              {{ stat.change }}
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium">Recent Activity</h2>
            <UButton size="sm" color="neutral" variant="ghost"> View all </UButton>
          </div>
        </template>

        <div class="divide-y divide-neutral-200 dark:divide-neutral-800">
          <div v-for="(activity, index) in activities" :key="index" class="py-3">
            <div class="flex items-center">
              <UAvatar :src="activity.avatar" size="sm" class="mr-3" />
              <div>
                <p class="text-sm">
                  <span class="font-medium">{{ activity.user.name }}</span>
                  <span class="text-neutral-500"> {{ activity.action }} </span>
                  <span class="font-medium">{{ activity.project }}</span>
                </p>
                <p class="text-xs text-neutral-500">
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-medium">Quick Actions</h2>
        </template>

        <div class="space-y-4">
          <UButton block icon="i-heroicons-plus" to="/projects/new"> Create New Project </UButton>

          <UButton block color="secondary" icon="i-heroicons-user-plus" to="/team/invite">
            Invite Team Member
          </UButton>

          <UButton
            block
            color="neutral"
            variant="outline"
            icon="i-heroicons-document-chart-bar"
            to="/reports"
          >
            Generate Report
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
