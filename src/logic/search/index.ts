import {Build, SearchContext, SearchRequest} from "./types";

interface Message {
    readonly type: string
}

export interface BuildFoundMessage extends Message {
    readonly type: string;
    readonly data: Build;
}

export class BuildFoundMessage implements Message {
    readonly type: string = "build-found";

    constructor(readonly data: Build) {
    }
}

function isBuildFoundMessage(message: Message): message is BuildFoundMessage {
    return message.type === "build-found"
}

function isEndMessage(message: Message): message is EndMessage {
    return message.type === "end"
}


export interface EndMessage extends Message {
}

export const endMessage: EndMessage = {type: "end"};

export function startSearch(request: SearchRequest,
                            context: SearchContext,
                            onNext: (Build) => void = () => undefined)
    : { promise: Promise<Array<Build>>, stop: () => void } {
    const worker = new Worker("./search-ws.ts");
    const builds: Array<Build> = [];

    const promise = new Promise<Build[]>((resolve, reject) => {
        worker.onmessage = ({data: message}: { data: Message }) => {
            if (isBuildFoundMessage(message)) {
                const build = message.data;
                builds.push(build);
                onNext(build);
            }

            if (isEndMessage(message)) {
                worker.terminate()
                resolve(builds);
            }
        };
        worker.onerror = reject
    });
    worker.postMessage({type: "start", data: {request, context}});

    return {promise, stop: () => worker.terminate()}
}