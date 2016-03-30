(function () {
  'use strict';

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