import {Subscription} from "rxjs"
import {SearchRequest, SearchContext as SearchContextData} from "./data"
import {search} from "./search"
import {BuildFoundMessage, endMessage} from "."
import {SearchContext} from "./searchContext"

let messagePosterBuildSubscription: Subscription

onmessage = ({
  data: {
    type,
    data: {request, context},
  },
}: {
  data: {type: "start" | "stop"; data: {request: SearchRequest; context: SearchContextData}}
}) => {
  switch (type) {
    case "start":
      messagePosterBuildSubscription = search(request, SearchContext.ofData(context)).subscribe({
        next: build => postMessage(new BuildFoundMessage(build)),
        complete: () => postMessage(endMessage),
      })
      break
    case "stop":
      messagePosterBuildSubscription.unsubscribe()
      break
  }
}
