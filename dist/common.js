(function () {
  'use strict';

  // logger
  angular.module('blocks.logger', []);

})();
(function () {
  'use strict';

  logger.$inject = ["$log"];
  angular.module('blocks.logger')
    .factory('logger', logger);

  /* @ngInject */
  function logger($log) {
    return {
      log: log,
      info: info,
      success: success,
      warning: warning,
      error: error
    };

    /////////////////////


    function log(message, data) {
      $log.info('log: ' + message, data);
    }

    function info(message, data) {
      $log.info('Info: ' + message, data);
    }

    function success(message, data) {
      $log.info('Success: ' + message, data);
    }

    function warning(message, data) {
      $log.warn('Warning: ' + message, data);
    }

    function error(message, data) {
      $log.error('Error: ' + message, data);
    }
  }
})();
(function () {
  'use strict';

  angular.module('blocks.exception', [
    // blocks
    'blocks.logger'
  ]);

})();
(function () {
  'use strict';

  angular.module('blocks.exception')
    .provider('exceptionHandler', exceptionHandlerProvider);

  function exceptionHandlerProvider() {
    /* jshint validthis:true */
    this.config = {
      appErrorPrefix: 'front-' // error log's prefix
    };

    this.$get = function () {
      return {
        config: this.config
      };
    };
  }

})();
(function () {
  'use strict';

  config.$inject = ["$provide"];
  exceptionHandlerDecorator.$inject = ["$delegate", "exceptionHandler", "logger"];
  angular.module('blocks.exception')
    .config(config);

  /* @ngInject */
  function config($provide) {
    // add prefix to log message
    $provide.decorator('$exceptionHandler', exceptionHandlerDecorator);
  }

  /* @ngInject */
  function exceptionHandlerDecorator($delegate, exceptionHandler, logger) {
    return function (exception, cause) {

      $delegate(exception, cause);

      var errorData = {
        exception: exception,
        cause: cause
      };
      exception.message = exceptionHandler.config.appErrorPrefix + exception.message;
      logger.error(exception.message, errorData);
    };
  }

})();
(function () {
  'use strict';

  angular.module('blocks.routehelper', [
    // assets
    'ui.router',
    // blocks
    'blocks.logger'
  ]);

})();
(function () {
  'use strict';

  routehelper.$inject = ["$rootScope", "logger"];
  angular.module('blocks.routehelper')
    .factory('routehelper', routehelper);

  /* @ngInject */
  function routehelper($rootScope, logger) {

    return {
      'init': init
    };

    ///////////////

    function init() {
      stateChangeError();
      stateChangeSuccess();
      stateNotFound();
    }

    function stateChangeError() {
      $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState) {
          logger.error('change state error.', [fromState, toState]);
          // $location.path(routePath);
        }
      );
    }

    function stateChangeSuccess() {
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState) {
          logger.success('change state success. state = ', toState);
        }
      );
    }

    function stateNotFound() {
      $rootScope.$on('$stateNotFound',
        function (event, toState) {
          logger.warning('state not found. state = ', toState.to);
          logger.warning('state not found. params = ', toState.toParams);
        }
      );
    }
  }
})();
(function () {
  'use strict';

  angular.module('tools.uiLoad', [
    'blocks.logger'
  ]);

})();
(function () {
  'use strict';

  /**
   * 0.1.1
   * Deferred load js/css file, used for ui-jq.js and Lazy Loading.
   * 
   * @ flatfull.com All Rights Reserved.
   * Author url: #user/flatfull
   */
  uiLoad.$inject = ["$document", "$q", "$timeout", "logger"];
  angular.module('tools.uiLoad')
    .factory('uiLoad', uiLoad);

  /* @ngInject */
  function uiLoad($document, $q, $timeout, logger) {
    var loaded = [];
    var promise = false;
    var deferred = $q.defer();

    var service = {};

    return {
      load: load,
      loadJS: loadJS,
      loadCSS: loadCSS
    };

    /**
     * Chain loads the given sources
     * @param srcs array, script or css
     * @returns {*} Promise that will be resolved once the sources has been loaded.
     */
    function load(srcs) {
      srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
      if (!promise) {
        promise = deferred.promise;
      }
      angular.forEach(srcs, function (src) {
        promise = promise.then(function () {
          return src.indexOf('.css') >= 0 ? loadCSS(src) : loadJS(src);
        });
      });
      deferred.resolve();
      return promise;
    }

    /**
     * Dynamically loads the given script
     * @param src The url of the script to load dynamically
     * @returns {*} Promise that will be resolved once the script has been loaded.
     */
    function loadJS(src) {
      if (loaded[src]) return loaded[src].promise;

      var deferred = $q.defer();
      var script = $document[0].createElement('script');
      script.src = src;
      script.onload = function (e) {
        $timeout(function () {
          deferred.resolve(e);
          logger.success('file loaded ' + src);
        });
      };
      script.onerror = function (e) {
        $timeout(function () {
          deferred.reject(e);
          logger.error('load file error  ' + src);
        });
      };
      $document[0].body.appendChild(script);
      loaded[src] = deferred;

      return deferred.promise;
    }

    /**
     * Dynamically loads the given CSS file
     * @param href The url of the CSS to load dynamically
     * @returns {*} Promise that will be resolved once the CSS file has been loaded.
     */
    function loadCSS(href) {
      if (loaded[href]) return loaded[href].promise;

      var deferred = $q.defer();
      var style = $document[0].createElement('link');
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.href = href;
      style.onload = function (e) {
        $timeout(function () {
          deferred.resolve(e);
          logger.success('file loaded ' + href);
        });
      };
      style.onerror = function (e) {
        $timeout(function () {
          deferred.reject(e);
          logger.error('load file error  ' + href);
        });
      };
      $document[0].head.appendChild(style);
      loaded[href] = deferred;

      return deferred.promise;
    }


  }



})();
(function () {
  'use strict';

  angular.module('tools.http', [
    'blocks.logger'
  ]);

})();
(function () {
  'use strict';

  http.$inject = ["$http", "logger"];
  angular.module('tools.http')
    .factory('http', http);

  /* @ngInject */
  function http($http, logger) {
    return {
      get: get,
      post: post,
      payload: payload
    }

    // http get
    function get(url, params) {

      // parameter is null
      if (!params) {
        return doGet(url);
      }
      var realUrl;
      // object parameter
      if (typeof params === 'object') {
        // get queryString
        var queryString = '';
        for (var key in params) {
          queryString += "&" + key + "=" + params[key];
        }
        // if there is no parameter in param
        if (queryString.length === 0) {
          return doGet(url);
        }
        // get real url

        if (url.indexOf('?') >= 0) {
          realUrl = url + queryString;
        } else {
          realUrl = url + "?" + queryString.substring(1);
        }
        return doGet(realUrl);
      }

      if (typeof params === 'string') {
        // if there is no parameter in param
        if (params.length === 0) {
          return doGet(url);
        }
        // if parameter startsWith '&' remove it
        if (params.substring(0, 1) === '&') {
          params = params.substring(1);
        }
        // get real url
        if (url.indexOf('?') >= 0) {
          realUrl = url + '&' + params;
        } else {
          realUrl = url + '?' + params;
        }
        return doGet(realUrl);
      }


    }

    // http post
    function post(url, params) {
      if (!params && typeof params !== 'object') {
        throw new Error('please check your parameter before invoke.');
      }
      if (!params) {
        return $http.post(url);
      }
      return $http.post(url, $.param(params));
    }

    // payload
    function payload() {
      throw new Error("con't support this method.");
    }

    // do http get
    function doGet(realUrl) {
      return $http.get(realUrl);
    }

  }

})();