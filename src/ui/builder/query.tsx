import React, {ChangeEventHandler} from "react"
import {flow, isEqual, noop} from "lodash"
import {actions, LeveledSkillRow} from "/logic/builder/store"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "/logic/store"
import {Skill} from "/logic/data"

export function Query() {
  const allSkills = useSelector((state: RootState) => state.data.skills)
  const rows = useSelector((state: RootState) => state.builder.query.skills)
  const dispatch = useDispatch()
  const updateRow = flow(actions.updateRow, dispatch)
  const cleanRows = flow(noop, actions.cleanRows, dispatch)

  return (
    <div className="container">
      <Skills rows={rows} updateRow={updateRow} cleanRows={cleanRows} allSkills={allSkills} />
    </div>
  )
}

const sortSkills = (skills: Skill[]) => skills.sort((skill1, skill2) => skill1.id.localeCompare(skill2.id))

function Skills({
  rows,
  updateRow,
  cleanRows,
  allSkills,
}: {
  rows: LeveledSkillRow[]
  updateRow: (row: LeveledSkillRow) => void
  cleanRows: () => void
  allSkills: Skill[]
}) {
  const unusedSkills = sortSkills(allSkills.filter(skill => !rows.map(row => row.skill?.id).includes(skill.id)))
  const usableSkillsOf = (row: LeveledSkillRow) => {
    const selectedSkill = allSkills.find(skill => skill.id === row.skill?.id)
    return selectedSkill !== undefined ? sortSkills([...unusedSkills, selectedSkill]) : unusedSkills
  }

  return (
    <div>
      <div>skills:</div>
      <div>{JSON.stringify(rows)}</div>
      {rows.map(row => {
        return (
          <SelectLeveledSkill
            key={row.id}
            row={row}
            updateRow={updateRow}
            cleanRows={cleanRows}
            skills={usableSkillsOf(row)}
          />
        )
      })}
    </div>
  )
}

function SelectLeveledSkill({
  row,
  updateRow,
  skills,
  cleanRows,
}: {
  row: LeveledSkillRow
  updateRow: (skill: LeveledSkillRow) => void
  cleanRows: () => void
  skills: Skill[]
}) {
  const selectedSkill = skills.find(s => s.id === row.skill?.id) || null

  const selectableSkills = [
    {key: -1, label: "aucun", value: null},
    ...skills.map(s => ({key: s.id, label: s.id, value: s})),
  ]
  const selectableLevels = [...new Array(selectedSkill?.maxLevel || 0).keys()]
    .map(nb => nb + 1)
    .map(level => ({key: level, label: level.toString(), value: level}))

  return (
    <div className="row">
      <Select
        selected={selectedSkill}
        options={selectableSkills}
        onChange={(newSelectedSkill: Skill | null) =>
          updateRow({id: row.id, skill: newSelectedSkill && {id: newSelectedSkill.id, level: 1}})
        }
        onBlur={cleanRows}
      />
      {selectedSkill != null && selectedSkill.maxLevel > 1 && (
        <Select
          selected={row.skill?.level || 1}
          options={selectableLevels}
          onChange={level => updateRow({id: row.id, skill: row.skill && {id: row.skill.id, level}})}
        />
      )}
    </div>
  )
}

function Select<Value>({
  selected,
  options,
  onChange = () => undefined,
  enable = true,
  onBlur = () => undefined,
}: {
  selected: Value
  options: {key: string | number; value: Value; label: string}[]
  enable?: boolean
  onChange?: (value: Value) => void
  onBlur?: () => void
}) {
  const selectedIndex = options.findIndex(opt => isEqual(opt.value, selected))

  const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const selectedValue = options[Number(e.target.value)]
    onChange(selectedValue.value)
  }

  return (
    <select onChange={handleChange} disabled={!enable} defaultValue={selectedIndex} onBlur={onBlur}>
      {options.map(({key, label, value}, index) => (
        <option key={key} value={index}>
          {label}
        </option>
      ))}
    </select>
  )
}
