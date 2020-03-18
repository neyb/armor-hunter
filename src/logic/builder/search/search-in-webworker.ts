import {SearchRequest} from "/logic/builder/search/SearchRequest"
import {Subscription} from "rxjs"
import {SearchRequest as SearchRequestData, SearchContext as SearchContextData} from "./data"
import {search} from "./search"
import {BuildFoundMessage, endMessage} from "./index"
import {SearchContext} from "./searchContext"

let messagePosterBuildSubscription: Subscription

onmessage = ({
  data: {
    type,
    data: {request, context},
  },
}: {
  data: {type: "start" | "stop"; data: {request: SearchRequestData; context: SearchContextData}}
}) => {
  switch (type) {
    case "start":
      messagePosterBuildSubscription = search(SearchRequest.ofData(request), SearchContext.ofData(context)).subscribe({
        next: build => postMessage(new BuildFoundMessage(build)),
        complete: () => postMessage(endMessage),
      })
      break
    case "stop":
      messagePosterBuildSubscription.unsubscribe()
      break
  }
}
