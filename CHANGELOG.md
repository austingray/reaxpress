# Change Log

### [Unreleased]
- move skeleton files `default` and `custom` into `.reaxpress` and rename to `routemap-default.js` and `routemap-custom.js` or something like that.
- regex routes with the Reaxpress Router
- subscription model for components to watch for changes to the `reaxpressData` global variable
- fix async/await methods used in commander - https://github.com/austingray/reaxpress/issues/8

### [0.10.4] 2017-05-04
- fixed routing issues for pages created via CMS
- updated admin routes to use reaxpressRouteHandler and new db models
- added comments to Reaxpress Router code
- removed user methods from database until async/await functionality is figured out with npm commander

### [0.10.3] 2017-05-01
- added a changelog :D
- added `model` command to cli
- `create` and `remove` cli commands consolidated to single `route` command with flags
- added `homepage` to blacklisted routes
- Major restructure of the `src/react` project dir
 - Moved app components into `src/react/App`
 - Moved Reaxpress core into `src/react/Reaxpress`
 - Renamed protected `Index` to `Homepage`
- Added prop-types package
