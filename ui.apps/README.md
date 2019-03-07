# AEM UI.APPS

Contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates, runmode specific configs as well as Hobbes-tests

## Syncing Paths Without Adding Them to the Package

Source: [https://helpx.adobe.com/experience-manager/6-2/sites/developing/using/ht-projects-maven.html](https://helpx.adobe.com/experience-manager/6-2/sites/developing/using/ht-projects-maven.html)

In some cases, you may want to keep particular paths synchronized between the file system and the repository, 
but not have them included in the package that is built to be installed into AEM.

A typical case is the /libs/foundation path. For development purposes, you may want to have the contents of this path available in your file system, 
so that e.g. your IDE can resolve JSP inclusions that include JSPs in /libs. However, you don't want to include that part in the package you build, 
as the /libs part contains product code that must not be modified by custom implementations.

To achieve this, you can provide a file ```src/main/content/META-INF/vault/filter-vlt.xml```. 
If this file exists, it will be used by the VLT tool, e.g. when you perform ```vlt up``` and ```vlt ci```, or when you have set vlt sync set up. 
The content-package-maven-plugin will continue to use the file ```src/main/content/META-INF/vault/filter.xml``` when creating the package.

For example, to make /libs/foundation available locally for development, but only include /apps/myproject in the package, use the following two files.

**src/main/content/META-INF/vault/filter.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
    <filter root="/apps/myproject"/>
</workspaceFilter>
```

**src/main/content/META-INF/vault/filter-vlt.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
    <filter root="/libs/foundation"/>
    <filter root="/apps/myproject"/>
</workspaceFilter>
```

You will also need to reconfigure the maven-resources-plugin to not include these files in the package: the filter.xml file is not applied when the package is installed but only when the package is built again using package manager.

**src/main/content/pom.xml**
```xml
<!-- ... -->
<resources>
    <resource>
        <directory>src/main/content/jcr_root</directory>
        <filtering>false</filtering>
        <excludes>
            <exclude>**/.vlt</exclude>
            <exclude>**/.vltignore</exclude>
            <exclude>libs/</exclude>
        </excludes>
    </resource>
</resources>
<!-- ... -->
```