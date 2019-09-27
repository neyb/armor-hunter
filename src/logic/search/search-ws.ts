import {Build, SearchContext, SearchRequest} from "/logic/search/types";

onmessage = null;
onmessage = ({data: {type, data}}
                 : { data: { type: "start", data: { request: SearchRequest, context: SearchContext } | undefined } }) => {
    switch (type) {
        case "start":
            search(data.request, data.context, postMessage);
            break;
    }
};

export function search(request: SearchRequest, context: SearchContext, postMessage) {
    postMessage({type: "end"})
}