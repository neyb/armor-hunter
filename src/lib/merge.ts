import {isArray, mergeWith, MergeWithCustomizer} from "lodash"

const customizer: MergeWithCustomizer = (_, src) => (isArray(src) ? src : undefined)
export const merge = <T>(first: T, ...others: RecursivePartial<T>[]): T =>
  others.reduce((acc, partial) => mergeWith(acc, partial, customizer), mergeWith({}, first, customizer))

export type RecursivePartial<T> = T extends primitive ? T : RecursivePartialObject<T>
type primitive = string | number | boolean | undefined | null
type RecursivePartialObject<T> = {[P in keyof T]?: RecursivePartial<T[P]>}
