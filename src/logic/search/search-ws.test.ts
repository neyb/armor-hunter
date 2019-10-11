import {search} from "./search-ws";
import {MessageReceiver} from "/logic/search/index";
import {Build, LeveledSkill} from "/logic/search/types";
import {ArmorPart, PartType} from "/logic/conf";

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