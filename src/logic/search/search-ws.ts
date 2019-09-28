import {Build, SearchContext, SearchRequest} from "/logic/search/types";
import {endMessage} from "/logic/search/index";

// onmessage = null;
if (typeof window === "undefined")
    onmessage = ({data: {type, data}}
                     : { data: { type: "start", data: { request: SearchRequest, context: SearchContext } } }) => {
        switch (type) {
            case "start":
                search(data.request, data.context, postMessage);
                break;
        }
    };

export function search(request: SearchRequest, context: SearchContext, postMessage: (message:any) => void) {
    postMessage(endMessage)
}