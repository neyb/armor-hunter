import {SearchRequest} from "/logic/builder/search/SearchRequest"
import {ArmorPart} from "./ArmorPart"
import {ArmorPart as ArmorPartData} from "/logic/builder/search/data"
import {PartType} from "./data"
import {merge, RecursivePartial} from "/lib/merge"

const defaultPart: ArmorPartData = {
  set: {id: "set", rarity: 1, bonus: null},
  skills: [],
  partType: PartType.head,
  slots: [],
}

// @ts-ignore
const part = (customize: RecursivePartial<ArmorPart>): ArmorPart => ArmorPart.ofData(merge(defaultPart, customize))

describe("hasBetterSkills", () => {
  test("higher level is better", () => {
    const skill = {id: "skill1", maxLevel: 1}
    const part1 = part({skills: [{level: 2, skill}]})
    const part2 = part({skills: [{level: 1, skill}]})
    const request = SearchRequest.ofData({leveledSkills: [{level: 3, skill}]})

    expect(part1.isABetterPart(part2, request)).toBe(true)
    expect(part2.isABetterPart(part1, request)).toBe(false)
  })

  test("higher level is better, even without a not searched skill, is better", () => {
    const skill1 = {id: "skill1", maxLevel: 1}
    const skill2 = {id: "skill2", maxLevel: 1}
    const part1 = part({skills: [{level: 2, skill: skill1}]})
    const part2 = part({
      skills: [
        {level: 1, skill: skill1},
        {level: 1, skill: skill2},
      ],
    })
    const request = SearchRequest.ofData({leveledSkills: [{level: 3, skill: skill1}]})

    expect(part1.isABetterPart(part2, request)).toBe(true)
    expect(part2.isABetterPart(part1, request)).toBe(false)
  })

  test("higher level is better, but without a searched skill, is not better", () => {
    const skill1 = {id: "skill1", maxLevel: 1}
    const skill2 = {id: "skill2", maxLevel: 1}
    const part1 = part({
      skills: [
        {level: 1, skill: skill1},
        {level: 1, skill: skill2},
      ],
    })
    const part2 = part({skills: [{level: 2, skill: skill1}]})
    const request = SearchRequest.ofData({
      leveledSkills: [
        {level: 3, skill: skill1},
        {level: 3, skill: skill2},
      ],
    })

    expect(part2.isABetterPart(part1, request)).toBe(false)
    expect(part1.isABetterPart(part2, request)).toBe(false)
  })

  test("a worst part having a searched setskill, is not worst", () => {
    const skill = {id: "skill", maxLevel: 1}
    const setSkill = {id: "setskill", maxLevel: 1}

    const part1 = part({
      skills: [{level: 1, skill}],
      set: {bonus: {id: "bonus", ranks: [{pieces: 3, skill: setSkill}]}},
    })
    const part2 = part({skills: [{level: 2, skill}]})

    const request = SearchRequest.ofData({
      leveledSkills: [
        {level: 3, skill},
        {level: 1, skill: setSkill},
      ],
    })

    expect(part1.isABetterPart(part2, request)).toBe(false)
    expect(part2.isABetterPart(part1, request)).toBe(false)
  })
})
