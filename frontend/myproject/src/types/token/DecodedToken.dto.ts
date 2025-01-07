export interface DecodedToken {
  sub: string
  userSn: string
  exp?: number
  [key: string]: unknown
}
