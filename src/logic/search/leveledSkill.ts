import {Skill} from "/logic/search/types";

export class LeveledSkill {

    static from = ({level, skill}: { level: number, skill: Skill }) => new LeveledSkill(level, skill);
    static of = (skill: string, level: number) => new LeveledSkill(level, {id: skill});

    constructor(readonly level: number,
                readonly skill: Skill) {
    }
}