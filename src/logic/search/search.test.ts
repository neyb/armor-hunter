import {
  ArmorPart,
  ArmorSet,
  Build,
  Decoration,
  dualDecoration,
  LeveledSkill as LeveledSkillData,
  PartType,
  simpleDecoration,
  Size,
  SetSkill as SetSkillData,
  Skill,
} from "./data"
import {reduce} from "rxjs/operators"
import {search} from "./search"
import {SearchContext} from "./searchContext"

const skill = (nb?: number) => ({id: `skill${nb || ""}`})
const setSkill = {id: "set row"}
const level = (level: number) => (skill: Skill) => ({level, skill})
const level1 = level(1)

describe("search", () => {
  const postMessage = jest.fn()

  beforeAll(() => {
    postMessage.mockReset()
  })

  describe("without decoration", () => {
    test("impossible build returns no build", () =>
      searchAll({
        leveledSkills: [level1(skill())],
        availableParts: [],
      }).then(builds => expect(builds).toEqual([])))

    test("with only 1 part works as expected", () =>
      searchAll({
        leveledSkills: [level1(skill())],
        availableParts: [part({skills: [level1(skill())]})],
      }).then(builds => expect(builds).toMatchObject([{head: {set: {id: "set"}}}])))
  })

  describe("simple decorations", () => {
    test("a build with only 1 decoration is ok", async () => {
      const builds = await searchAll({
        leveledSkills: [level1(skill(1))],
        availableParts: [part({slots: [1]})],
        decorations: [[simpleDecoration(1, skill(1)), 1]],
      })
      expect(builds).toMatchObject([{head: {}, decorations: [[simpleDecoration(1, skill(1)), 1]]}])
    })

    test("a build with only 1 decoration in super size slot is ok", async () => {
      const decoration = simpleDecoration(1, skill(1))
      const builds = await searchAll({
        leveledSkills: [level1(skill(1))],
        availableParts: [part({slots: [2]})],
        decorations: [[decoration, 1]],
      })
      expect(builds).toMatchObject([{head: {}, decorations: [[decoration, 1]]}])
    })

    test("a build with only 2 decorations is ok", async () => {
      const decoration = simpleDecoration(1, skill(1))
      const builds = await searchAll({
        leveledSkills: [level(2)(skill(1))],
        availableParts: [part({slots: [1, 1]})],
        decorations: [[decoration, 2]],
      })
      expect(builds).toMatchObject([
        {
          head: {},
          decorations: [[decoration, 2]],
        },
      ])
    })

    test("a build with 1 armor & 1 decoration is ok", async () => {
      const decoration = simpleDecoration(1, skill(1))
      const builds = await searchAll({
        leveledSkills: [level(2)(skill(1))],
        availableParts: [part({skills: [level1(skill(1))], slots: [1]})],
        decorations: [[decoration, 1]],
      })
      expect(builds).toMatchObject([{head: {set: {id: "set"}}, decorations: [[decoration, 1]]}])
    })

    test("a build needing 2 same decorations but got only 1 find no builds", async () => {
      const builds = await searchAll({
        leveledSkills: [level(2)(skill(1))],
        availableParts: [part({slots: [1, 1]})],
        decorations: [[simpleDecoration(1, skill(1)), 1]],
      })
      expect(builds).toMatchObject([])
    })
  })

  describe("with set rows", () => {
    test("a build with only a set row is ok", async () => {
      const builds = await searchAll({
        leveledSkills: [{skill: setSkill, level: 1}],
        availableParts: [part({set: set({setSkills: [{skill: setSkill, activationPartCount: 1}]})})],
        decorations: [],
      })
      expect(builds).toMatchObject([{head: {}}])
    })

    test("3 parts available of 2-parts set row should make 4 builds (3x(2 of them)+1xall)", async () => {
      const builds = await searchAll({
        leveledSkills: [level(1)(setSkill)],
        availableParts: [
          part({
            partType: PartType.head,
            set: set({setSkills: [{skill: setSkill, activationPartCount: 2}]}),
          }),
          part({
            partType: PartType.chest,
            set: set({setSkills: [{skill: setSkill, activationPartCount: 2}]}),
          }),
          part({
            partType: PartType.arm,
            set: set({setSkills: [{skill: setSkill, activationPartCount: 2}]}),
          }),
        ],
        decorations: [],
      })

      expect(builds).toHaveLength(4)
    })
  })

  describe.skip("lvl4 decorations", () => {
    test("a build with only a decoration lvl4", async () => {
      const decoration = dualDecoration(skill(1), skill(2))
      const builds = await searchAll({
        leveledSkills: [level1(skill(1)), level1(skill(2))],
        availableParts: [part({slots: [4]})],
        decorations: [[decoration, 1]],
      })
      expect(builds).toMatchObject([{head: {set: {id: "set"}}, decorations: [decoration]}])
    })
  })

  function searchAll({
    leveledSkills = [],
    availableParts = [],
    decorations = [],
  }: {
    leveledSkills?: LeveledSkillData[]
    availableParts?: ArmorPart[]
    decorations?: [Decoration, number][]
  }): Promise<Build[]> {
    return search({leveledSkills}, SearchContext.ofData({availableParts, decorations}))
      .pipe(reduce((builds: Build[], build: Build) => [...builds, build], []))
      .toPromise()
  }
})

describe("context filtering", () => {
  test("parts of different type does not filter each other", () => {
    const filteredContext = SearchContext.ofData({
      availableParts: [
        part({set: set({id: "set1"}), partType: PartType.head, skills: [level(3)(skill(1))]}),
        part({set: set({id: "set2"}), partType: PartType.chest, skills: [level(2)(skill(1))]}),
      ],
      decorations: [],
    }).filter({
      leveledSkills: [level(3)(skill(1))],
    })

    expect(filteredContext.availableParts).toMatchObject([{set: {id: "set1"}}, {set: {id: "set2"}}])
  })

  describe("filtering on rows", () => {
    test("same part but one with 1 leveledSkill higher level than the other should", () => {
      const filteredContext = SearchContext.ofData({
        availableParts: [
          part({set: set({id: "set1"}), skills: [level(3)(skill(1))]}),
          part({set: set({id: "set2"}), skills: [level(2)(skill(1))]}),
        ],
        decorations: [],
      }).filter({
        leveledSkills: [level(3)(skill(1))],
      })

      expect(filteredContext.availableParts).toMatchObject([{set: {id: "set1"}}])
    })
  })

  describe("filter on slots", () => {
    test("complex test", () => {
      const filteredContext = SearchContext.ofData({
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
      const filteredContext = SearchContext.ofData({
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
  setSkills?: SetSkillData[]
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
  skills?: LeveledSkillData[]
  slots?: Size[]
}): ArmorPart {
  return {set, partType, skills, slots}
}
