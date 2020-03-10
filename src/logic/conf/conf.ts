import {ArmorPart, Decoration, Skill} from "../data"
import {fetchArmors, fetchDecorations, fetchSkills} from "./mhwdbClient"
import {actions} from "../data/store"
import {RootState} from "../store"
import {Store} from "redux"

export async function reloadData(store: Store<RootState>) {
  const skills = await loadSkills(store)
  loadArmors(store, skills)
  loadDecorations(store, skills)
}

async function loadSkills(store: Store<RootState>): Promise<Skill[]> {
  const skills = store.getState().data.skills
  return skills.length
    ? skills
    : await (async () => {
        const skills = await fetchSkills()
        store.dispatch(actions.updateSkills(skills))
        return skills
      })()
}

async function loadArmors(store: Store<RootState>, skills: Skill[]): Promise<ArmorPart[]> {
  const armors = store.getState().data.armors
  return armors.length
    ? armors
    : await (async () => {
        const armors = await fetchArmors(skills)
        store.dispatch(actions.updateArmors(armors))
        return armors
      })()
}

async function loadDecorations(store: Store<RootState>, skills: Skill[]): Promise<Decoration[]> {
  const decorations = store.getState().data.decorations
  return decorations.length
    ? decorations
    : await (async () => {
        const decorations = await fetchDecorations(skills)
        store.dispatch(actions.updateDecorations(decorations))
        return decorations
      })()
}
