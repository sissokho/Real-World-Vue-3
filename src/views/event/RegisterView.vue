<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const { event } = defineProps({
  event: {
    required: true
  }
})
const router = useRouter()
const GStore = inject('GStore')

const register = () => {
  GStore.flashMessage = `You are successfully registered for ${event.title}`
  setTimeout(() => {
    GStore.flashMessage = ''
  }, 3000)
  router.push({
    name: 'event-details'
    // id: props.event.id
  })
}
</script>

<template>
  <p>Register for the event here.</p>
  <button @click="register">Register Me!</button>
</template>
