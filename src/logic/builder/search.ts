import {actions, LeveledSkill as LeveledSkillOfRow, LeveledSkillRow} from "./store"
import {startSearch} from "/logic/search"
import {Skill} from "../data"
import {Unsubscribable} from "rxjs"
import {Dispatch} from "redux"
import {RootState} from "../store"
import uniqid from "uniqid"

export const startSearchAction = (
  dispatch: Dispatch,
  getState: () => RootState
): {cancel: () => void; promise: Promise<undefined>} => {
  dispatch(actions.clearBuilds(undefined))
  const state = getState()

  const stock = state.stock
  const allSkills: Skill[] = state.data.skills
  const skills: LeveledSkillRow[] = state.builder.query.skills

  const skillOf = (id: string) =>
    allSkills.find(skill => skill.id === id) ||
    (() => {
      throw new Error(`no skill with id ${id} found`)
    })()

  const search = startSearch(
    {
      leveledSkills: skills
        .map(row => row.skill)
        .filter((skill): skill is LeveledSkillOfRow => skill !== null)
        .map(skill => ({
          level: skill.level,
          skill: skillOf(skill.id),
        })),
    },
    {
      availableParts: state.data.armors, // FIXME do not activate all parts !
      decorations: stock.decorations,
    }
  )

  let unsubscribable!: Unsubscribable
  const promise = new Promise<undefined>(
    (resolve, reject) =>
      (unsubscribable = search.subscribe({
        next: build => dispatch(actions.addBuild({id: uniqid(), build})),
        error: reject,
        complete: resolve,
      }))
  )

  return {
    cancel: () => unsubscribable.unsubscribe(),
    promise,
  }
}
