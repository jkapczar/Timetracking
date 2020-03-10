package core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@SpringBootApplication
@EnableEurekaClient
@EnableNeo4jRepositories
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(core.Application.class, args);
    }
}
