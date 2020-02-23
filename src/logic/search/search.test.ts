import {Build, Decoration, PartType, SearchContext} from "./types"
import {LeveledSkill} from "./leveledSkill"
import {ArmorPart} from "./armorPart"
import {reduce} from "rxjs/operators"
import {search} from "./search"

describe("search", () => {
  const postMessage = jest.fn()

  beforeAll(() => {
    postMessage.mockReset()
  })

  test("impossible build returns no build", () =>
    searchAll({
      leveledSkills: [LeveledSkill.of("skill", 1)],
      availableParts: []
    }).then(builds => expect(builds).toEqual([])))

  test("with only 1 part works as expected", () =>
    searchAll({
      leveledSkills: [LeveledSkill.of("skill", 1)],
      availableParts: [ArmorPart.of("set1", 1, PartType.head, [LeveledSkill.of("skill", 1)], [])]
    }).then(builds => expect(builds).toMatchObject([{head: {set: {id: "set1"}}}])))

  test("a build with only decoration is ok", () =>
    searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [], [1])],
      decorations: [Decoration.of(1, "skill1")]
    }).then(builds => {
      expect(builds).toMatchObject([{head: {}, decorations: [{skill: {id: "skill1"}}]}])
    }))

  function searchAll({
    leveledSkills,
    availableParts,
    decorations = []
  }: {
    leveledSkills: LeveledSkill[]
    availableParts: ArmorPart[]
    decorations?: Decoration[]
  }): Promise<Build[]> {
    return search({leveledSkills}, SearchContext.from({availableParts, decorations: decorations || []}))
      .pipe(reduce((builds: Build[], build: Build) => [...builds, build], []))
      .toPromise()
  }
})

describe("context filtering", () => {
  test("parts of different type does not filter each other", () => {
    const filteredContext = SearchContext.from({
      availableParts: [
        ArmorPart.of("set1", 1, PartType.head, [LeveledSkill.of("skill1", 3)], []),
        ArmorPart.of("set2", 1, PartType.chest, [LeveledSkill.of("skill1", 2)], [])
      ],
      decorations: []
    }).filter({
      leveledSkills: [LeveledSkill.of("skill1", 3)]
    })

    expect(filteredContext.availableParts).toMatchObject([{set: {id: "set1"}}, {set: {id: "set2"}}])
  })

  describe("filtering on skills", () => {
    test("same part but one with 1 skill higher level than the other should", () => {
      const filteredContext = SearchContext.from({
        availableParts: [
          ArmorPart.of("set1", 1, PartType.head, [LeveledSkill.of("skill1", 3)], []),
          ArmorPart.of("set2", 1, PartType.head, [LeveledSkill.of("skill1", 2)], [])
        ],
        decorations: []
      }).filter({
        leveledSkills: [LeveledSkill.of("skill1", 3)]
      })

      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set1"}}])
    })
  })

  describe("filter on slots", () => {
    test("complex test", () => {
      const filteredContext = SearchContext.from({
        availableParts: [
          ArmorPart.of("set1", 1, PartType.head, [], [1, 1, 3]),
          ArmorPart.of("set2", 1, PartType.head, [], [1, 2, 2]),
          ArmorPart.of("set3", 1, PartType.head, [], [1, 2, 3]),
          ArmorPart.of("set4", 1, PartType.head, [], [1, 1, 1, 3])
        ],
        decorations: []
      }).filter({leveledSkills: []})
      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set3"}}, {set: {id: "set4"}}])
    })
  })

  describe("filtering on rarity", () => {
    test("same parts with different rarity", () => {
      const filteredContext = SearchContext.from({
        availableParts: [
          ArmorPart.of("set1", 1, PartType.head, [], []),
          ArmorPart.of("set2", 2, PartType.head, [], [])
        ],
        decorations: []
      }).filter({leveledSkills: []})
      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set2"}}])
    })
  })
})
