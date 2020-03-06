export const dux = <State, R extends Reducables<State>>(reducables: R, initialState: State) => ({
  actions: Object.entries(reducables).reduce(
    (acc, [type, _]) => Object.assign(acc, {[type]: (payload: any) => ({type, payload})}),
    {} as {[Type in keyof R & string]: (payload: PayloadOf<Type, R>) => DuxAction<Type, PayloadOf<Type, R>>}
  ),
  reducer: (state = initialState, action: ReduxAction) => {
    const actionHandler = reducables[action.type]
    return actionHandler !== undefined ? actionHandler(state, action.payload) : state
  },
})

type Reducables<State> = {[type in string]: (state: State, payload: any) => State}
type ReduxAction = {type: string; [props: string]: any}
type DuxAction<Type extends string, Payload> = {type: Type; payload: Payload}
type PayloadOf<Type extends keyof R & string, R extends Reducables<any>> = Parameters<R[Type]>[1]
