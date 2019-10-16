import {Build, SearchContext, SearchRequest} from "./types";
import {Observable, Subscriber} from "rxjs";
import {reduce} from "rxjs/operators";

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

export class EndMessage implements Message {
    readonly type = "end";

    static is(message: Message): message is EndMessage {
        return message.type === "end"
    }
}

export const endMessage = new EndMessage();

const receiveMessages = (subscriber: Subscriber<Build>) => (message: Message) => {
    if (BuildFoundMessage.is(message)) subscriber.next(message.build);
    if (EndMessage.is(message)) subscriber.complete();
};

export function startSearch(request: SearchRequest, context: SearchContext)
    : { observableBuilds: Observable<Build>, builds: Promise<Build[]>, stop: () => void } {
    const worker = new Worker("./search-in-webworker.ts");

    const observableBuilds: Observable<Build> = new Observable(subscriber => {
        const messageReceiver = receiveMessages(subscriber);
        worker.onmessage = ({data:message}) => messageReceiver(message);
        worker.onerror = ({message}) => subscriber.error(new Error(message));
    });

    const stopWorkerSubscription = observableBuilds.subscribe({error: worker.terminate, complete: worker.terminate});

    const promise = observableBuilds
        .pipe(reduce((acc, build) => [...acc, build], [] as Build[]))
        .toPromise();

    worker.postMessage({type: "start", data: {request, context}});

    return {
        observableBuilds,
        builds: promise,
        stop: () => {
            worker.terminate();
            stopWorkerSubscription.unsubscribe();
        }
    }
}