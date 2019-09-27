import {search} from "/logic/search/search-ws";

describe("search", () => {


    const postMessage = jest.fn();

    beforeAll(() => {
        postMessage.mockReset();
    });

    test("impossible build returns no build", async () => {
        search(
            {leveledSkills: [{skill: {id: "skill"}, level: 1}]},
            {availableParts: []},
            postMessage);

        expect(postMessage.mock.calls[0]).toEqual([{type: "end"}])
    });

    // test("with only one part returns it", async () => {
    //     search(
    //         {leveledSkills: [{skill: {id: "skill"}, level: 1}]},
    //         {availableParts: [{skills: [{skill: {id: "skill"}, level: 1}]}]},
    //         postMessage);
    //
    //     expect(postMessage.mock.calls[0]).toEqual([
    //         {type: "build-found", data: {build:1}},
    //         {type: "end"},
    //     ])
    // });

});