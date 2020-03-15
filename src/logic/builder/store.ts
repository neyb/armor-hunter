import uid from "uniqid"
import {dux} from "/lib/dux"
import {merge} from "/lib/merge"
import {Build} from "/logic/search/Build"
import {LeveledSkill} from "/logic/search/LeveledSkill"

export type State = {readonly query: Query; results: BuildRow[]}
export type Query = {readonly skills: LeveledSkillRow[]}
export type LeveledSkillRow = {id: string; skill: LeveledSkill | null}
export type BuildRow = {id: string; build: Build}

const createEmptySkill = () => ({id: uid(), skill: null})

const initialState: State = {
  query: {skills: [createEmptySkill()]},
  results: [],
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

const clearBuilds = (state: State) => ({...state, results: []})

const addBuild = (state: State, build: Build) => ({...state, results: [...state.results, {id: uid(), build}]})

export const {actions, reducer} = dux({updateRow, cleanRows, clearBuilds, addBuild}, initialState)
