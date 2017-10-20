# Build snippets

This folder contains HTML snippets such as GTM / VWO scripts that should be included in HEAD / BODY.
Snippets are getting injected into index.html file on build/deploy phase.

## Folder structure

There are two region directories, *gb* and *ie*, in the root of `/build_snippets` folder.
Each folder contains the same list of "zone" directories:

1. **head** - placed in HEAD tag.
2. **body.top** - placed right after opening BODY tag.
3. **body.bottom** - placed right before closing BODY tag.

## Snippet file naming convention

1. Each snippet should have extension `.html`.
2. Snippet may have environment suffix (`test` or `live`) before file extension. In this case, snippet will be injected on specified environment only.

Example:

1. `ie/head/gtm.live.html` - included in head of live (master) builds for IE (Ireland) project.
2. `gb/body.bottom/vwo.html` - included in footer of **all** builds for GB (United Kingdom) project.


## Development

By default, snippets are not included in React development server mode (`yarn run start`).
If you need to debug snippets, you can either run `yarn run build` or paste snippet directly into `/public/index.html`.

See `/build_scripts/build-snippets.js` file for details on implementation.
