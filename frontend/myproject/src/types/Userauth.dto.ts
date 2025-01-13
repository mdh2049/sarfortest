import type { AuthorityDto } from "./authority.dto"


export interface UserAuthDto {
  userSn?: string
  userId?: string
  allAuthrtDtoSet?: AuthorityDto[]
}
