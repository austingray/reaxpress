module.exports = (reaxpressData, componentHtml) =>
`<!DOCTYPE html>
<html>
  <head>
    <title>Reaxpress</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/bootstrap@3.3.6/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/build/css/style.css">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <script>
      window.reaxpressData = ${JSON.stringify(reaxpressData).replace(/</g, '\\u003c')}
      window.reaxpress = {};
      window.reaxpress.mounted = false;
      // actions that should fire when the URL changes
      window.reaxpress.urlListeners = [];
      window.reaxpress.addUrlListener = function(action) {
        window.reaxpress.urlListeners.push(action);
      }
      window.reaxpress.updateUrl = (url) => {
        for (var i = 0; i < reaxpress.urlListeners.length; i++) {
          reaxpress.urlListeners[i](url);
        }
      }
      // actions that should fire when reaxpressData gets updated
      window.reaxpress.dataListeners = [];
      window.reaxpress.addDataListener = function(action) {
        reaxpress.dataListeners.push(action);
      }
      window.reaxpress.reload = (callback = () => {}) => {
        $.ajax({
          url: window.location.href,
          method: 'GET',
          data: {
            reaxpress: true
          },
          success(newReaxpressData) {
            window.reaxpressData = newReaxpressData;
            for (var i = 0; i < reaxpress.dataListeners.length; i++) {
              reaxpress.dataListeners[i](newReaxpressData);
            }
            callback();
          },
          error(err) {
            callback();
          }
        });
      }
    </script>
  </head>

  <body>
    <div id="app"><div>${componentHtml}</div></div>
    <script src="/build/js/bundle.js"></script>
  </body>
</html>`;
