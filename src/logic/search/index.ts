import {Build, SearchContext, SearchRequest} from "./types"
import {Observable} from "rxjs"
import {finalize} from "rxjs/operators"

export interface Message {
  readonly type: string
}

export class BuildFoundMessage implements Message {
  readonly type: string = "build-found"

  constructor(readonly build: Build) {}

  static is(message: Message): message is BuildFoundMessage {
    return message.type === "build-found"
  }
}

export class EndMessage implements Message {
  readonly type = "end"

  static is(message: Message): message is EndMessage {
    return message.type === "end"
  }
}

export const endMessage = new EndMessage()

export function startSearch(request: SearchRequest, context: SearchContext): Observable<Build> {
  let worker: Worker
  return new Observable<Build>(subscriber => {
    worker = new Worker("./search-in-webworker.ts")
    worker.onmessage = ({data: message}) => {
      if (BuildFoundMessage.is(message)) subscriber.next(message.build)
      if (EndMessage.is(message)) subscriber.complete()
    }
    worker.onerror = ({message}) => subscriber.error(new Error(message))
    worker.postMessage({type: "start", data: {request, context}})
  }).pipe(finalize(() => worker.terminate()))
}
