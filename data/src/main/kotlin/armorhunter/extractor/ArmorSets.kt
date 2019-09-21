package armorhunter.extractor

import armorhunter.extractor.db.ArmorSetDao
import armorhunter.extractor.db.SetSkill
import org.apache.ibatis.session.SqlSession

import armorhunter.extractor.db.Armor as ArmorDb

class ArmorSets(session: SqlSession) {
    private val dao = session.getMapper(ArmorSetDao::class.java)

    fun all(): List<ArmorSet> {
        return dao.all().map {
            ArmorSet(it.id!!,
                     it.name!!,
                     it.armors.map { it.rarity!! }.distinct().single(),
                     it.armors.toParts(),
                     it.armors.toDefenses(),
                     it.setSkills.map { SkillSet(Skill(it.name!!), it.required!!) })
        }
    }

    private fun List<ArmorDb>.toParts() = SetParts(map { armorDb ->
        Armor(ArmorPart.valueOf(armorDb.armorType!!.name),
              sequence {
                  repeat(armorDb.slot1!!) { yield(Slot.small) }
                  repeat(armorDb.slot2!!) { yield(Slot.medium) }
                  repeat(armorDb.slot3!!) { yield(Slot.large) }
              }.toList(),
              armorDb.skills.map { armorSkillDb -> LeveledSkill(Skill(armorSkillDb.skillName!!), armorSkillDb.level!!) }
        )
    })

    private fun List<ArmorDb>.toDefenses() =
        map {
            with(it) {
                Defenses(
                    PhysicalDefense(defenseBase!!, defenseMax!!, defenseAugmentMax!!),
                    fire!!, water!!, thunder!!, ice!!, dragon!!)
            }
        }.distinct().single()
}

data class ArmorSet(val order: Int,
                    val name: String,
                    val rarity: Int,
                    val parts: SetParts,
                    val defenses: Defenses,
                    val skillSets: List<SkillSet>)

data class SkillSet(val skill: Skill,
                    val nbParts: Int)

data class SetParts(val head: Armor?,
                    val chest: Armor?,
                    val arms: Armor?,
                    val waist: Armor?,
                    val legs: Armor?) {
    constructor(armors: Iterable<Armor>) : this(
        head = armors.firstOrNull { it.part == ArmorPart.head },
        chest = armors.firstOrNull { it.part == ArmorPart.chest },
        arms = armors.firstOrNull { it.part == ArmorPart.arms },
        waist = armors.firstOrNull { it.part == ArmorPart.waist },
        legs = armors.firstOrNull { it.part == ArmorPart.legs })
}

data class Defenses(val physical: PhysicalDefense,
                    val fire: Int,
                    val water: Int,
                    val thunder: Int,
                    val ice: Int,
                    val dragon: Int)

data class PhysicalDefense(val base: Int, val max: Int, val augmented: Int)

data class Armor(val part: ArmorPart,
                 val slots: List<Slot>,
                 val skills: List<LeveledSkill>) {
}

data class LeveledSkill(val skill: Skill,
                        val level: Int)

data class Skill(val name: String)

enum class Slot(val size: Int) { small(1), medium(2), large(3), veryLarge(4) }

enum class ArmorPart {
    head, chest, arms, waist, legs
}