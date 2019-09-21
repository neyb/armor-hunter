import {startSearch} from "./index";

describe("search", async () => {
    test("impossible build returns no build", async () => {
        let search = startSearch(
            {leveledSkills: [{skill: {id: "skill"}, level: 1}]},
            {availableParts: []});
        return search.promise.then(builds => {
            expect(builds).toEqual([])
        })
    });

    test("with only one part returns it", async () => {
        let search = startSearch(
            {leveledSkills: [{skill: {id: "skill"}, level: 1}]},
            {availableParts: [{skills: [{skill: {id: "skill"}, level: 1}]}]});
        return search.promise.then(builds => {

        })
    });

});