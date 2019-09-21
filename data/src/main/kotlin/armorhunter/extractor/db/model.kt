package armorhunter.extractor.db

class ArmorSet {
    var id: Int? = null
    var name: String? = null
    var armors:List<Armor> = mutableListOf()
    var setSkills:List<SetSkill> = mutableListOf()
}

class Armor {
    var armorType: ArmorType? = null
    var rarity: Int? = null
    var skills:List<ArmorSkill> = mutableListOf()
    var slot1: Int? = null
    var slot2: Int? = null
    var slot3: Int? = null
    var defenseBase: Int? = null
    var defenseMax: Int? = null
    var defenseAugmentMax: Int? = null
    var fire: Int? = null
    var water: Int? = null
    var thunder: Int? = null
    var ice: Int? = null
    var dragon: Int? = null
}

class ArmorSkill {
    var level: Int? = null
    var skillName: String? = null
}

class SetSkill {
    var required: Int? = null
    var name: String? = null
}

@Suppress("unused")
enum class ArmorType { head, chest, arms, waist, legs }

class Charm {
    var id: Int? = null
    var order_id: Int? = null
    var previous_id: Int? = null
    var rarity: Int? = null
}

class CharmSkill {
    var charmId: Int? = null
    var skilltreeId: Int? = null
    var level: Int? = null
}

class CharmText {
    var id: Int? = null
    var lang_id: String? = null
    var name: String? = null
    var description: String? = null
}

class Decoration {
    var id: Int? = null
    var rarity: Int? = null
    var skilltreeId: Int? = null
    var slot: Int? = null
    var iconColor: String? = null
    var mysteriousFeystonePercent: Double? = null
    var glowingFeystonePercent: Double? = null
    var wornFeystonePercent: Double? = null
    var warpedFeystonePercent: Double? = null
}

class DecorationText {
    var id: Int? = null
    var langId: String? = null
    var name: String? = null
}

class Language {
    var id: String? = null
    var name: String? = null
}

class Skill {
    var skilltreeId: Int? = null
    var name: String? = null
    var langId: String? = null
    var level: Int? = null
    var description: String? = null
}

class Skilltree {
    var id: Int? = null
    var maxLevel: Int? = null
    var iconColor: String? = null
}

class SkilltreeText {
    var id: Int? = null
    var langId: String? = null
    var name: String? = null
    var description: String? = null
}
