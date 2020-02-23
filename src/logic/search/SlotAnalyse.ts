import {LeveledSkill} from "/logic/search/leveledSkill"
import {Slot} from "/logic/search/types"

export interface PartsCandidateAnalyseResult {
  notCoverableWithNormalDecoSkills: LeveledSkill[]
  neededSlotEquivalent: Map<Slot | undefined, number>
}
