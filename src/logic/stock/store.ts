import {dux} from "/lib/dux"
import {ArmorPart, Decoration} from "/logic/builder/search/data"

export type Stock = {parts: ArmorPart[]; decorations: [Decoration, number][]}

const initialState: Stock = {
  parts: [],
  decorations: [],
}

export const {actions, reducer} = dux({}, initialState)
