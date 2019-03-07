package com.shinesolutions.aemwebpack.models;

public class ConfigModel {
    private String key;
    private String value;

    public ConfigModel(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public String getValue() {
        return value;
    }
}
