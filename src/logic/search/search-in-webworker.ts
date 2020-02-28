import {Subscription} from "rxjs"
import {SearchRequest} from "./types"
import {search} from "./search"
import {BuildFoundMessage, endMessage} from "."
import {SearchContext} from "/logic/search/searchContext"

let messagePosterBuildSubscription: Subscription
onmessage = ({
  data: {type, data},
}: {
  data: {type: "start" | "stop"; data: {request: SearchRequest; context: SearchContext}}
}) => {
  switch (type) {
    case "start":
      messagePosterBuildSubscription = search(data.request, data.context).subscribe({
        next: build => postMessage(new BuildFoundMessage(build)),
        complete: () => postMessage(endMessage),
      })
      break
    case "stop":
      messagePosterBuildSubscription.unsubscribe()
      break
  }
}
