# Change Log

### [Unreleased]
- move skeleton files `default` and `custom` into `.reaxpress` and rename to `routemap-default.js` and `routemap-custom.js` or something like that.

### [0.10.3] 2017-05-01
- added a changelog :D
- added `model` command to cli
- `create` and `remove` cli commands consolidated to single `route` command with flags
- added `homepage` to blacklisted routes
- Major restructure of the `src/react` project dir
 - Moved app components into `src/react/App`
 - Moved Reaxpress core into `src/react/Reaxpress`
 - Renamed protected `Index` to `Homepage`
