<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import type { Menu } from '@/types/menu.ts'

const props = defineProps<{
  parent: Menu
  children: Menu[]
}>()

const isShow = ref<boolean>(false)
</script>

<template>
  <li class="th10" @mouseout="isShow = false" @mouseover="isShow = true">
    <RouterLink :to="{ name: props.parent.scrnId }">{{ props.parent.menuNm }}</RouterLink>
    <Transition name="fade">
      <ul v-show="isShow" class="gnb_depth10">
        <li v-for="child in props.children" :key="child.menuId">
          <RouterLink :to="{ name: child.scrnId }">{{ child.menuNm }}</RouterLink>
        </li>
      </ul>
    </Transition>
  </li>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
