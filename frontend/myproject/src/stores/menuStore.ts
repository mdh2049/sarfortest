// /src/stores/menuStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuResponseDto } from '@/types/menu/MenuResponse.dto'
import type { HierarchicalMenu } from '@/types/menu/HierarchicalMenu.type'
import menuService from '@/services/MenuService'

export const useMenuStore = defineStore('menu', () => {
  // 원본 메뉴 데이터
  const menuList = ref<MenuResponseDto[]>([])

  // 중첩 구조(계층형) 메뉴
  const nestedMenu = computed<HierarchicalMenu[]>(() => {
    const menuMap = new Map<number, HierarchicalMenu>()

    // 1) menuList를 Map으로 변환
    menuList.value.forEach((menu) => {
      menuMap.set(menu.menuSn, {
        ...menu,
        depth: 0,
        parent: null,
        children: [],
      })
    })

    // 2) 부모-자식 연결하여 계층 구조 생성
    const rootMenus: HierarchicalMenu[] = []
    menuMap.forEach((menu) => {
      if (!menu.upMenuSn) {
        rootMenus.push(menu)
      } else {
        const parentMenu = menuMap.get(menu.upMenuSn)
        if (parentMenu) {
          menu.parent = parentMenu
          parentMenu.children.push(menu)
        }
      }
    })

    // 3) 각 메뉴별로 depth 설정
    function setDepth(menu: HierarchicalMenu, currentDepth: number) {
      menu.depth = currentDepth
      menu.children.forEach((child) => setDepth(child, currentDepth + 1))
    }
    rootMenus.forEach((menu) => setDepth(menu, 0))

    return rootMenus
  })

  // 메뉴 데이터 API 호출
  async function loadMenu(menuRole: string) {
    try {
      const data = await menuService.findMenusByUser(menuRole)
      menuList.value = data
    } catch (error) {
      console.error('메뉴 데이터를 불러오는 중 에러 발생:', error)
    }
  }

  return {
    menuList,
    nestedMenu,
    loadMenu,
  }
})
