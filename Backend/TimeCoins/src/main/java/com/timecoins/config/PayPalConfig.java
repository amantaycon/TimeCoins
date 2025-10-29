package com.timecoins.config;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@EnableConfigurationProperties(PayPalProperties.class)
@RequiredArgsConstructor
@Configuration
public class PayPalConfig {

    private final PayPalProperties properties;

    @Bean
    PayPalHttpClient payPalHttpClient() {
        PayPalEnvironment environment;

        if ("live".equalsIgnoreCase(properties.getMode())) {
            environment = new PayPalEnvironment.Live(properties.getClientId(), properties.getClientSecret());
        } else {
            environment = new PayPalEnvironment.Sandbox(properties.getClientId(), properties.getClientSecret());
        }
        return new PayPalHttpClient(environment);
    }
}
