export interface Validation<T = string> {
  validate(data: T): boolean
  getError(): string | string[]
}
