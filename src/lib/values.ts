import {hash, is} from "immutable"

export function hashes(...objs: any[]): number {
  return objs.reduce((acc, obj) => (((31 * acc) | 0) + hash(obj)) | 0, 0)
}

export const comparing = <T>(o: T, ...mappers: ((t: T) => any)[]) => (other: T) =>
  mappers.every(mapper => is(mapper(o), mapper(other)))
