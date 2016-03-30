(function () {
  'use strict';

  /**
   * 0.1.1
   * Deferred load js/css file, used for ui-jq.js and Lazy Loading.
   * 
   * @ flatfull.com All Rights Reserved.
   * Author url: #user/flatfull
   */
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