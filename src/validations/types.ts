export interface Validation<T> {
  validate(data: T): boolean
  getErrorMessage(): string[]
}
