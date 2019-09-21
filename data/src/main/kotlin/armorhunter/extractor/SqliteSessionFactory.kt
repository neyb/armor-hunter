package armorhunter.extractor

import org.apache.ibatis.mapping.Environment
import org.apache.ibatis.session.AutoMappingBehavior
import org.apache.ibatis.session.Configuration
import org.apache.ibatis.session.SqlSession
import org.apache.ibatis.session.SqlSessionFactoryBuilder
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory
import org.sqlite.SQLiteConfig
import org.sqlite.SQLiteDataSource
import java.nio.file.Path

class SqliteSessionFactory(private val dbFile: String) {

    private val sessionFactory by lazy {
        SqlSessionFactoryBuilder().build(Configuration().apply {
            variables.setProperty("org.apache.ibatis.parsing.PropertyParser.enable-default-value", "true")
            environment = Environment(
                "local",
                JdbcTransactionFactory(),
                SQLiteDataSource(
                    SQLiteConfig().apply {
                    }
                ).apply { this.url = getConnectionUrl(dbFile) }
            )
            mapperRegistry.addMappers("armorhunter.extractor.db")
            autoMappingBehavior = AutoMappingBehavior.FULL
            isMapUnderscoreToCamelCase = true
//            org.apache.ibatis.parsing.PropertyParser.enable-default-value
        })
    }

    private fun getConnectionUrl(path: String) = "jdbc:sqlite:${Path.of(path).toAbsolutePath()}"

    fun open(block: (SqlSession) -> Unit) = sessionFactory.openSession().use(block)
}