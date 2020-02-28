import {Build, SearchRequest, Slot} from "/logic/search/types"
import {LeveledSkill} from "/logic/search/leveledSkill"
import {PartsCandidate} from "/logic/search/partsCandidate"
import {SearchContext} from "/logic/search/searchContext"
import {Decoration} from "/logic/search/decoration"
import {Map, mergeWith} from "immutable"
import {Skill} from "/logic/search/skill"

export function searchBuild(
  partsCandidate: PartsCandidate,
  request: SearchRequest,
  context: SearchContext
): Build | undefined {
  if (satisfy()) return fillDecorations()
  else return undefined

  function satisfy(): boolean {
    return !calcMissingSlots().some(value => value > 0)
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

  function calcNeedsPerSlot(): Map<Slot | undefined, number> {
    const decorations = context.decorations.mutableCopy()
    return skillsNotInParts()
      .flatMap(leveledSkill => Array<Skill>(leveledSkill.level).fill(leveledSkill.skill))
      .reduce(
        (acc, neededSkill) => acc.update(decorations.takeMinDecoration(neededSkill)?.size, (v = 0) => v + 1),
        Map<Slot | undefined, number>()
      )
  }

  function skillsNotInParts(): LeveledSkill[] {
    return request.leveledSkills
      .map(leveledSkill => leveledSkill.minus(partsCandidate.skillFor(leveledSkill.skill)))
      .filter(skill => skill.level > 0)
  }

  function calcMissingSlots(): Map<Slot | undefined, number> {
    return mergeWith((oldVal, newVal) => oldVal - newVal, calcNeedsPerSlot(), partsCandidate.availableSlots())
  }
}
