export interface Page<T> {
  size: number,
  data: T[],
  page: number,
  totalCount: number
}
