import {Build, SearchContext, SearchRequest} from "/logic/search/types";

export function startSearch(request: SearchRequest,
                            context: SearchContext,
                            onNext: (Build) => void = () => undefined): { promise: Promise<Array<Build>>, stop: () => void } {
    const worker = new Worker("./search-ws.ts");
    const builds: Array<Build> = [];

    const promise = new Promise((resolve, reject) => {
        worker.onmessage = ({data: {type, data}}: { data: { type: "build-found" | "end", data: Build | undefined } }) => {
            switch (type) {
                case "build-found":
                    let build = data as Build;
                    builds.push(build);
                    onNext(build);
                    break;
                case "end":
                    resolve(builds);
                    break;
            }
        };
        worker.onerror = event => reject(event)
    });
    worker.postMessage({type: "start", data: {request, context}});

    return {promise, stop: () => worker.terminate()}
}