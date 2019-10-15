import {Build, SearchContext, SearchRequest} from "./types";
import {Observable, Subscriber} from "rxjs";
import {reduce} from "rxjs/operators";
import {BuildFoundMessage, EndMessage, Message} from "./messages";

const receiveMessages = (subscriber: Subscriber<Build>) => (message: Message) => {
    if (BuildFoundMessage.is(message)) {
        subscriber.next(message.build)
    }
    if (EndMessage.is(message)) {
        subscriber.complete()
    }
};

export function startSearch(request: SearchRequest, context: SearchContext)
    : { observableBuilds: Observable<Build>, builds: Promise<Build[]>, stop: () => void } {
    const worker = new Worker("./search.ts");

    const observableBuilds: Observable<Build> = new Observable(subscriber => {
        const messageReceiver = receiveMessages(subscriber);
        worker.onmessage = m => messageReceiver(m.data);
        worker.onerror = ({message}) => subscriber.error(new Error(message));
    });

    const stopWorkerSubscription = observableBuilds.subscribe({error: worker.terminate, complete: worker.terminate});

    const promise = observableBuilds
        .pipe(reduce((acc, build) => [...acc, build], [] as Build[]))
        .toPromise();

    worker.postMessage({type: "start", data: {request, context}});

    return {
        observableBuilds,
        builds:promise,
        stop: () => {
            worker.terminate();
            stopWorkerSubscription.unsubscribe();
        }
    }
}