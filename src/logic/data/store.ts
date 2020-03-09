import {dux} from "../../lib/dux"
import {Skill} from "/logic/data"
import {ArmorPart} from "../data"

export type State = {
  skills: Skill[]
  armors: ArmorPart[]
}

const initialState: State = {skills: [], armors: []}

const updateSkills = (state: State, skills: Skill[]) => ({...state, skills})

const updateArmors = (state: State, armors: ArmorPart[]) => ({...state, armors})

export const {actions, reducer} = dux({updateSkills, updateArmors}, initialState)
