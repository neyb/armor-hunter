import {mergeWith, isArray} from "lodash"

export type ActionHandler<State, A extends Action<any, any>> = (state: State, payload: PayloadOf<A>) => State

type primitive = string | number | boolean | undefined | null
export type RecursivePartial<T> = T extends primitive ? T : RecursivePartialObject<T>
type RecursivePartialObject<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export const merge = <State>(state: State, other: RecursivePartial<State>) =>
  mergeWith({}, state, other, (_, src) => (isArray(src) ? src : undefined))

export function dux<State, Actions extends Action<any, any>>(
  reducables: {[type in TypeOf<Actions>]: ActionHandler<State, ActionTyped<Actions, type>>},
  initialState: State
): {
  actions: {[type in TypeOf<Actions>]: (payload: PayloadOf<ActionTyped<Actions, type>>) => ActionTyped<Actions, type>}
  reducer: (state: State, action: Actions) => State
  // reducer: (initialState: State) => (state: State, action: Actions) => State
} {
  // @ts-ignore
  const actions: {
    [type in TypeOf<Actions>]: (payload: PayloadOf<ActionTyped<Actions, type>>) => ActionTyped<Actions, type>
  } = Object.entries(reducables).reduce(
    (acc, [type, _]) => Object.assign(acc, {[type]: (payload: any) => ({type, payload})}),
    {}
  )

  const reducer = (state = initialState, action: Action<any, any>) => {
    // const reducer = (initialState: State) => (state = initialState, action: Action<any, any>) => {
    const actionHandler: ActionHandler<State, Actions> | undefined =
      // @ts-ignore
      reducables[action.type]
    return actionHandler !== undefined ? actionHandler(state, action.payload) : state
  }

  return {
    actions,
    reducer,
  }
}

type Action<Type extends string, Payload> = {type: Type; payload: Payload}
type PayloadOf<T extends Action<any, any>> = T extends Action<any, infer Payload> ? Payload : any
type TypeOf<T extends Action<any, any>> = T extends Action<infer Type, infer Payload> ? Type : any
type ActionTyped<A, T extends string> = A extends Action<T, infer P> ? Action<T, P> : never
