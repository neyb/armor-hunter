import {List, Map, Seq} from "immutable"
import {Skill} from "./Skill"
import {Decoration} from "./Decoration"
import {SearchRequest, Size, Decoration as DecorationData} from "./data"

export class Decorations {
  static ofData = (data: [DecorationData, number][]) =>
    new Decorations(Map(data.map(([dec, nb]) => [Decoration.ofData(dec), nb])))
  static of = (decorations: Decoration[]) => new Decorations(List(decorations).countBy(dec => dec))
  constructor(readonly decorations: Map<Decoration, number>) {}

  filterFor(request: SearchRequest): Decorations {
    return new Decorations(
      Map(
        this.decorations.filter((_, decoration) =>
          request.leveledSkills.some(leveledSkill => decoration.hasSkill(Skill.ofData(leveledSkill.skill)))
        )
      )
    )
  }

  forSkill = (skill: Skill): Seq.Indexed<Decoration> =>
    this.decorations.keySeq().filter(decoration => decoration.hasSkill(skill))

  minNeededSlot = (skill: Skill): Size | undefined =>
    this.forSkill(skill)
      .map(decoration => decoration.size)
      .min()

  mutableCopy = () => new MutableDecorations(this.decorations.asMutable())
}

class MutableDecorations extends Decorations {
  takeMinDecoration(skill: Skill): Decoration | undefined {
    const decoration = this.forSkill(skill).min((dec1, dec2) => dec1.size - dec2.size)
    if (decoration !== undefined) {
      const nb = this.decorations.get(decoration)
      if (nb && nb > 1) this.decorations.set(decoration, nb - 1)
      else this.decorations.delete(decoration)
    }
    return decoration
  }
}
