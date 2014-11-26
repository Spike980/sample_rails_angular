(function () {
  'use strict';

  angular.module('app').config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('report', {
        url: '/report',
        templateUrl: 'angular/report/_report.html',
        resolve: {
          auth: ["$q", "currentUserFactory", function ($q, currentUserFactory) {

            var currentUser = currentUserFactory.getCurrentUser();

            if (currentUser) {
              return $q.when(currentUser);
            } else {
              return $q.reject({ authenticated: false });
            }
          }]
        }
      })
  }

})();