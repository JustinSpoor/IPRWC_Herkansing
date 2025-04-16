package nl.kingdom.fenrin.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://spoorjustin.nl")
                .allowedMethods("GET", "DELETE", "POST", "PUT", "PATCH",  "OPTIONS")
                .allowedHeaders("Content-Type", "Authorization", "X-Requested-With", "Accept");

        registry.addMapping("/images/**")
                .allowedOrigins("https://spoorjustin.nl")
                .allowedMethods("GET")
                .allowedHeaders("Content-Type", "Authorization", "X-Requested-With", "Accept");
    }
}