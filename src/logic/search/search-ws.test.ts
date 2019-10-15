import {search, _} from "./search-ws";
import {MessageReceiver} from "./index";
import {Build, PartType} from "./types";
import {LeveledSkill} from "./leveledSkill";
import {ArmorPart} from "./armorPart";

window.onmessage = null;
describe("search", () => {
    const postMessage = jest.fn();

    beforeAll(() => {
        postMessage.mockReset();
    });

    const testFoundArmour = ({leveledSkills, availableParts, expectedBuilds}: {
        leveledSkills: LeveledSkill[],
        availableParts: ArmorPart[],
        expectedBuilds: Build[]
    }) => () => {
        const receiver = new MessageReceiver({
            onNext: _ => null,
            onError: () => {
                throw new Error()
            },
            onEnd: builds => expect(builds).toEqual(expectedBuilds),
            onFinally: () => null
        });
        search({leveledSkills}, {availableParts}, m => receiver.receiveMessage(m));

        // const messages: Message[] = expectedBuilds.map(b => new BuildFoundMessage(b));
        // messages.push(endMessage);
        // expect(postMessage.mock.calls).toEqual(messages.map(m => [m]))

    }

    test("impossible build returns no build", testFoundArmour({
        leveledSkills: [{skill: {id: "skill"}, level: 1}],
        availableParts: [],
        expectedBuilds: []
    }));

    test("with only 1 part works as expected", testFoundArmour({
        leveledSkills: [{skill: {id: "skill"}, level: 1}],
        availableParts: [
            ArmorPart.from({set: {id: "set1"}, partType: PartType.head, skills: [{skill: {id: "skill"}, level: 1}]})
        ],
        expectedBuilds: [
            {
                head: ArmorPart.from({
                    set: {id: "set1"},
                    partType: PartType.head,
                    skills: [{skill: {id: "skill"}, level: 1}]
                })
            }
        ]
    }));
});

describe("filter", () => {
    const filter = _.filter;
    test("same part but one with 1 skill higher level than the other should", () => {
        const filteredContext = filter({
                leveledSkills: [
                    {level: 3, skill: {id: "skill 1"}}
                ]
            },
            {
                availableParts: [
                    ArmorPart.from({
                        partType: PartType.head,
                        set: {id: "set1"},
                        skills: [
                            {level: 3, skill: {id: "skill 1"}}
                        ]
                    }),
                    ArmorPart.from({
                        partType: PartType.head,
                        set: {id: "set2"},
                        skills: [
                            {level: 2, skill: {id: "skill 1"}}
                        ]
                    }),
                ]
            });

        expect(filteredContext.availableParts).toEqual([
                ArmorPart.from({
                    partType: PartType.head,
                    set: {id: "set1"},
                    skills: [
                        {level: 3, skill: {id: "skill 1"}}
                    ]
                }),
            ]
        )
    })
});