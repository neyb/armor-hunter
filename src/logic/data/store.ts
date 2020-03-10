import {dux} from "../../lib/dux"
import {Skill} from "/logic/data"
import {ArmorPart, Decoration} from "../data"

export type State = {
  skills: Skill[]
  armors: ArmorPart[]
  decorations: Decoration[]
}

const initialState: State = {skills: [], armors: [], decorations: []}

const updateSkills = (state: State, skills: Skill[]) => ({...state, skills})

const updateArmors = (state: State, armors: ArmorPart[]) => ({...state, armors})

const updateDecorations = (state: State, decorations: Decoration[]) => ({...state, decorations})

export const {actions, reducer} = dux({updateSkills, updateArmors, updateDecorations}, initialState)
