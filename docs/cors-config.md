# CORS Configuration for Spring Boot Backend

To fix the CORS error, you need to configure your Spring Boot backend to allow requests from your Next.js frontend.

## Method 1: Global CORS Configuration (Recommended)

Create a configuration class in your Spring Boot project:

```java
package com.createfuture.training.taskmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow your frontend origin
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://localhost:9002");
        configuration.addAllowedOrigin("http://localhost:3001");
        
        // Allow all HTTP methods
        configuration.addAllowedMethod("*");
        
        // Allow all headers
        configuration.addAllowedHeader("*");
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}
```

## Method 2: Controller-Level CORS

Add `@CrossOrigin` annotation to your controller:

```java
package com.createfuture.training.taskmanager.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9002", "http://localhost:3001"})
public class TaskRestController {
    // ... your existing controller code
}
```

## Method 3: Application Properties

Add CORS configuration to your `application.properties` or `application.yml`:

### application.properties:
```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:9002,http://localhost:3001
spring.web.cors.allowed-methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### application.yml:
```yaml
spring:
  web:
    cors:
      allowed-origins:
        - http://localhost:3000
        - http://localhost:9002
        - http://localhost:3001
      allowed-methods:
        - GET
        - POST
        - PUT
        - PATCH
        - DELETE
        - OPTIONS
      allowed-headers: "*"
      allow-credentials: true
```

## Recommended Approach

Use **Method 1 (Global CORS Configuration)** as it's the most flexible and maintainable approach. After adding the configuration:

1. Restart your Spring Boot application
2. Test the API endpoints from your frontend

## For Production

For production environments, replace `localhost` origins with your actual domain:

```java
configuration.addAllowedOrigin("https://yourdomain.com");
configuration.addAllowedOrigin("https://www.yourdomain.com");
```

## Troubleshooting

If you're still having issues:

1. Check that your Spring Boot application is running on `http://localhost:8080`
2. Verify the API endpoints are accessible directly via browser or Postman
3. Check browser developer tools Network tab for the actual request details
4. Ensure no additional security configurations are blocking CORS
