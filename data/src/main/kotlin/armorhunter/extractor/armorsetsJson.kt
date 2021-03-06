package armorhunter.extractor

import kotlinx.serialization.Serializable

fun ArmorSet.json() = with(parts) {
    ArmorSetJson(rarity,
                 head?.json(),
                 chest?.json(),
                 arms?.json(),
                 waist?.json(),
                 legs?.json(),
                 with(defenses) {
                     DefensesJson(with(physical) { PhysicalDefenseJson(base, max, augmented) },
                                  fire, water, thunder, ice, dragon)
                 },
                skillSets.associate { it.skill.name to it.nbParts }
    )
}

private fun Armor.json() = ArmorJson(slots.map { it.size }, skills.associateBy({ it.skill.name }, { it.level }))

@Serializable data class ArmorSetJson(val rarity: Int,
                                      val head: ArmorJson?,
                                      val chest: ArmorJson?,
                                      val arms: ArmorJson?,
                                      val waist: ArmorJson?,
                                      val legs: ArmorJson?,
                                      val defenses: DefensesJson,
                                      val setSkill: Map<String, Int>)

@Serializable data class DefensesJson(val physical: PhysicalDefenseJson,
                                      val fire: Int,
                                      val water: Int,
                                      val thunder: Int,
                                      val ice: Int,
                                      val dragon: Int)

@Serializable data class PhysicalDefenseJson(val base: Int, val max: Int, val augmented: Int)

@Serializable data class ArmorJson(val slots: List<Int>, val skills: Map<String, Int>)