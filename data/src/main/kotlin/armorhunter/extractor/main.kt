package armorhunter.extractor

import kotlinx.serialization.Serializable
import kotlinx.serialization.internal.HashMapSerializer
import kotlinx.serialization.internal.StringSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration

fun main(vararg args: String) {
    if(args.size < 1) {
        System.err.println("need file db path as first argument")
        System.exit(1)
    }
    val sessionFactory = SqliteSessionFactory(args[0])
    val json = Json(JsonConfiguration.Stable)

    sessionFactory.open { session ->
        val setsByName = ArmorSets(session).all()
            .sortedBy { it.order }
            .associateBy({ it.name }, ArmorSet::json)
        println(json.stringify(HashMapSerializer(StringSerializer, ArmorSetJson.serializer()), setsByName))
    }
}