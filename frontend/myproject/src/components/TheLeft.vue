<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, inject } from 'vue'
import type { Menu } from '@/types/menu.ts'

const route = useRoute()
const menuList = inject<Menu[]>('menuList')!

const selectedMenu = computed(() => {
  const select = menuList.filter((menu: Menu) => menu.scrnId === route.name).pop()
  if (select) {
    localStorage.setItem('lastMenuId', select.menuId)
    return menuList.filter((menu: Menu) => menu.scrnId === route.name).pop()
  } else {
    const lastMenuId = localStorage.getItem('lastMenuId')
    return menuList.filter((menu: Menu) => menu.menuId === lastMenuId).pop()
  }
})

const parent = computed<Menu | null>(() => {
  if (!selectedMenu.value) {
    return null
  }

  if (!selectedMenu.value.upMenuId || selectedMenu.value.upMenuId === '-') {
    return selectedMenu.value
  }

  return menuList.find((menu) => menu.menuId === selectedMenu.value!.upMenuId) ?? null
})

const children = computed<Menu[]>(() => {
  return menuList.filter((menu: Menu) => {
    return menu.upMenuId === parent.value?.menuId
  })
})
</script>

<template>
  <div id="left10" v-if="parent">
    <div class="lnb1010">
      <a href="javascript:"><img alt="화살표이미지" class="arrow_lr" src="@/assets/images/l_arrow_.png" /></a>
      <h3 class="member10">
        {{ parent?.menuNm }}
        <img alt="좌측대제목이미지" class="member_i1" src="@/assets/images/snb_6.png" />
        <img alt="좌측대제목이미지" class="member_i2" src="@/assets/images/snb_3.png" />
      </h3>
      <div class="lnb-list1010">
        <ul>
          <li v-for="child in children">
            <RouterLink :to="{ name: child.scrnId }" active-class="orange"
            ><i class="fas fa-chevron-circle-right"></i>{{ child.menuNm }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
