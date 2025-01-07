<script setup lang="ts">
import {provide, readonly} from 'vue'
import {RouterView} from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from "@/components/TheFooter.vue";
import type {Menu} from '@/types/menu.ts'
import type {ComCd} from "@/types/comcd.ts";
import type {Scrn} from "@/types/scrn";

const menuList: Menu[] = [
  {
  menuId: 'acaf484edd10',
  menuNm: '탑메뉴1',
  ordrVl: 0,
  upMenuId: '-',
  scrnId: 'ddfca83c088a',
},
{
  menuId: 'd7983df8db89',
  menuNm: '구매상품 목록',
  ordrVl: 0,
  upMenuId: 'cea528cd0b2a',
  scrnId: 'f94b8a9b7919',
},
{
  menuId: 'e79030c320b5',
  menuNm: '구매상품 등록',
  ordrVl: 0,
  upMenuId: 'acaf484edd10',
  scrnId: 'ddfca83c088a',
},
{
  menuId: 'cea528cd0b2a',
  menuNm: '탑메뉴2',
  ordrVl: 1,
  upMenuId: '-',
  scrnId: 'f94b8a9b7919',
}
]

const comCdList: ComCd[] = [
  
]

const screenList: Scrn[] = [
  {
  scrnId: 'a4bc85889c8d',
  scrnNm: '구매상품 수정',
  scrnType: 'U',
  upScrnId: 'f4f8bd118871'
},
{
  scrnId: 'd0fd8cff6907',
  scrnNm: '구매상품 조회',
  scrnType: 'R',
  upScrnId: 'f4f8bd118871'
},
{
  scrnId: 'ddfca83c088a',
  scrnNm: '구매상품 등록',
  scrnType: 'C',
  upScrnId: 'f4f8bd118871'
},
{
  scrnId: 'f4f8bd118871',
  scrnNm: '구매상품 관리',
  scrnType: 'None',
  upScrnId: '-'
},
{
  scrnId: 'f94b8a9b7919',
  scrnNm: '구매상품 목록',
  scrnType: 'L',
  upScrnId: 'f4f8bd118871'
}
]

provide("menuList", readonly(menuList))
provide("comCdList", readonly(comCdList))
provide("screenList", readonly(screenList))
</script>

<template>
  <header>
    <TheHeader/>
  </header>
  <RouterView/>
  <TheFooter/>
</template>

<style scoped></style>
