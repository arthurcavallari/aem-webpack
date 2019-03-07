package com.shinesolutions.aemwebpack.components;

import com.shinesolutions.aemwebpack.models.ConfigModel;
import com.shinesolutions.aemwebpack.services.EnvironmentConfig;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.settings.SlingSettingsService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ConfigComponent extends BaseComponent {

    private EnvironmentConfig environmentConfig = null;
    private List<ConfigModel> configModels = new ArrayList<>();
    private String runMode;

    /**
     *
     * @throws IllegalStateException Throws exception if the OMSEnvironmentConfig service is not available
     */
    @Override
    protected void activated() throws Exception {
        getEnvironmentConfig();
        getGlobalConfig();

        SlingSettingsService slingSettings = this.getSlingScriptHelper().getService(SlingSettingsService.class);
        runMode = slingSettings.getRunModes().toString().contains("author") ? "author" : "publish";
        configModels.add(new ConfigModel("runMode", runMode));
    }

    private void getGlobalConfig() {
        ResourceResolver resolver = request.getResourceResolver();
        Resource globalConfig = resolver.getResource("/content/aemwebpack/en/jcr:content/global-component-properties/global");

        if(globalConfig != null) {
            ValueMap properties = globalConfig.getValueMap();

            for(Map.Entry<String, Object> e : properties.entrySet()) {
                String key = e.getKey();
                String value = e.getValue().toString();

                if(!key.startsWith("jcr:") && !key.startsWith("sling:") && !key.startsWith("cq:")) {
                    configModels.add(new ConfigModel(key, value));
                }
            }
        }
    }

    private void getEnvironmentConfig() {
        environmentConfig = getSlingScriptHelper().getService(EnvironmentConfig.class);
        if (environmentConfig == null) {
            throw new IllegalStateException("Could not get EnvironmentConfig");
        }

        environmentConfig.getPublicConfig().forEach((key, value) -> {
            configModels.add(new ConfigModel(key, value));
        });
    }

    public List<ConfigModel> getConfig() {
        return configModels;
    }

    public String getRunMode() { return runMode; }

}
