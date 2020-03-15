import {ArmorPart, Decoration} from "../data/data"
import {dux} from "../../lib/dux"

export type Stock = {parts: ArmorPart[]; decorations: [Decoration, number][]}

const initialState: Stock = {
  parts: [],
  decorations: [],
}

export const {actions, reducer} = dux({}, initialState)
