(function () {
  'use strict';

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