import {SearchRequest, Slot} from "./types"
import {is, List, Map, ValueObject, Seq} from "immutable"
import {min} from "lodash"
import {Skill} from "/logic/search/skill"
import {Decoration} from "/logic/search/decoration"

export class Decorations implements ValueObject {
  constructor(readonly decorationsAndQuantity: Map<Decoration, number>) {}

  static of(decorations: Decoration[]) {
    const decorationsAndQuantity1 = List(decorations).countBy(dec => dec)
    return new Decorations(decorationsAndQuantity1)
  }

  filterFor(request: SearchRequest): Decorations {
    return new Decorations(
      Map(
        this.decorationsAndQuantity
          .entrySeq()
          .filter(([decoration]) =>
            request.leveledSkills.some(leveledSkill => is(leveledSkill.skill, decoration.skill))
          )
      )
    )
  }

  forSkill(skill: Skill): Seq.Indexed<Decoration> {
    return this.decorationsAndQuantity.keySeq().filter(decoration => is(decoration.skill, skill))
  }

  minNeededSlot(skill: Skill): Slot | undefined {
    const map = this.decorationsAndQuantity
      .keySeq()
      .filter(dec => dec.skill.equals(skill))
      .map(dec => dec.size)
    return min(map.toArray())
  }

  hashCode = () => this.decorationsAndQuantity.hashCode()
  equals = (other: Decorations) => is(this.decorationsAndQuantity, other.decorationsAndQuantity)
  mutableCopy = () => new MutableDecorations(this.decorationsAndQuantity.asMutable())
}

class MutableDecorations extends Decorations {
  takeMinDecoration(skill: Skill): Decoration | undefined {
    const decoration = this.forSkill(skill).min((dec1, dec2) => dec1.size - dec2.size)
    if (decoration !== undefined) {
      const nb = this.decorationsAndQuantity.get(decoration)
      if (nb && nb > 1) this.decorationsAndQuantity.set(decoration, nb - 1)
      else this.decorationsAndQuantity.delete(decoration)
    }
    return decoration
  }
}
