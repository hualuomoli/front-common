(function () {
  'use strict';

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