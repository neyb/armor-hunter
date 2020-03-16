import {actions, LeveledSkillRow} from "./store"
import {startSearch} from "/logic/builder/search/index"
import {SearchRequest, Skill} from "./search/data"
import {Unsubscribable} from "rxjs"
import {Dispatch} from "redux"
import {RootState} from "../store"
import {Build} from "/logic/builder/search/Build"
import {LeveledSkill} from "/logic/builder/search/LeveledSkill"

export const searchRequest = (state: RootState): SearchRequest => {
  const allSkills: Skill[] = state.data.skills
  const skills: LeveledSkillRow[] = state.builder.query.skills

  const skillOf = (id: string) =>
    allSkills.find(skill => skill.id === id) ||
    (() => {
      throw new Error(`no skill with id ${id} found`)
    })()

  return {
    leveledSkills: skills
      .map(row => row.skill)
      .filter((skill): skill is LeveledSkill => skill !== null)
      .map(skill => ({
        level: skill.level,
        skill: skillOf(skill.skill.id),
      })),
  }
}

export const startSearchAction = (
  dispatch: Dispatch,
  getState: () => RootState
): {cancel: () => void; promise: Promise<undefined>} => {
  dispatch(actions.clearBuilds(undefined))
  const state = getState()

  const stock = state.stock
  const search = startSearch(searchRequest(state), {
    availableParts: state.data.armors, // .filter(armor => armor.set.rarity > 9), // FIXME do not activate all parts !
    decorations: stock.decorations,
  })

  let unsubscribable!: Unsubscribable
  const promise = new Promise<undefined>(
    (resolve, reject) =>
      (unsubscribable = search.subscribe({
        next: build => dispatch(actions.addBuild(Build.ofData(build))),
        error: reject,
        complete: resolve,
      }))
  )

  return {
    cancel: () => unsubscribable.unsubscribe(),
    promise,
  }
}
