import {Skill} from "/logic/search/types";

export class LeveledSkill {

    static from = ({level, skill}: { level: number, skill: Skill }) => new LeveledSkill(level, skill);
    static of = (skill: string, level: number) => new LeveledSkill(level, {id: skill});

    constructor(readonly level: number,
                readonly skill: Skill) {
    }

    isBetterOrSameLevelThan(other: LeveledSkill): boolean {
        return other.skill.id === this.skill.id && this.level >= other.level
    }

    plus = (other: LeveledSkill) => new LeveledSkill(this.level + other.level, this.skill)

    minus = (other:LeveledSkill) => new LeveledSkill(this.level - other.level, this.skill)
}