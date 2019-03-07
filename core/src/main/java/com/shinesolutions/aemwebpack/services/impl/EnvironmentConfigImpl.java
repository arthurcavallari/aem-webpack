package com.shinesolutions.aemwebpack.services.impl;

import com.shinesolutions.aemwebpack.services.EnvironmentConfig;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Dictionary;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for retrieving specific environment variables.
 * This service will fetch properties defined in the service configuration file
 * starting with the provided property name. If the property is not found,
 * the service will attempt to fetch the property with it's "shinesolutions." prefix attached.
 *
 * This service has a corresponding JSP tag that can be used to query it.
 * <ms:config prop="namespace.myprop"/>
 *
 * To add new properties, edit the service config file under /apps/aemwebpack/config.
 */
@Component(immediate = true, metatype = true, name = EnvironmentConfigImpl.PID,
    label = "Shine Solutions Environment Config",
    description = "Shine Solutions Environment Config")
@Service(EnvironmentConfig.class)
@Properties({
    @Property(name = org.osgi.framework.Constants.SERVICE_VENDOR, value = "Shine Solutions"),
    @Property(name = org.osgi.framework.Constants.SERVICE_DESCRIPTION, value = ""),
    @Property(name = org.osgi.framework.Constants.SERVICE_PID, value = EnvironmentConfigImpl.PID)
})
public class EnvironmentConfigImpl implements EnvironmentConfig {

    public static final String PID = "com.shinesolutions.aemwebpack.services.impl.EnvironmentConfigImpl";
    private static final Logger LOG = LoggerFactory.getLogger(EnvironmentConfigImpl.class);
    private static final String CONFIG_PREFIX = "shinesolutions.";
    private static final String PUBLIC_CONFIG_PREFIX = "shinesolutions.public.";
    private Map<String, String> config;

    @Activate
    public void activate(ComponentContext ctx) {
        LOG.info("Started EnvironmentConfig service");

        config = new HashMap<String, String>();
        Dictionary<?, ?> properties = ctx.getProperties();
        Enumeration keysEnum = properties.keys();

        while (keysEnum.hasMoreElements()) {
            String key = (String) keysEnum.nextElement();
            String value = PropertiesUtil.toString(properties.get(key), "");
            config.put(key, value);
            LOG.info("Adding property '" + key + "' with value " + value);
        }
    }

    @Override
    public String get(String propertyName) {
        if (config.containsKey(propertyName)) {
            return config.get(propertyName);
        } else if (config.containsKey(CONFIG_PREFIX + propertyName)) {
            return config.get(CONFIG_PREFIX + propertyName);
        } else {
            LOG.error("Property not found " + propertyName);
            return null;
        }
    }

    @Override
    public Map<String, String> getConfig() {
        return config.entrySet()
            .stream()
            .filter(map -> map.getKey().startsWith(CONFIG_PREFIX))
            .collect(Collectors.toMap(map -> map.getKey().replaceAll(CONFIG_PREFIX, ""), Map.Entry::getValue));
    }

    @Override
    public Map<String, String> getPublicConfig() {
        return config.entrySet()
            .stream()
            .filter(map -> map.getKey().startsWith(PUBLIC_CONFIG_PREFIX))
            .collect(Collectors.toMap(map -> map.getKey().replaceAll(PUBLIC_CONFIG_PREFIX, ""), Map.Entry::getValue));
    }

    @Override
    public Map<String, String> getPublicConfig(final String prefix) {
        return config.entrySet()
            .stream()
            .filter(map -> map.getKey().startsWith(PUBLIC_CONFIG_PREFIX + prefix))
            .collect(Collectors.toMap(map -> map.getKey().replaceAll(PUBLIC_CONFIG_PREFIX + prefix, ""), Map.Entry::getValue));
    }
}
