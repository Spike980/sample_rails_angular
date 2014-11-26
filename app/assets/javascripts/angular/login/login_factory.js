(function () {
  'use strict';

  angular.module('app').factory('loginFactory', loginFactory);

  function loginFactory($http, $q) {

    function login(email, password) {

      var deferred = $q.defer();

      $http.post("/api/api_tokens.json", {
        login: {
          email: email,
          password: password
        }
      }).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();

      $http({
        method: "DELETE",
        url: "/api/api_tokens.json"
      }).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    return {
      login: login,
      logout: logout
    };
  }

})();