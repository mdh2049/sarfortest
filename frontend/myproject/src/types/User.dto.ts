import type { AuthorityDto } from "./authority.dto"

export interface UserDto {
  userSn?: string
  userId?: string
  userNm?: string
  userBrdt?: string
  userEmlAddr?: string
  userMblTelno?: string | null
  actvtnYn?: string // 활성 여부
  whdwlYn?: string // 탈퇴 여부
  wrtDt?: string | null // 생성일시
  // 최종 합쳐진 권한 목록 (백엔드에서 allAuthrtDtoSet에 담아서 내려줌)
  allAuthrtDtoSet?: AuthorityDto[]
}
