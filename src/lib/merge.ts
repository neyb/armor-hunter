import {isArray, mergeWith, MergeWithCustomizer} from "lodash"

const customizer: MergeWithCustomizer = (_, src) => (isArray(src) ? src : undefined)
export const merge = <State>(state: State, ...others: RecursivePartial<State>[]): State =>
  others.reduce((acc, partial) => mergeWith(acc, partial, customizer), mergeWith({}, state, customizer))

type RecursivePartial<T> = T extends primitive ? T : RecursivePartialObject<T>
type primitive = string | number | boolean | undefined | null
type RecursivePartialObject<T> = {[P in keyof T]?: RecursivePartial<T[P]>}
