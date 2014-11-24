app

  .factory('Jog', ['$resource', 'CurrentUserService', function ($resource, CurrentUserService) {
    var currentUser = CurrentUserService.getCurrentUser();
    return $resource('/api/users/:user_id/jogs/:id.json', { id: '@id', user_id: currentUser.user_id }, {
      update: {
        method: 'PATCH'
      }});
  }])

  .controller('JogsController', function ($scope, $filter, Jog) {
    $scope.jogs = Jog.query();

    $scope.rangeDescriptor = 'all';

    $scope.datetimepickerDropdownOpen = false;
    $scope.closeDatetimepickerDropdown = function (newDate, oldDate) {
//    $scope.newJog.start_time = $filter('date')(newDate, 'short');
      $scope.datetimepickerDropdownOpen = false;
    };

    $scope.new = function () {
      var now = new Date();
      $scope.newJog = {
        'start_time': now
      }
    };

    $scope.newCancel = function (event) {
      event.preventDefault();
      $scope.newJog = null;
    };

    $scope.create = function () {
      var jog = Jog.save($scope.newJog);
      $scope.jogs.push(jog);
      $scope.newJog = null;
    };

    $scope.edit = function (jog) {
      $scope.editedJog = jog;

      // Clone the original jog to restore it on demand.
      $scope.originalJog = angular.extend({}, jog);
    };

    $scope.update = function (jog) {
      Jog.update(jog);
      $scope.jogs.splice($scope.jogs.indexOf(jog), 1, jog);
      $scope.editedJog = null;
    };

    $scope.revertEdits = function (jog) {
      $scope.jogs[$scope.jogs.indexOf(jog)] = $scope.originalJog;
      $scope.editedJog = null;
      $scope.originalJog = null;
      $scope.reverted = true;
    };

    $scope.destroy = function (jog) {
      Jog.delete(jog);
      var originalJogs = $scope.jogs.slice(0);
      $scope.jogs.splice($scope.jogs.indexOf(jog), 1);
    }
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('jogs');

    $stateProvider
      .state('jogs', {
        url: '/jogs',
        templateUrl: 'ng-templates/jogs.html',
        resolve: {
          auth: ["$q", "CurrentUserService", function ($q, CurrentUserService) {

            var currentUser = CurrentUserService.getCurrentUser();

            if (currentUser) {
              return $q.when(currentUser);
            } else {
              return $q.reject({ authenticated: false });
            }
          }]
        }
      })
  });

