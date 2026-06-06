<template>
  <span :class="['material-icons', color]" :style="{ fontSize: size }">
    {{ name }}
  </span>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: String, default: '24px' },
  color: { type: String, default: 'text-inherit'},
})
</script>

<style scoped>
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>