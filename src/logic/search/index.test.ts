import {startSearch} from "./index";
import {Build} from "/logic/search/types";
// import {Mock} from "jest"



describe("startSearch", () => {
    const worker = {
        postMessage: jest.fn(),
        onmessage: jest.fn()
        // as Mock<
        //     { data: { type: "end", data: undefined } | { type: "build-found", data: Build } }, void>
    };

    let origWorker;
    beforeAll(() => {
        origWorker = window.Worker;

        //@ts-ignore
        window.Worker = () => worker;
    });

    afterAll(() => {
        //@ts-ignore
        window.worker = origWorker;
    });


    test("without found builds", async () => {
        worker.postMessage.mockImplementation(() => {
            worker.onmessage({data: {type: "end"}});
        });
        const search = startSearch(undefined, undefined);

        return search.promise.then(builds => {
            expect(builds).toEqual([])
        })
    });

    test("with 5 found builds", async () => {
        worker.postMessage.mockImplementation(() => {
            worker.onmessage({data: {type: "build-found", data: {build:1}}});
            worker.onmessage({data: {type: "build-found", data: {build:2}}});
            worker.onmessage({data: {type: "build-found", data: {build:3}}});
            worker.onmessage({data: {type: "build-found", data: {build:4}}});
            worker.onmessage({data: {type: "build-found", data: {build:5}}});
            worker.onmessage({data: {type: "end"}});
        });
        let search = startSearch(undefined, undefined);
        return search.promise.then(builds => {
            expect(builds).toEqual([{build:1},
                {build:2},
                {build:3},
                {build:4},
                {build:5},
            ])
        })
    });

});