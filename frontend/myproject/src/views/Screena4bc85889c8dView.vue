<script setup lang="ts">
import { onMounted, inject, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TheLeft from '@/components/TheLeft.vue'
import ThePaging from '@/components/ThePaging.vue'
import axiosInstance from '@/plugins/axiosInstance'
import type { Scrn } from '@/types/scrn'
import type { Page } from '@/types/page'
import type { ComCd } from '@/types/comcd'
import type { tbe18ac518df06fbe62f2dd314Dto } from '@/types/tbe18ac518df06fbe62f2dd314Dto'

const route = useRoute()
const router = useRouter()

const screenList = inject<Scrn[]>('screenList')!
const comCdList = inject<ComCd[]>('comCdList')!
const reftbe18ac518df06fbe62f2dd314Dto = ref<tbe18ac518df06fbe62f2dd314Dto>({
  pkFbe62f2dd314: undefined,
  a9480a0be018: '',
  a9cbd6338b24: '',
  ec9013607471: '',
  f49d7f97577a: '',
})
onMounted(() => {
  screenAction(0)
})
const screenAction = async (pageNumber: number) => {
  const pkValue = route.query.pkValue
  const response = await axiosInstance.get(`/tb-e18ac518df06-fbe62f2dd314/${pkValue}`)
  reftbe18ac518df06fbe62f2dd314Dto.value = response.data.data
}
// buttonTYPE (C:등록, R:조회, U:수정, D:삭제, None,L:이동)
const buttonAction = async (buttonAction: string, nextScrenId: string, pkValue?: string) => {
  const pkValueInRoute = route.query.pkValue
  switch (buttonAction) {
    case 'C':
      const response_C = await axiosInstance.post('/tb-e18ac518df06-fbe62f2dd314', reftbe18ac518df06fbe62f2dd314Dto.value)
      if (response_C.status !== 200) {
        console.error('등록에 실패하였습니다.')
        return
      }

      if (!nextScrenId) {
        return
      }

      const nextScrn_C = screenList.find((dto) => dto.scrnId === nextScrenId)
      // scrnType이 'R:조회' 이면 응답 데이터 전송
      if (nextScrn_C && ['R', 'U'].includes(nextScrn_C.scrnType)) {
        router.push({ name: nextScrenId, query: { 'pkValue': response_C.data.data } })
        return
      }
      router.push({ name: nextScrenId })
      break
    case 'R':
      const nextScrn_R = screenList.find((dto) => dto.scrnId === nextScrenId)
      // scrnType이 'R:조회' 이면 응답 데이터 전송
      if (nextScrn_R && ['R', 'U'].includes(nextScrn_R.scrnType)) {
        router.push({ name: nextScrenId, query: { 'pkValue': pkValue } })
        return
      }
      router.push({ name: nextScrenId })
      break
    case 'U':
      const response_U = await axiosInstance.put(`/tb-e18ac518df06-fbe62f2dd314/${pkValueInRoute}`, reftbe18ac518df06fbe62f2dd314Dto.value)
      if (response_U.status !== 200) {
        console.error('수정에 실패하였습니다.')
        return
      }

      if (!nextScrenId) {
        alert('등록되었습니다.')
        return
      }

      const nextScrn_U = screenList.find((dto) => dto.scrnId === nextScrenId)
      // scrnType이 'R:조회' 이면 응답 데이터 전송
      if (nextScrn_U && ['R', 'U'].includes(nextScrn_U.scrnType)) {
        router.push({ name: nextScrenId, query: { 'pkValue': pkValueInRoute } })
        return
      }
      router.push({ name: nextScrenId })
      break
    case 'D':
      const response_D = await axiosInstance.delete(`/tb-e18ac518df06-fbe62f2dd314/${pkValueInRoute}`)
      if (response_D.status !== 200) {
        console.error('삭제에 실패하였습니다.')
        return
      }

      if (!nextScrenId) {
        alert('삭제되었습니다.')
        return
      }

      const nextScrn_D = screenList.find((dto) => dto.scrnId === nextScrenId)
      // scrnType이 'R:조회' 이면 응답 데이터 전송
      if (nextScrn_D && ['R', 'U'].includes(nextScrn_D.scrnType)) {
          router.push({ name: nextScrenId, query: { 'pkValue': pkValueInRoute } })
          return
      }
      router.push({ name: nextScrenId })
      break
    case 'None':
    case 'L':
    default:
      if (!nextScrenId) {
        return
      }

      const nextScrn = screenList.find((dto) => dto.scrnId === nextScrenId)
      if (nextScrn && ['R', 'U'].includes(nextScrn.scrnType)) {
        router.push({ name: nextScrenId, query: { 'pkValue': pkValueInRoute } })
        return
      }
      router.push({ name: nextScrenId })
      break
  }
}
const changeValue = (value: string): string => {
  if (!value || value.trim().length <= 0) return value

  return value
    .split(',')
    .map((s) => {
      if (s.startsWith('comCd_')) {
        const comCd = comCdList.filter((comCd) => comCd.comCd === s).pop()
        if (comCd) {
          return comCd.comCdNm
        }
      }
      return s
    })
    .join(',')
}

const onCheckboxClick = (event: Event, src: string): string => {
  const target = event.target as HTMLInputElement

  if (target.checked) {
    if (src.length === 0) {
      return target.value
    }

    const valueList = src.split(',')
    valueList.push(target.value)
    return Array.from(valueList).join(',')
  } else {
    if (src.length === 0) {
      return ''
    }

    const valueList = src.split(',')
    return Array.from(valueList).filter(value => value !== target.value).join(',')
  }
}
const isChecked = (src: string, target: string): boolean => {
  if (!src || src.trim().length === 0) {
    return false
  }

  return src.trim().split(',').some(value => value === target)
}

</script>

<template>
  <div id="container10" style="display: flex;padding-top: 25px;">
    <TheLeft/>
    <div id="content10">
      <div class="content10">
        <div class="con_n10">
          <div class="contentinner10">
<form method="post" style="">
  <div class="wrapper-a267859e1edd" data-x="170" data-y="250" style="max-height:56px; transform:translate(170px, 250px); max-width:506px; min-height:26px; position:absolute; min-width:56px; ">
  <input type="text"  class="input_10_i"  v-model="reftbe18ac518df06fbe62f2dd314Dto.a9480a0be018"  data-data-storage-column-id="a9480a0be018"  style="border-right-style:unset; max-height:50px; font-size:12px; min-height:20px; border-bottom:1px solid #bebebe; border-top-style:unset; border-radius:unset; background-color:#ffffff; max-width:500px; border-left-style:unset; width:850px; height:30px; min-width:50px; "/>
</div>
  <div class="wrapper-a5bcc333bf95" data-x="815" data-y="450" style="max-height:100px; transform:translate(815px, 450px); max-width:200px; min-height:36px; position:absolute; min-width:26px; ">
  <button type="button" class="btn1010" @click="buttonAction('U', 'd0fd8cff6907')" data-next-scren-id="d0fd8cff6907" data-button-action="U" style="max-height:100px; color:#ffffff; font-weight:normal; font-size:15px; min-height:30px; border-color:#f07009; background-color:rgba(252, 165, 1, 1); border-radius:unset; max-width:200px; width:104px; border-width:1px; border-style:solid; height:40px; min-width:20px; ">등록</button>
</div>
  <div class="wrapper-ac3ee9e006e0" data-x="20" data-y="100" style="max-height:106px; transform:translate(20px, 100px); max-width:906px; min-height:36px; position:absolute; min-width:56px; ">
  <span class="content10_inner" style="background-color:#ffffff; color:#000000; font-weight:bold; display:inline-block; width:140px; vertical-align:middle; font-size:15px; border-width:1px; border-color:#000000; border-style:none; height:30px; ">사용자</span>
</div>
  <div class="wrapper-c0e5f34ac676" data-x="20" data-y="150" style="max-height:106px; transform:translate(20px, 150px); max-width:906px; min-height:36px; position:absolute; min-width:56px; ">
  <span class="content10_inner" style="background-color:#ffffff; color:#000000; font-weight:bold; display:inline-block; width:140px; vertical-align:middle; font-size:15px; border-width:1px; border-color:#000000; border-style:none; height:30px; ">상품</span>
</div>
  <div class="wrapper-c36d797df873" data-x="170" data-y="100" style="max-height:56px; transform:translate(170px, 100px); max-width:506px; min-height:26px; position:absolute; min-width:56px; ">
  <input type="text"  class="input_10_i"  v-model="reftbe18ac518df06fbe62f2dd314Dto.ec9013607471"  data-data-storage-column-id="ec9013607471"  style="border-right-style:unset; max-height:50px; font-size:12px; min-height:20px; border-bottom:1px solid #bebebe; border-top-style:unset; border-radius:unset; background-color:#ffffff; max-width:500px; border-left-style:unset; width:850px; height:30px; min-width:50px; "/>
</div>
  <div class="wrapper-c81a259e6049" data-x="170" data-y="200" style="max-height:56px; transform:translate(170px, 200px); max-width:506px; min-height:26px; position:absolute; min-width:56px; ">
  <input type="text"  class="input_10_i"  v-model="reftbe18ac518df06fbe62f2dd314Dto.f49d7f97577a"  data-data-storage-column-id="f49d7f97577a"  style="border-right-style:unset; max-height:50px; font-size:12px; min-height:20px; border-bottom:1px solid #bebebe; border-top-style:unset; border-radius:unset; background-color:#ffffff; max-width:500px; border-left-style:unset; width:850px; height:30px; min-width:50px; "/>
</div>
  <div class="wrapper-cabcbe9d6260" data-x="20" data-y="250" style="max-height:106px; transform:translate(20px, 250px); max-width:906px; min-height:36px; position:absolute; min-width:56px; ">
  <span class="content10_inner" style="background-color:#ffffff; color:#000000; font-weight:bold; display:inline-block; width:140px; vertical-align:middle; font-size:15px; border-width:1px; border-color:#000000; border-style:none; height:30px; ">가격</span>
</div>
  <div class="wrapper-d43cd6488fc5" data-x="20" data-y="200" style="max-height:106px; transform:translate(20px, 200px); max-width:906px; min-height:36px; position:absolute; min-width:56px; ">
  <span class="content10_inner" style="background-color:#ffffff; color:#000000; font-weight:bold; display:inline-block; width:140px; vertical-align:middle; font-size:15px; border-width:1px; border-color:#000000; border-style:none; height:30px; ">구매일</span>
</div>
  <div class="wrapper-e50b735cc304" data-x="170" data-y="150" style="max-height:56px; transform:translate(170px, 150px); max-width:506px; min-height:26px; position:absolute; min-width:56px; ">
  <input type="text"  class="input_10_i"  v-model="reftbe18ac518df06fbe62f2dd314Dto.a9cbd6338b24"  data-data-storage-column-id="a9cbd6338b24"  style="border-right-style:unset; max-height:50px; font-size:12px; min-height:20px; border-bottom:1px solid #bebebe; border-top-style:unset; border-radius:unset; background-color:#ffffff; max-width:500px; border-left-style:unset; width:850px; height:30px; min-width:50px; "/>
</div>
  <div class="wrapper-f4cd838987ff" data-x="925" data-y="450" style="max-height:100px; transform:translate(925px, 450px); max-width:200px; min-height:36px; position:absolute; min-width:26px; ">
  <button type="button" class="btn1010" @click="buttonAction('None', 'f94b8a9b7919')" data-next-scren-id="f94b8a9b7919" data-button-action="None" style="max-height:100px; color:rgb(128, 128, 128); font-weight:normal; font-size:15px; min-height:30px; border-color:#bfbfbf; background-color:#efefef; border-radius:unset; max-width:200px; width:104px; border-width:1px; border-style:solid; height:40px; min-width:20px; ">취소</button>
</div>
  <div class="wrapper-fd8cd6226865" data-x="20" data-y="20" style="max-height:106px; transform:translate(20px, 20px); max-width:1006px; min-height:36px; position:absolute; min-width:106px; ">
  <h3 class="sub-tit10" style="background-color:#ffffff; color:#000000; width:1000px; font-size:20px; line-height:50px; border-width:1px; border-color:#000000; border-style:none; border-bottom:2px solid #fca501; height:50px; ">구매상품 수정</h3>
</div>
</form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
