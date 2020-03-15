import {ArmorPart, Decoration, PartType, Skill} from "../data/data"

const mhwdbUri = "https://mhw-db.com/"

const get = (path: string, params: any): Promise<Response> => {
  const url = new URL(mhwdbUri)
  url.pathname = path
  url.search = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => Object.assign(acc, {[key]: value}), {})
  ).toString()
  return fetch(url.toString())
}

type SkillMhwDb = {id: number; name: string; ranks: {level: number}[]}
export const fetchSkills = () =>
  get("/skills", {p: JSON.stringify({id: true, name: true, "ranks.level": true})})
    .then(r => r.json() as Promise<SkillMhwDb[]>)
    .then(skills => skills.map(({name, ranks}) => ({id: name, maxLevel: Math.max(...ranks.map(r => r.level))})))

type ArmorSetMhwdb = {
  rank: string
  name: string
  pieces: ArmorMhwdb[]
  bonus: {name: string; ranks: {pieces: number; skill: {skillName: string}}[]} | null
}

type ArmorMhwdb = {
  name: string
  type: PartTypeMhwdb
  rarity: number
  defense: {base: number; max: number; augmented: number}
  resistances: {fire: number; water: number; ice: number; thunder: number; dragon: number}
  slots: {rank: number}[]
  skills: {level: number; skillName: string}[]
}

type PartTypeMhwdb = "head" | "chest" | "gloves" | "waist" | "legs"

const getSkill = (skills: Skill[], id: string) => {
  const found = skills.find(skill => skill.id === id)
  if (found === undefined || found === null) throw new Error("")
  return found
}

const toArmor = (skills: Skill[], armorsetMhwdb: ArmorSetMhwdb, armorMhwdb: ArmorMhwdb): ArmorPart => ({
  partType: toPartType(armorMhwdb.type),
  slots: armorMhwdb.slots.map(({rank}) => rank),
  set: {
    id: armorsetMhwdb.name,
    rarity: armorMhwdb.rarity,
    bonus:
      armorsetMhwdb.bonus === null
        ? null
        : {
            id: armorsetMhwdb.bonus.name,
            ranks: armorsetMhwdb.bonus.ranks.map(rank => ({
              pieces: rank.pieces,
              skill: getSkill(skills, rank.skill.skillName),
            })),
          },
  },
  skills: armorMhwdb.skills.map(skill => ({
    level: skill.level,
    skill: getSkill(skills, skill.skillName),
  })),
})

const toPartType = (partType: PartTypeMhwdb): PartType => {
  switch (partType) {
    case "head":
      return PartType.head
    case "chest":
      return PartType.chest
    case "gloves":
      return PartType.arm
    case "waist":
      return PartType.waist
    case "legs":
      return PartType.legs
  }
}

export const fetchArmors = (skills: Skill[]): Promise<ArmorPart[]> =>
  get("/armor/sets", {
    p: JSON.stringify({
      rank: true,
      name: true,
      "pieces.type": true,
      "pieces.rarity": true,
      "pieces.defense": true,
      "pieces.resistances": true,
      "pieces.name": true,
      "pieces.slots": true,
      "pieces.skills.level": true,
      "pieces.skills.skillName": true,
      bonus: true,
      "bonus.name": true,
      "bonus.ranks.pieces": true,
      "bonus.ranks.skill.skillName": true,
    }),
  })
    .then(r => r.json() as Promise<ArmorSetMhwdb[]>)
    .then(armorsetsMhwdb =>
      armorsetsMhwdb.flatMap(armorsetMhwdb =>
        armorsetMhwdb.pieces.map(armorMhwdb => toArmor(skills, armorsetMhwdb, armorMhwdb))
      )
    )

type DecorationMhwdb = {
  id: number
  name: string
  slot: number
  skills: {id: number; level: number; skillName: string}[]
}

export const fetchDecorations = (skills: Skill[]): Promise<Decoration[]> =>
  get("/decorations", {
    p: JSON.stringify({slot: true, name: true, "skills.id": true, "skills.level": true, "skills.skillName": true}),
  })
    .then(r => r.json() as Promise<DecorationMhwdb[]>)
    .then(decorations =>
      decorations.map(decoration => ({
        size: decoration.slot,
        leveledSkills: decoration.skills.map(skill => ({
          skill: getSkill(skills, skill.skillName),
          level: skill.level,
        })),
      }))
    )
