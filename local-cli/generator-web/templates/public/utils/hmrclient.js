/**
 * simple rewrite of webpack-hot-middleware/client.js
 * using websockets instead of EventSource
 */
var options = {
    host: 'localhost:8081',
    entry: 'index.web.js',
    overlay: true,
    reload: false,
    log: true,
    injectFunction: eval,
    warn: true
};

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.WebSocket === 'undefined') {
  console.warn(
    `hrmclient requires WebSocket to work.
    You should include a polyfill if you want to support this browser:
    https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API#Tools`
  );
} else {
  connect(window.WebSocket);
}

function connect(WebSocket) {
    var ws = new WebSocket(`ws://${options.host}/hot?platform=web&bundleEntry=${options.entry}`);
    var lastActivity = new Date();

    ws.onopen = function() {
        if (options.log) console.log("[HMR] connected");
        lastActivity = new Date();
    };

    ws.onmessage = function (evt) {
        lastActivity = new Date();
        if (event.data == "\uD83D\uDC93") {
            return;
        }

        try {
          processMessage(JSON.parse(event.data));
        } catch (ex) {
          if (options.warn) {
            console.warn("Invalid HMR message: " + event.data + "\n" + ex);
          }
        }
    };
    ws.onclose = function() {
        if (options.log) console.log("[HMR] disconnected");
        // @todo reconnect
    };
}

function processMessage(data) {
    if (data.type == "update-start") {
        if (options.log) console.log("[HMR] bundle rebuilding");
    } else if (data.type == "update-done") {
        if (options.log) console.log("[HMR] bundle update complete");
    } else if (data.type == "update") {
        if (options.log) {
            console.log(`[HMR] bundle ${(data.name ? data.name + ' ' : '')}
                rebuilt in ${data.time}ms`);
        }
        if (data.errors && data.errors.length > 0) {
            //   if (reporter) reporter.problems('errors', obj);
        } else {
            const {
                modules,
                sourceMappingURLs,
                sourceURLs,
                inverseDependencies,
            } = data.body;

            //   if (reporter) {
            //     if (obj.warnings.length > 0) reporter.problems('warnings', obj);
            //     reporter.success();
            //   }

            modules.forEach(({id, code}, i) => {
                code = code + '\n\n' + sourceMappingURLs[i];
                options.injectFunction([
                    '__accept(',
                      `${id},`,
                      'function(global,require,module,exports){',
                        `${code}`,
                      '\n},',
                      `${JSON.stringify(inverseDependencies)}`,
                    ');',
                ].join(''), sourceURLs[i]);
              });
        }
    }
}
