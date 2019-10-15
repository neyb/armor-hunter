import {Build} from "logic/search/types";

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