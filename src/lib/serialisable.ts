export interface SerialisableObject {
  [key: string]: SerialisableValue
}
export type SerialisableValue = SerialisablePrimitive | SerialisableObject | Array<SerialisableValue>
type SerialisablePrimitive = bigint | boolean | null | number | string | symbol | undefined
