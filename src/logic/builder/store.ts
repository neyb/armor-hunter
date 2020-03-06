import uid from "uniqid"
import {ActionHandler, dux, merge} from "/lib/reducables"

export interface State {
  query: Query
}
export interface Query {
  skills: LeveledSkillRow[]
}

export type LeveledSkillRow = {id: string; skill: LeveledSkill | null}
export type LeveledSkill = {id: string; level: number}
export type Skill = {id: string; max: number}

const createEmptySkill = () => ({id: uid(), skill: null})

const initialState: State = {
  query: {
    skills: [createEmptySkill()],
  },
}

type UpdateRow = {type: "updateRow"; payload: LeveledSkillRow}
const updateRow: ActionHandler<State, UpdateRow> = (state, newRow) => {
  const newSkills = state.query.skills.map(oldRow => (oldRow.id === newRow.id ? newRow : oldRow))
  if (newSkills[newSkills.length - 1].skill !== null) newSkills.push(createEmptySkill())
  return merge(state, {query: {skills: newSkills}})
}

type CleanRows = {type: "cleanRows"; payload: undefined}
const cleanRows: ActionHandler<State, CleanRows> = state => {
  const rows = state.query.skills
  return merge(state, {query: {skills: rows.filter((row, index) => row.skill !== null || index === rows.length - 1)}})
}

export const {actions, reducer} = dux<State, UpdateRow | CleanRows>({updateRow, cleanRows}, initialState)
