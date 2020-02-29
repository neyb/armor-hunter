import {ArmorSet, Build, PartType, SetSkill, Size} from "./types"
import {LeveledSkill} from "./LeveledSkill"
import {ArmorPart} from "./ArmorPart"
import {reduce} from "rxjs/operators"
import {search} from "./search"
import {SearchContext} from "./searchContext"
import {Decoration} from "./Decoration"
import {Skill} from "/logic/search/Skill"

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
      availableParts: [part({skills: [LeveledSkill.of("skill", 1)]})],
    }).then(builds => expect(builds).toMatchObject([{head: {set: {id: "set"}}}])))

  test("a build with only 1 decoration is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1)],
      availableParts: [part({slots: [1]})],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {}, decorations: [decoration]}])
  })

  test("a build with only 1 decoration in super size slot is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1)],
      availableParts: [part({slots: [2]})],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {}, decorations: [decoration]}])
  })

  test("a build with only 2 decorations is ok", async () => {
    const decoration = Decoration.of(1, "skill1")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 2)],
      availableParts: [part({slots: [1, 1]})],
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
      availableParts: [part({skills: [LeveledSkill.of("skill1", 1)], slots: [1]})],
      decorations: [decoration],
    })
    expect(builds).toMatchObject([{head: {set: {id: "set"}}, decorations: [decoration]}])
  })

  test("a build needing 2 same decorations but got only 1 find no builds", async () => {
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 2)],
      availableParts: [part({slots: [1, 1]})],
      decorations: [Decoration.of(1, "skill1")],
    })
    expect(builds).toMatchObject([])
  })

  test("a build with only a set skill is ok", async () => {
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("set skill", 1)],
      availableParts: [part({set: set({setSkills: [{skill: new Skill("set skill"), ActivationPartCount: 1}]})})],
      decorations: [Decoration.of(1, "skill1")],
    })
    expect(builds).toMatchObject([])
  })

  test.skip("a build with only a decoration lvl4", async () => {
    const decoration = Decoration.dual("skill1", "skill2")
    const builds = await searchAll({
      leveledSkills: [LeveledSkill.of("skill1", 1), LeveledSkill.of("skill2", 1)],
      availableParts: [part({slots: [4]})],
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
        part({set: set({id: "set1"}), partType: PartType.head, skills: [LeveledSkill.of("skill1", 3)]}),
        part({set: set({id: "set2"}), partType: PartType.chest, skills: [LeveledSkill.of("skill1", 2)]}),
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
          part({set: set({id: "set1"}), skills: [LeveledSkill.of("skill1", 3)]}),
          part({set: set({id: "set2"}), skills: [LeveledSkill.of("skill1", 2)]}),
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
          part({set: set({id: "set1"}), slots: [1, 1, 3]}),
          part({set: set({id: "set2"}), slots: [1, 2, 2]}),
          part({set: set({id: "set3"}), slots: [1, 2, 3]}),
          part({set: set({id: "set4"}), slots: [1, 1, 1, 3]}),
        ],
        decorations: [],
      }).filter({leveledSkills: []})
      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set3"}}, {set: {id: "set4"}}])
    })
  })

  describe("filtering on rarity", () => {
    test("same parts with different rarity", () => {
      const filteredContext = SearchContext.from({
        availableParts: [part({set: set({id: "set1", rarity: 1})}), part({set: set({id: "set2", rarity: 2})})],
        decorations: [],
      }).filter({leveledSkills: []})
      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set2"}}])
    })
  })
})

function set({
  id = "set",
  rarity = 1,
  setSkills = [],
}: {
  id?: string
  rarity?: number
  setSkills?: SetSkill[]
} = {}): ArmorSet {
  return {id, rarity, setSkills}
}

const defaultSet = set()
function part({
  set = defaultSet,
  partType = PartType.head,
  skills = [],
  slots = [],
}: {
  set?: ArmorSet
  partType?: PartType
  skills?: LeveledSkill[]
  slots?: Size[]
}): ArmorPart {
  return new ArmorPart(set, partType, skills, slots)
}
