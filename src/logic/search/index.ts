import {Build, SearchContext, SearchRequest} from "./types";

interface Observer {
    readonly onNext: (build: Build) => void
    readonly onEnd: (Build: Build[]) => void
    readonly onError: () => void
    readonly onFinally: () => void
}

export class MessageReceiver {
    private readonly builds: Build[] = [];

    constructor(private readonly observer: Observer) {
    }

    receiveMessage(message: Message) {
        if (BuildFoundMessage.is(message)) {
            this.builds.push(message.build);
            this.observer.onNext(message.build);
        }
        if (EndMessage.is(message)) {
            this.observer.onEnd(this.builds);
            this.observer.onFinally();
        }
    }

    onError() {
        this.observer.onError();
        this.observer.onFinally();
    }
}

export interface Message {
    readonly type: string
}

export class BuildFoundMessage implements Message {
    readonly type: string = "build-found";

    constructor(readonly build: Build) {
    }

    static is(message: Message): message is BuildFoundMessage {
        return message.type === "build-found"
    }
}

class EndMessage implements Message {
    readonly type = "end";

    static is(message: Message): message is EndMessage {
        return message.type === "end"
    }
}

export const endMessage = new EndMessage();

export function startSearch(request: SearchRequest,
                            context: SearchContext,
                            onNext: (build: Build) => void = () => undefined)
    : { promise: Promise<Array<Build>>, stop: () => void } {
    const worker = new Worker("./search-ws.ts");

    const promise = new Promise<Build[]>((resolve, reject) => {
        const receiver = new MessageReceiver({
            onNext,
            onEnd: resolve,
            onError: reject,
            onFinally: () => worker.terminate()
        });

        worker.onmessage = m => receiver.receiveMessage(m.data);
        worker.onerror = _ => receiver.onError();
    });
    worker.postMessage({type: "start", data: {request, context}});

    return {promise, stop: () => worker.terminate()}
}