package com.shinesolutions.aemwebpack.services;

import java.util.Map;

public interface EnvironmentConfig {
    
    /**
     * Retrieves a property value defined against the configuration service by its 
     * property name.
     * 
     * @param propertyName {@link String}
     * @return {@link String}
     */
    String get(String propertyName);

    Map<String, String> getConfig();

    Map<String, String> getPublicConfig();

    /**
     * Get a list of public config that matches the given prefix,
     *
     * e.g. member.services.public.{prefix} => member.services.public.url.
     * @param prefix
     * @return
     */
    Map<String, String> getPublicConfig(String prefix);
}
