import type { AuthorityDto } from "../authority/authority.dto"
import type { AuthrtUserMpngDto } from "../authorityusermpng/authorityusermapping.dto"
import type { DutyDto } from "../organization/Duty.dto"
import type { JbpsDto } from "../organization/Jbps.dto"
import type { OgnzDto } from "../organization/Ognz.dto"

export interface UserDto {
  userSn?: string
  userId?: string
  pswd?: string // 비밀번호는 WRITE_ONLY로 설정
  userNm?: string
  userBrdt?: string
  userEmlAddr?: string
  userMblTelno?: string | null
  actvtnYn?: string // 활성 여부
  whdwlYn?: string // 탈퇴 여부
  wrtDt?: string | null // 생성일시
  ognzDto?: OgnzDto
  jbpsDto?: JbpsDto
  dutyDto?: DutyDto
  // 최종 합쳐진 권한 목록 (백엔드에서 allAuthrtDtoSet에 담아서 내려줌)
  allAuthrtDtoSet?: AuthorityDto[]
}
