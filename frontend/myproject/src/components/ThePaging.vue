<script setup lang="ts">
import { computed } from 'vue'
import type { Page } from '@/types/page.ts'

const props = defineProps<{ page: Page<unknown> | null }>()

const emits = defineEmits<{ pageClick: [page: number] }>()

const pageNum = computed(() => props.page?.size ?? 10) // 한 줄에 보여줄 페이지 개수
const currentPage = computed(() => props.page?.page ?? 0) // 현재 페이지 번호 (0부터 시작)
const totalPages = computed(() => Math.floor((props.page?.totalCount ?? 0) / pageNum.value + 1)) // 총 페이지 수 계산
const pageFrom = computed(() => Math.floor(currentPage.value / pageNum.value) * pageNum.value)
const pageTo = computed(() => Math.min(pageFrom.value + pageNum.value, totalPages.value))
const pagesToShow = computed(() => {
  return Array.from({ length: pageTo.value - pageFrom.value }, (_, i) => pageFrom.value + i)
})
const getNextPage = computed(() => {
  return pageTo.value < totalPages.value ? pageTo.value : totalPages.value - 1
})
const getPrevPage = computed(() => {
  const prevPage = pageFrom.value - 1
  return prevPage >= 0 ? prevPage : 0
})

const pageClick = (pageNumber: number) => {
  if (pageNumber < 0 || pageNumber >= totalPages.value) {
    return
  }

  emits('pageClick', pageNumber)
}
</script>

<template>
  <div class="paginBox10">
    <div class="paging10">
      <a
        :aria-disabled="currentPage < 1"
        :data-page="getPrevPage"
        class="pageBtn10 prev10"
        @click="pageClick(getPrevPage)"
      >
        <span class="hidText10">이전페이지</span>
      </a>

      <template v-for="page in pagesToShow" :key="page">
        <a :class="{ pageNum10: true, active10: page === currentPage }" :data-page="page" @click="pageClick(page)">
          {{ page + 1 }}
        </a>
      </template>

      <a
        :aria-disabled="currentPage >= totalPages - 1"
        :data-page="getNextPage"
        class="pageBtn10 next10"
        @click="pageClick(getNextPage)"
      >
        <span class="hidText10">다음페이지</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.paging3 button {
  font-size: 12px;
  color: #999;
  float: left;
  font-weight: 400;
  padding: 0 7px;
  line-height: 30px;
  background-color: initial;
}

.pageNum {
  border: none;
}

.pageNum.active {
  color: #f26921;
  font-weight: 500;
  text-decoration: underline;
}
</style>
