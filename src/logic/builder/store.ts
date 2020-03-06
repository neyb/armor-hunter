import uid from "uniqid"
import {dux, merge} from "/lib/dux"

export type State = {readonly query: Query}
type Query = {readonly skills: LeveledSkillRow[]}
export type LeveledSkillRow = {id: string; skill: LeveledSkill | null}
type LeveledSkill = {id: string; level: number}
export type Skill = {id: string; max: number}

const createEmptySkill = () => ({id: uid(), skill: null})

const initialState: State = {
  query: {
    skills: [createEmptySkill()],
  },
}

const updateRow = (state: State, newRow: LeveledSkillRow) => {
  const newSkills = state.query.skills.map(oldRow => (oldRow.id === newRow.id ? newRow : oldRow))
  if (newSkills[newSkills.length - 1].skill !== null) newSkills.push(createEmptySkill())
  return merge(state, {query: {skills: newSkills}})
}

const cleanRows = (state: State) => {
  const rows = state.query.skills
  return merge(state, {query: {skills: rows.filter((row, index) => row.skill !== null || index === rows.length - 1)}})
}

export const {actions, reducer} = dux({updateRow, cleanRows}, initialState)
