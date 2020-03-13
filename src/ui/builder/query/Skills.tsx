import React, {ChangeEvent, ChangeEventHandler} from "react"
import {isEqual} from "lodash"
import {Skill} from "/logic/data"
import {LeveledSkillRow} from "/logic/builder/store"

const sortSkills = (skills: Skill[]) => skills.sort((skill1, skill2) => skill1.id.localeCompare(skill2.id))

export function Skills({
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
  const handleChangeSkill = (newSelectedSkill: Skill | null) =>
    updateRow({id: row.id, skill: newSelectedSkill && {id: newSelectedSkill.id, level: 1}})

  const handleChangeLevel = (level: number) => updateRow({id: row.id, skill: row.skill && {id: row.skill.id, level}})

  return (
    <div className="row">
      <Select selected={selectedSkill} options={selectableSkills} onChange={handleChangeSkill} onBlur={cleanRows} />
      {selectedSkill != null && selectedSkill.maxLevel > 1 && (
        <Range
          value={row.skill?.level || 1}
          start={1}
          end={selectedSkill?.maxLevel || 0}
          onChange={handleChangeLevel}
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

function Range({
  value,
  start,
  end,
  onChange = () => undefined,
}: {
  value: number
  start: number
  end: number
  onChange?: (value: number) => void
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))
  return <input type="range" onChange={handleChange} min={start} max={end} value={value} />
}
