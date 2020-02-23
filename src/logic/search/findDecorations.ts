import {Build, Decoration, PartType, SearchContext, SearchRequest, Slot} from "/logic/search/types"
import {LeveledSkill} from "/logic/search/leveledSkill"
import {PartsCandidate} from "/logic/search/partsCandidate"

export const findDecorations = (
  partsCandidate: PartsCandidate,
  request: SearchRequest,
  context: SearchContext
): Build[] => {
  const {parts} = partsCandidate

  if (satisfy()) return [fillDecorations()]
  else return []

  function satisfy(): boolean {
    const neededSlots = calcNeedsPerSlot()
    if (neededSlots.get(undefined)?.total) return false
    const availableSlots = calcAvailableSlots()
    const unused = [Slot.large, Slot.medium, Slot.small].reduce((remaining, slot) => {
      if (remaining < 0) return remaining
      return remaining + ((slot && availableSlots.get(slot)) || 0) - (neededSlots.get(slot)?.total || 0)
    }, 0)
    return unused >= 0
  }

  function fillDecorations(): Build {
    return withDecorations(getDecorationsFor())
  }

  function getDecorationsFor(): Decoration[] {
    return missingLeveledSkills()
      .flatMap(leveledSkill => Array(leveledSkill.level).fill(leveledSkill.skill))
      .map(skill => context.decorations.forSkill(skill))
  }

  function withDecorations(decorations: Decoration[]): Build {
    return {
      head: parts.find(part => part.partType === PartType.head),
      chest: parts.find(part => part.partType === PartType.chest),
      arm: parts.find(part => part.partType === PartType.arm),
      waist: parts.find(part => part.partType === PartType.waist),
      legs: parts.find(part => part.partType === PartType.legs),
      decorations: decorations
    }
  }

  function calcNeedsPerSlot(): Map<Slot | undefined, {total: number; leveledSkills: LeveledSkill[]}> {
    return missingLeveledSkills().reduce((result, skill) => {
      const minSkillSlot = context.decorations.minNeededSlot(skill.skill)
      const value = result.get(minSkillSlot) || {total: 0, leveledSkills: []}
      value.leveledSkills.push(skill)
      value.total += skill.level
      result.set(minSkillSlot, value)
      return result
    }, new Map<Slot | undefined, {total: number; leveledSkills: LeveledSkill[]}>())
  }

  function calcAvailableSlots(): Map<Slot, number> {
    return parts.reduce((nbBySlot, part) => {
      part.slots.forEach(slot => nbBySlot.set(slot, (nbBySlot.get(slot) || 0) + 1))
      return nbBySlot
    }, new Map())
  }

  function missingLeveledSkills(): LeveledSkill[] {
    return request.leveledSkills
      .map(leveledSkill => leveledSkill.minus(partsCandidate.skillFor(leveledSkill.skill)))
      .filter(skill => skill.level > 0)
  }
}
