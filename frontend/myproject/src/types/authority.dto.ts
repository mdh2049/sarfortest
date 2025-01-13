import type { AuthorityMenuMappingDto } from "./authoritymenumapping.dto"


export interface AuthorityDto {
  authrtSn?: string // 권한 ID
  authrtNm?: string // 권한 이름
  authrtCn?: string // 권한 설명
  authrtMenuMpngDtoSet?: AuthorityMenuMappingDto[] // 메뉴별 액션 권한 목록
}
