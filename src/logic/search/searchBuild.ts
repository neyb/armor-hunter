import {Build, SearchRequest, Size} from "../data/data"
import {LeveledSkill} from "/logic/search/LeveledSkill"
import {Parts} from "/logic/search/Parts"
import {SearchContext} from "/logic/search/searchContext"
import {Decoration} from "/logic/search/Decoration"
import {Map} from "immutable"
import {Skill} from "/logic/search/Skill"

export function searchBuild(partsCandidate: Parts, request: SearchRequest, context: SearchContext): Build | undefined {
  return satisfy() ? fillDecorations() : undefined

  function satisfy(): boolean {
    return !calcMissingSlots().some(({missing}) => missing > 0)
  }

  function fillDecorations(): Build {
    return partsCandidate.withDecorations(getDecorationsFor())
  }

  function getDecorationsFor(): Decoration[] {
    const decorations = context.decorations.mutableCopy()

    return skillsNotInParts()
      .flatMap(leveledSkill => Array<Skill>(leveledSkill.level).fill(leveledSkill.skill))
      .map(skill => decorations.takeMinDecoration(skill))
      .filter<Decoration>((dec): dec is Decoration => dec !== undefined)
  }

  function calcNeedsPerSlot(): Map<Size | undefined, {nb: number; skills: Skill[]}> {
    const decorations = context.decorations.mutableCopy()
    return skillsNotInParts()
      .flatMap(leveledSkill => Array<Skill>(leveledSkill.level).fill(leveledSkill.skill))
      .reduce(
        (acc, neededSkill) =>
          acc.update(decorations.takeMinDecoration(neededSkill)?.size, (v = {nb: 0, skills: []}) => {
            v.nb += 1
            v.skills.push(neededSkill)
            return v
          }),
        Map<Size | undefined, {nb: number; skills: Skill[]}>()
      )
  }

  function skillsNotInParts(): LeveledSkill[] {
    return request.leveledSkills
      .map(LeveledSkill.ofData)
      .map(leveledSkill => leveledSkill.minus(partsCandidate.skillFor(leveledSkill.skill)))
      .filter(skill => skill.level > 0)
  }

  function calcMissingSlots(): Map<Size | undefined, {missing: number; skills: Skill[]}> {
    const needsPerSlot = calcNeedsPerSlot()
    const availableSlots = partsCandidate.availableSlots() as Map<Size | undefined, number>
    return [undefined, Size.lvl1, Size.lvl2, Size.lvl3, Size.lvl4]
      .reduce((map, slot) => {
        const slotInfo = needsPerSlot.get(slot) || {nb: 0, skills: []}
        return map.set(slot, {missing: slotInfo.nb - availableSlots.get(slot, 0), skills: slotInfo.skills})
      }, Map<Size | undefined, {missing: number; skills: Skill[]}>().asMutable())
      .withMutations(recycleUnusedSlots)
      .asImmutable()
  }

  function recycleUnusedSlots(missingSlots: Map<Size | undefined, {missing: number; skills: Skill[]}>) {
    ;[Size.lvl1, Size.lvl2, Size.lvl3].reduce<Size[]>((unplaced, slotSize) => {
      const sizeInfo = missingSlots.get(slotSize) || {missing: 0, skills: []}

      for (let i = 0; i < sizeInfo.missing; i++) {
        unplaced.push(slotSize)
      }

      for (let i = 0; i < -1 * sizeInfo.missing; i++) {
        const DecoSizeToPlace = unplaced.pop()
        if (DecoSizeToPlace !== undefined) {
          missingSlots.update(DecoSizeToPlace, sizeInfo => ({missing: sizeInfo.missing - 1, skills: sizeInfo.skills}))
          missingSlots.update(slotSize, sizeInfo => ({missing: sizeInfo.missing + 1, skills: sizeInfo.skills}))
        }
      }

      return unplaced
    }, [])
  }
}
