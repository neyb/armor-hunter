import React from "react"
import {flow, noop} from "lodash"
import {actions} from "/logic/builder/store"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "/logic/store"
import {Skills} from "./Skills"
import {SearchButton} from "./SearchButton"

export function Query() {
  const allSkills = useSelector((state: RootState) => state.data.skills)
  const rows = useSelector((state: RootState) => state.builder.query.skills)
  const dispatch = useDispatch()
  const updateRow = flow(actions.updateRow, dispatch)
  const cleanRows = flow(noop, actions.cleanRows, dispatch)

  return (
    <div className="container">
      <Skills rows={rows} updateRow={updateRow} cleanRows={cleanRows} allSkills={allSkills} />
      <SearchButton />
    </div>
  )
}
