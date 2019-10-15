import {_, search} from "./search";
import {Build, PartType} from "./types";
import {LeveledSkill} from "./leveledSkill";
import {ArmorPart} from "./armorPart";
import {reduce} from "rxjs/operators";

window.onmessage = null;
describe("search", () => {
    const postMessage = jest.fn();

    beforeAll(() => {
        postMessage.mockReset();
    });

    const testFoundArmour = ({leveledSkills, availableParts, expectedBuilds}
                                 : { leveledSkills: LeveledSkill[], availableParts: ArmorPart[], expectedBuilds: Build[] }) =>
        () => searchAll({leveledSkills, availableParts})
            .then(builds => expect(builds).toEqual(expectedBuilds));

    test("impossible build returns no build", () => searchAll({
        leveledSkills: [LeveledSkill.of("skill", 1)],
        availableParts: [],
    }).then(builds => expect(builds).toEqual([])));

    test("with only 1 part works as expected", () => searchAll({
        leveledSkills: [LeveledSkill.of("skill", 1)],
        availableParts: [
            ArmorPart.of("set1", PartType.head, [LeveledSkill.of("skill", 1)])
        ],
    }).then(builds => expect(builds).toMatchObject([
            {
                head: {
                    set: {id: "set1"},
                    partType: PartType.head,
                    skills: [{level: 1, skill: {id: "skill"}}]
                }
            }
        ]
    )));
});

describe("filter", () => {
    const filter = _.filter;
    test("same part but one with 1 skill higher level than the other should", () => {
        const leveledSkill = LeveledSkill.of("skill1", 3);
        const filteredContext = filter({
                leveledSkills: [
                    LeveledSkill.of("skill1", 3)
                ]
            },
            {
                availableParts: [
                    ArmorPart.of("set1", PartType.head, [LeveledSkill.of("skill1", 3)]),
                    ArmorPart.of("set2", PartType.head, [LeveledSkill.of("skill1", 2)]),
                ]
            });

        expect(filteredContext.availableParts).toMatchObject([
                {
                    set: {id: "set1"},
                    partType: PartType.head,
                    skills: [{level: 3, skill: {id: "skill1"}}]
                }
            ]
        )
    })
});

function searchAll(
    {leveledSkills, availableParts}: {
        leveledSkills: LeveledSkill[],
        availableParts: ArmorPart[],
    }): Promise<Build[]> {
    return search({leveledSkills}, {availableParts})
        .pipe(reduce((builds: Build[], build: Build) => [...builds, build], []))
        .toPromise()
}
