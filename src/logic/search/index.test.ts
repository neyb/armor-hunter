import {BuildFoundMessage, endMessage, startSearch} from "./index";
import {Build} from "/logic/search/types";

describe("startSearch", () => {
    const worker = {
        postMessage: jest.fn(),
        onmessage: jest.fn(),
        // as Mock<
        //     { data: { type: "end", data: undefined } | { type: "build-found", data: Build } }, void>
        terminate: jest.fn()
    };

    const testSimulatingWorker = (...builds: Build[]) => async () => {
        simulateCalc(...builds);
        const search = startSearch(
            {leveledSkills: []},
            {availableParts: []});
        return search.promise.then(expect(builds).toEqual)
    };

    test("without found builds", testSimulatingWorker());

    test("with 5 found builds", testSimulatingWorker(
        {build: 1},
        {build: 2},
        {build: 3},
        {build: 4},
        {build: 5},
    ));

    let origWorker: any;
    beforeAll(() => {
        origWorker = window.Worker;
        //@ts-ignore
        window.Worker = () => worker;
    });

    afterAll(() => {
        //@ts-ignore
        window.worker = origWorker;
    });

    function simulateCalc(...builds: Build[]) {
        worker.postMessage.mockImplementation(() => {
            builds.forEach(build => worker.onmessage({data: new BuildFoundMessage(build)}));
            worker.onmessage({data: endMessage});
        });
    }
});