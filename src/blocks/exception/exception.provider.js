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