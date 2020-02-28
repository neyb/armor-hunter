import {SearchRequest, Slot} from "./types"
import {is, List, Map, Seq, ValueObject} from "immutable"
import {min} from "lodash"
import {Skill} from "/logic/search/Skill"
import {Decoration} from "/logic/search/Decoration"

export class Decorations {
  constructor(readonly decorations: Map<Decoration, number>) {}

  static of(decorations: Decoration[]) {
    return new Decorations(List(decorations).countBy(dec => dec))
  }

  filterFor(request: SearchRequest): Decorations {
    return new Decorations(
      Map(
        this.decorations.filter((_, decoration) =>
          request.leveledSkills.some(leveledSkill => decoration.hasSkill(leveledSkill.skill))
        )
      )
    )
  }

  forSkill(skill: Skill): Seq.Indexed<Decoration> {
    return this.decorations.keySeq().filter(decoration => decoration.hasSkill(skill))
  }

  minNeededSlot(skill: Skill): Slot | undefined {
    const map = this.decorations
      .keySeq()
      .filter(dec => dec.hasSkill(skill))
      .map(dec => dec.size)
    return min(map.toArray())
  }

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
