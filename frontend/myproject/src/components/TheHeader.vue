<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import HeaderMenuBlock from '@/components/menu/HeaderMenuBlock.vue'
import { inject } from 'vue'
import type { Menu } from '@/types/menu.ts'
import { useAuthorityStore } from '@/stores/authorityStore'


const menuList = inject<Menu[]>('menuList')!
const logout = async () => {
  const authorityStore = useAuthorityStore();
  try {
    // 액세스 토큰 가져오기
    const accessToken = authorityStore.accessToken;
    if (!accessToken) {
      throw new Error('Access Token is not available');
    }
    // 백엔드에서 세션 종료 요청
    const response = await fetch(`${import.meta.env.VITE_ADMIN_BACKEND_URL}auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to log out from server');
    }
    // 클라이언트 상태 초기화
    authorityStore.logout();
    alert('로그아웃 되었습니다.');
    const redirectUrl = encodeURIComponent(window.location.origin);
    const adminLoginUrl = `${import.meta.env.VITE_ADMIN_FRONT_URL}login-user?redirect_uri=${redirectUrl}`;
    window.location.href = adminLoginUrl;
  } catch (error) {
    console.error('Logout failed:', error);
    alert('로그아웃 중 문제가 발생했습니다.');
  }
}

</script>

<template>
  <!-- header start -->
  <div id="header10">
    <div class="headerWrap10">
      <div class="topGnb_wrap10">
        <div class="topGnb10">
          <h1>
            <RouterLink to="/"><img alt="메인로고" class="mainlogo_i_2" src="@/assets/images/sa_robot.png" /></RouterLink>
          </h1>
          <nav id="gnb10">
            <div id="gnbwrap10">
              <div>
                <ul id="tm10" ref="tmEl">
                  <HeaderMenuBlock v-for="menu in menuList.filter((value) => value.upMenuId === '-')" :key="menu.menuId"
                    :children="menuList.filter((value) => value.upMenuId === menu.menuId)" :parent="menu" />
                </ul>
                <button 로그아웃 @click="logout">로그아웃</button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <!--    <a href="#none" class="gnb-btn10" @click="toggleMobileMenu"><img src="@/assets/images/gnb-btn.png" alt="전체메뉴"></a>
    <a href="#none" class="gnb-btn11" @click="toggleMobileMenu"><img src="@/assets/images/gnb-btn2.png" alt="전체메뉴"></a>
    <div class="gnb-bg10" ref="gnbBglEl"></div>-->
  </div>
  <!-- header end -->

  <!--반응형메뉴바-->
  <!--  <div class="menubar10">
    <div class="lnb10" ref="lnb2El">
      <p class="gnb-close-btn10">
        <a href="javascript:void(0)" @click="mobileMenuClose"><img src="@/assets/images/gnb-close-btn.gif"
                                                                   alt="메뉴닫기" /></a>
      </p>
      <div class="lnb-list10">
        <nav>
          <ul>
            <template v-for="dto in refMenuDtos" :key="dto.menuId">
              <li v-if="dto.upMenuId === '-'">
                <a href="javascript:void(0)" class="dep1-link10" :class="{ active: activeMenu === dto.menuId }"
                   :title="dto.menuNm" @click="firstDepthMenuClicked(dto)"><span
                  :class="{ 'dep1-before': getChildDtos(dto.menuId).length > 0 }"
                  @click.stop="toggleMenu(dto.menuId)"></span>{{ dto.menuNm }}</a>
                <div class="dep10" :style="{ display: activeMenu === dto.menuId ? 'block' : 'none' }">
                  <ul>
                    <li v-for="childDto in getChildDtos(dto.menuId)" :key="childDto.menuId">
                      <a href="javascript:void(0)" @click="props.menuClicked(childDto)">· {{ childDto.menuNm }}</a>
                    </li>
                  </ul>
                </div>
              </li>
            </template>
</ul>
</nav>
</div>
</div>
</div>-->
</template>

<style scoped></style>
