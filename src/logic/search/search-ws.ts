import {Build, SearchContext, SearchRequest} from "/logic/search/types";

onmessage = ({data: {type, data}}: { data: { type: "start", data: { request: SearchRequest, context: SearchContext } | undefined } }) => {
    switch (type) {
        case "start":
            search(data.request, data.context);
            break;
    }
};

function search(request: SearchRequest, context: SearchContext) {
    postMessage({type:"build-found", data:{} as Build})
    postMessage({type:"end"})
}