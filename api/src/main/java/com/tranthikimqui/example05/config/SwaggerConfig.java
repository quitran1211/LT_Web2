package com.tranthikimqui.example05.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI eCommerceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce Application")
                        .description("Backend REST APIs for the E-Commerce application")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Trần Nam")
                                .url("https://hitu.edu.vn")
                                .email("trannam@hitu.edu.vn"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("E-Commerce App API Documentation")
                        .url("http://localhost:8080/swagger-ui/index.html"));
    }
}
