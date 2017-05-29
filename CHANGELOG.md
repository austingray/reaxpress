# Change Log

### [Unreleased]
- move skeleton files `default` and `custom` into `.reaxpress` and rename to `routemap-default.js` and `routemap-custom.js` or something like that.
- subscription model for components to watch for changes to the `reaxpressData` global variable
- fix async/await methods used in commander - https://github.com/austingray/reaxpress/issues/8
- fix duplicate component when creating child route first and specifying the compnent - https://github.com/austingray/reaxpress/issues/10
- parent route should be added to parents route array when creating by child - https://github.com/austingray/reaxpress/issues/10
- cli should fail when trying to create a regex route without a named component. - https://github.com/austingray/reaxpress/issues/11
- routes need to have a priority in which they are loaded - https://github.com/austingray/reaxpress/issues/12

### [0.10.6] 2017-05-29
- cleaned up some dated package.json entries
- updated Router to use parseurl library
- moved skeleton parsing in Router to its own file
- added regex path matching

### [0.10.5] 2017-05-05
- added missing window.reaxpress.update method in template
- added scss compilation on start
- added core concept writeup to readme

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
