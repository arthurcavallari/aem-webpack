# Frontend - AEM Webpack build

Webpack goes through a set of entry files and bundles all the required javascript, css, and static resources (fonts, etc).
CSS must be imported via javascript to have it included in your component's bundle.
Static resources will be placed in the 'resources' directory of each generated client library.

## Main library versions
- Node@8.9.4
- NPM@5.6.0
- Yarn@1.3.2
- Webpack@3.8.1

## AEM Front Chrome extension
https://chrome.google.com/webstore/detail/cmpbphecgagbhhociicpakhddeagjlih?utm_source=chrome-app-launcher-info-dialog

## Directory structure

All the Javascript ES6 source files and SCSS source files are located under `src/frontend/(components|commons)`.
The Webpack build outputs the artifacts to `src/main/content/jcr_root/apps/aemwebpack/clientlibs` and it puts each entry on a separate AEM client library. 

```
├─ src
   ├─ frontend
      └─ components
        └─ my-component
           └─ html
           └─ js
           └─ scss
           └─ tests
      └─ commons
        └─ constants
           └─ js
           └─ scss
   ├─ main
      └─ content
         └─ jcr_root
            └─ apps
               └─ aemwebpack
                  └─ clientlibs
                     └─ generated-clientlib-[bundle-name]
                        └─ js
                           - [bundle-name].js
                        └─ css
                           - [bundle-name].css
                        └─ resources
```

Webpack goes through each components entry.js and bundles all the required javascript and css. If you want CSS to be bundled you must import it via javascript.

Vendor and Libs JS are bundled to `main/content/jcr_root/etc/designs/aemwebpack/generated-clientlib-vendor`

Component JS and all CSS is bundled to `main/content/jcr_root/etc/designs/aemwebpack/generated-clientlib-[bundle-name]`

## Install
`yarn install`

## Install global tools
```
yarn global add webpack@3.8.1 
                jest
                jest-cli
                aem-front@0.1.3 
                cross-env@5.1.3 
```

## Development
Here are the available tasks for development, feel free to use NPM or YARN.

- `yarn build`

    Builds the entire frontend project in DEV mode with inlined sourcemaps.
    Outputs to local disk folder: /apps/aemwebpack/clientlibs

- `yarn build:watch`

    Same as npm run build, but it also watches the files for changes and rebuilds the changed modules.
     
- `yarn build:production`

    This command is executed by the maven when building the project.
    Just like `npm run build`, except that assets are minified+uglified, sourcemaps are disabled and stylelint and eslint are disabled.

- `yarn aem:watch`
    
    This command will run AEM Front to sync AEM with your local disk changes. It watches `../main/content/jcr_root` and uploads the files to your local aem instance.
    This is a combination of AEMSync and BrowserSync. 
    
    To use Browsersync features you must access the proxied urls (localhost:4502 -> localhost:3000, and localhost:4503 -> localhost:3001).
    
- `yarn start`
    
    This command is a combination of `npm run build:watch` and `npm run aem:watch`. 
    It will watch for changes, build your frontend project, and upload it to AEM.
    
    Recommended for developers that already understand how the AEM ecosystem works.
    
- `yarn test`

    Runs Frontend tests once.
    
- `yarn run test:watch`

    Runs Frontend tests and watch for changes.