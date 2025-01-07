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
const reftbe18ac518df06fbe62f2dd314Dtos = ref<Page<tbe18ac518df06fbe62f2dd314Dto>>({ page: 0, data: [], size: 10, totalCount: 0 })
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
const response = await axiosInstance.get<Page<tbe18ac518df06fbe62f2dd314Dto>>('/tb-e18ac518df06-fbe62f2dd314/search', { params: {
  page: pageNumber,
  size: 10
}})
reftbe18ac518df06fbe62f2dd314Dtos.value = response.data

reftbe18ac518df06fbe62f2dd314Dtos.value.data = response.data.data.map((dto: tbe18ac518df06fbe62f2dd314Dto) => {
  return Object.fromEntries(
    Object.entries(dto).map((entry) => {
      entry[1] = changeValue(entry[1])
      return entry
    }),
  ) as tbe18ac518df06fbe62f2dd314Dto
})
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
<div class="wrapper-aa0edaefcd24" data-x="20" data-y="20" style="max-height:106px; transform:translate(20px, 20px); max-width:1006px; min-height:36px; position:absolute; min-width:106px; ">
  <h3 class="sub-tit10" style="background-color:#ffffff; color:#000000; width:1000px; font-size:20px; line-height:50px; border-width:1px; border-color:#000000; border-style:none; border-bottom:2px solid #fca501; height:50px; ">구매상품 목록</h3>
</div>
<div class="scroll10" data-x="20" data-y="70" style="max-height:906px; transform:translate(20px, 70px); max-width:1000px; width:1000px; overflow-x:auto; min-height:106px; overflow-y:hidden; position:absolute; min-width:106px; height:615px; ">
  <p class="total_p10" style="">{{ `총(${reftbe18ac518df06fbe62f2dd314Dtos.totalCount}건)` }}</p>
  <table class="table_content10" data-next-scren-id="d0fd8cff6907" data-page-size="10" style="border-right-style:unset; max-height:900px; color:#000000; min-height:100px; border-color:#bfbfbf; border-top-style:unset; background-color:#ffffff; max-width:1000px; border-left-style:unset; width:1000px; border-width:1px; border-style:solid; height:500px; min-width:100px; ">
  <thead style="">
  <tr style="height:20px; ">
  <th data-data-storage-column-id="col_number" data-index="0" style="white-space:nowrap; text-align:center; ">순번</th>
  <th data-data-storage-column-id="ec9013607471" data-index="2" style="white-space:nowrap; text-align:center; ">사용자</th>
  <th data-data-storage-column-id="a9cbd6338b24" data-index="3" style="white-space:nowrap; text-align:center; ">상품</th>
  <th data-data-storage-column-id="f49d7f97577a" data-index="4" style="white-space:nowrap; text-align:center; ">구매일</th>
  <th data-data-storage-column-id="a9480a0be018" data-index="5" style="white-space:nowrap; text-align:center; ">가격</th>
  <th data-data-storage-column-id="col_button" data-index="99" style="white-space:nowrap; text-align:center; ">기능</th>
</tr>
</thead>
  <tbody style="">
  <tr v-for="(dto, index) in reftbe18ac518df06fbe62f2dd314Dtos.data" :key="dto.pkFbe62f2dd314" style="height:40px; text-align:center; ">
  <td style="">{{ reftbe18ac518df06fbe62f2dd314Dtos.page * reftbe18ac518df06fbe62f2dd314Dtos.size + index + 1 }}</td>
  <td style="">{{ dto.ec9013607471 }}</td>
  <td style="">{{ dto.a9cbd6338b24 }}</td>
  <td style="">{{ dto.f49d7f97577a }}</td>
  <td style="">{{ dto.a9480a0be018 }}</td>
  <td style="">
  <a @click="buttonAction('R', 'd0fd8cff6907', dto.pkFbe62f2dd314)" class="btn_b22 btn_list" v-if="dto.pkFbe62f2dd314" style="cursor:pointer; display:unset; width:50%; ">조회</a>
</td>
</tr>
  <tr v-for="_ in 10 - reftbe18ac518df06fbe62f2dd314Dtos.data.length" style="">
  <td colspan="6"></td>
</tr>
</tbody>
</table>
  <ThePaging :page="reftbe18ac518df06fbe62f2dd314Dtos" @page-click="screenAction" style=""></ThePaging>
</div>
<div class="wrapper-f0451018222e" data-x="900" data-y="650" style="max-height:100px; transform:translate(900px, 650px); max-width:200px; min-height:36px; position:absolute; min-width:26px; ">
  <button type="button" class="btn1010" @click="buttonAction('None', 'ddfca83c088a')" data-next-scren-id="ddfca83c088a" data-button-action="None" style="max-height:100px; color:#ffffff; font-weight:normal; font-size:15px; min-height:30px; border-color:#f07009; background-color:rgba(252, 165, 1, 1); border-radius:unset; max-width:200px; width:104px; border-width:1px; border-style:solid; height:40px; min-width:20px; ">등록</button>
</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
