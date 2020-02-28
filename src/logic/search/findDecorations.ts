import {Build, PartType, SearchRequest, Slot} from "/logic/search/types"
import {LeveledSkill} from "/logic/search/leveledSkill"
import {PartsCandidate} from "/logic/search/partsCandidate"
import {SearchContext} from "/logic/search/searchContext"
import {Decoration} from "/logic/search/decoration"
import {Map} from "immutable"
import {Skill} from "/logic/search/skill"

export function findDecorations(
  partsCandidate: PartsCandidate,
  request: SearchRequest,
  context: SearchContext
): Build[] {
  const {parts} = partsCandidate

  if (satisfy()) return [fillDecorations()]
  else return []

  function satisfy(): boolean {
    const neededSlots = calcNeedsPerSlot()
    if (neededSlots.get(undefined)) return false
    const availableSlots = calcAvailableSlots()
    const unused = [Slot.large, Slot.medium, Slot.small].reduce((remaining, slot) => {
      if (remaining < 0) return remaining
      return remaining + ((slot && availableSlots.get(slot)) || 0) - (neededSlots.get(slot) || 0)
    }, 0)
    return unused >= 0
  }

  function fillDecorations(): Build {
    return withDecorations(getDecorationsFor())
  }

  function getDecorationsFor(): Decoration[] {
    const decorations = context.decorations.mutableCopy()

    return missingSlots()
      .flatMap(leveledSkill => Array<Skill>(leveledSkill.level).fill(leveledSkill.skill))
      .map(skill => decorations.takeMinDecoration(skill))
      .filter<Decoration>(function(dec: Decoration | undefined): dec is Decoration {
        return dec !== undefined
      })
  }

  function withDecorations(decorations: Decoration[]): Build {
    return {
      head: parts.find(part => part.partType === PartType.head),
      chest: parts.find(part => part.partType === PartType.chest),
      arm: parts.find(part => part.partType === PartType.arm),
      waist: parts.find(part => part.partType === PartType.waist),
      legs: parts.find(part => part.partType === PartType.legs),
      decorations: decorations,
    }
  }

  function calcNeedsPerSlot(): Map<Slot | undefined, number> {
    const decorations = context.decorations.mutableCopy()
    return missingSlots()
      .flatMap(leveledSkill => Array<Skill>(leveledSkill.level).fill(leveledSkill.skill))
      .reduce(
        (acc, neededSkill) => acc.update(decorations.takeMinDecoration(neededSkill)?.size, (v = 0) => v + 1),
        Map<Slot | undefined, number>()
      )
  }

  function calcAvailableSlots(): Map<Slot, number> {
    return parts.reduce(
      (nbBySlot, part) => part.slots.reduce((nbBySlot, slot) => nbBySlot.update(slot, (nb = 0) => nb + 1), nbBySlot),
      Map<Slot, number>()
    )
  }

  function missingSlots(): LeveledSkill[] {
    return request.leveledSkills
      .map(leveledSkill => leveledSkill.minus(partsCandidate.skillFor(leveledSkill.skill)))
      .filter(skill => skill.level > 0)
  }
}
