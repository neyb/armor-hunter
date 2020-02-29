import {Build, PartType, Slot} from "./types"
import {LeveledSkill} from "/logic/search/LeveledSkill"
import {ArmorPart} from "/logic/search/ArmorPart"
import {reduce} from "rxjs/operators"
import {search} from "./search"
import {SearchContext} from "/logic/search/searchContext"
import {Decoration} from "/logic/search/Decoration"

describe("search", () => {
  const postMessage = jest.fn()

  beforeAll(() => {
    postMessage.mockReset()
  })

  test("impossible build returns no build", () =>
    searchAll({
      leveledSkills: [LeveledSkill.of("skill", 1)],
      availableParts: [],
    }).then(builds => expect(builds).toEqual([])))

  test("with only 1 part works as expected", () =>
    searchAll({
      leveledSkills: [LeveledSkill.of("skill", 1)],
      availableParts: [ArmorPart.of("set1", 1, PartType.head, [LeveledSkill.of("skill", 1)], [])],
    }).then(builds => expect(builds).toMatchObject([{head: {set: {id: "set1"}}}])))

  test("a build with only 1 decoration is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [], [1])],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {}, decorations: [decoration]}])
  })

  test("a build with only 1 decoration in super size slot is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [], [2])],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {}, decorations: [decoration]}])
  })

  test("a build with only 2 decorations is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 2)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [], [1, 1])],
      decorations: [decoration, decoration],
    })
    expect(builds).toMatchObject([
      {
        head: {},
        decorations: [decoration, decoration],
      },
    ])
  })

  test("a build with 1 armor & 1 decoration is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 2)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [LeveledSkill.of("skill1", 1)], [1])],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {set: {id: "set"}}, decorations: [decoration]}])
  })

  test("a build needing 2 same decorations but got only 1 find no builds", async () => {
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 2)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [], [1, 1])],
      decorations: [Decoration.of(1, "skill1")],
    })
    expect(builds).toMatchObject([])
  })

  test.skip("a build with only a decoration lvl4", async () => {
    const decoration = Decoration.dual("skill1", "skill2")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1), LeveledSkill.of("skill2", 1)],
      availableParts: [ArmorPart.of("set", 1, PartType.head, [], [Slot.lvl4])],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {set: {id: "set"}}, decorations: [decoration]}])
  })

  function searchAll({
    leveledSkills = [],
    availableParts = [],
    decorations = [],
  }: {
    leveledSkills?: LeveledSkill[]
    availableParts?: ArmorPart[]
    decorations?: Decoration[]
  }): Promise<Build[]> {
    const context = SearchContext.from({availableParts, decorations})
    return search({leveledSkills}, context)
      .pipe(reduce((builds: Build[], build: Build) => [...builds, build], []))
      .toPromise()
  }
})

describe("context filtering", () => {
  test("parts of different type does not filter each other", () => {
    const filteredContext = SearchContext.from({
      availableParts: [
        ArmorPart.of("set1", 1, PartType.head, [LeveledSkill.of("skill1", 3)], []),
        ArmorPart.of("set2", 1, PartType.chest, [LeveledSkill.of("skill1", 2)], []),
      ],
      decorations: [],
    }).filter({
      leveledSkills: [LeveledSkill.of("skill1", 3)],
    })

    expect(filteredContext.availableParts).toMatchObject([{set: {id: "set1"}}, {set: {id: "set2"}}])
  })

  describe("filtering on skills", () => {
    test("same part but one with 1 leveledSkill higher level than the other should", () => {
      const filteredContext = SearchContext.from({
        availableParts: [
          ArmorPart.of("set1", 1, PartType.head, [LeveledSkill.of("skill1", 3)], []),
          ArmorPart.of("set2", 1, PartType.head, [LeveledSkill.of("skill1", 2)], []),
        ],
        decorations: [],
      }).filter({
        leveledSkills: [LeveledSkill.of("skill1", 3)],
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
          ArmorPart.of("set4", 1, PartType.head, [], [1, 1, 1, 3]),
        ],
        decorations: [],
      }).filter({leveledSkills: []})
      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set3"}}, {set: {id: "set4"}}])
    })
  })

  describe("filtering on rarity", () => {
    test("same parts with different rarity", () => {
      const filteredContext = SearchContext.from({
        availableParts: [
          ArmorPart.of("set1", 1, PartType.head, [], []),
          ArmorPart.of("set2", 2, PartType.head, [], []),
        ],
        decorations: [],
      }).filter({leveledSkills: []})
      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set2"}}])
    })
  })
})
