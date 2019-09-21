package armorhunter.extractor

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Condition
import org.junit.jupiter.api.Test
import java.util.function.Predicate

class ArmorSetsTest {
    @Test fun `there are 10+ armorsets`() = withArmorSets {
        assertThat(all()).hasSizeGreaterThan(10)
    }

    @Test fun `Nergigante α is in the list`() = withArmorSet("Nergigante α") {}

    @Test fun `Nergigante α has 5 parts`() = withArmorSet("Nergigante α") {
        assertThat(parts.head).isNotNull
        assertThat(parts.chest).isNotNull
        assertThat(parts.arms).isNotNull
        assertThat(parts.waist).isNotNull
        assertThat(parts.legs).isNotNull
    }

    @Test fun `Nergigante α has rarity 8`() = withArmorSet("Nergigante α") {
        assertThat(rarity).isEqualTo(8)
    }

    @Test fun `Nergigante α has right defenses`() = withArmorSet("Nergigante α") {
        assertThat(defenses.physical.base).isEqualTo(64)
        assertThat(defenses.physical.max).isEqualTo(70)
        assertThat(defenses.physical.augmented).isEqualTo(84)
        assertThat(defenses.fire).isEqualTo(1)
        assertThat(defenses.water).isEqualTo(1)
        assertThat(defenses.thunder).isEqualTo(-3)
        assertThat(defenses.ice).isEqualTo(1)
        assertThat(defenses.dragon).isEqualTo(-3)
    }

    @Test fun `Nergigante α head should have 1 small slot`() = withArmorSet("Nergigante α") {
        assertThat(parts.head!!.slots).containsExactlyInAnyOrder(Slot.small)
    }

    @Test fun `Nergigante α head should have right skills`() = withArmorSet("Nergigante α") {
        assertThat(parts.head!!.skills).containsExactly(LeveledSkill(Skill("Attack Boost"), 1),
                                                        LeveledSkill(Skill("Maximum Might"), 2))
    }

    @Test fun `Nergigante α set should have order 129`() = withArmorSet("Nergigante α"){
        assertThat(order).isEqualTo(129)
    }

    @Test fun `Nergigante α set should give Nergigante Hunger at 3 parts`() = withArmorSet("Nergigante α") {
        assertThat(this.skillSets).containsExactly(SkillSet(Skill("Hasten Recovery"), 3))
    }

    fun withArmorSets(block: ArmorSets.() -> Unit) =
        SqliteSessionFactory("mhw.db").open { ArmorSets(it).apply(block) }

    fun withArmorSet(name: String, block: ArmorSet.() -> Unit) =
        withArmorSets {
            val armorsets = all()
            assertThat(armorsets).has(Condition(Predicate { it.any { it.name == name } }, "has name $name"))
            armorsets.first { it.name == name }.apply(block)
        }
}