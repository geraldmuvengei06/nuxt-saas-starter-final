<!-- filepath: d:\Personal\nuxt\nuxt-saas-starter-final\components\ui\RoleSelector.vue -->
<template>
  <USelectMenu
    v-model="selectedRole"
    :options="roleOptions"
    :disabled="disabled || loading"
    @change="handleRoleChange"
  >
    <template #label>
      <UBadge :color="getRoleColor(selectedRole)" variant="subtle">
        {{ selectedRole }}
      </UBadge>
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string
  currentRole: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  roleChanged: [userId: string, newRole: string]
}>()

const selectedRole = ref(props.currentRole)
const loading = ref(false)
const toast = useToast()

const roleOptions = [
  { label: 'User', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'red'
    case 'ADMIN':
      return 'orange'
    case 'USER':
    default:
      return 'gray'
  }
}

const handleRoleChange = async (newRole: string) => {
  if (newRole === props.currentRole) return

  try {
    loading.value = true

    const response = await $fetch(`/api/admin/users/${props.userId}/role`, {
      method: 'PUT',
      body: { role: newRole },
    })

    if (response.success) {
      toast.add({
        title: 'Success',
        description: 'User role updated successfully',
        color: 'green',
      })

      emit('roleChanged', props.userId, newRole)
    }
  } catch (error: any) {
    console.error('Error updating user role:', error)

    // Revert the selection
    selectedRole.value = props.currentRole

    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to update user role',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

// Watch for prop changes
watch(
  () => props.currentRole,
  newRole => {
    selectedRole.value = newRole
  }
)
</script>
