(function () {
  'use strict';

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