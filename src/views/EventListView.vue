<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import EventService from '@/services/EventService.js'
import EventCard from '@/components/EventCard.vue'
import { useRouter } from 'vue-router'

const props = defineProps(['page'])

const events = ref(null)
const totalEvents = ref(0)

const router = useRouter()

const page = computed(() => props.page)

const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / 4)

  return page.value < totalPages
})

onMounted(() => {
  watchEffect(() => {
    events.value = null

    EventService.getEvents(4, page.value)
      .then((response) => {
        events.value = response.data
        totalEvents.value = response.headers['x-total-count']
      })
      .catch((error) => {
        router.push({ name: 'network-error' })
      })
  })
})
</script>

<template>
  <h1>Events For Good</h1>
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />

    <div class="pagination">
      <RouterLink
        id="page-prev"
        :to="{ name: 'event-list', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
        >&#60; Previous</RouterLink
      >
      <RouterLink
        id="page-next"
        :to="{ name: 'event-list', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
        >Next &#62;</RouterLink
      >
    </div>
  </div>
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pagination {
  display: flex;
  width: 200px;
}

.pagination a {
  flex: 1;
  text-decoration: none;
  color: #2c3e50;
}

#page-prev {
  text-align: left;
}

#page-next {
  text-align: right;
}
</style>
