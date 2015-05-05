angular.module('controllers', ['ui.bootstrap', 'services', 'directives'])
  .controller('RootCtrl', ['$scope', 'Authorization', function ($scope, Authorization) {
    $scope.$watch(function () {
      return Authorization.user
    }, function (value) {
      $scope.user = value;
    }, true);
  }])
  .controller('IndexCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.callApi = function () {
      $http.get('/api/test').then(function (response) {
        $scope.apiResponse = response;
      }, function (reason) {
        $scope.apiResponse = reason;
      });
    };
  }])
  .controller('AccountFormCtrl', ['$scope', '$location', 'Authorization', function ($scope, $location, Authorization) {
    $scope.account = {};

    $scope.login = function () {
      Authorization.login($scope.account.username, $scope.account.password).then(function (response) {
        $location.path('/');
      }, function (reason) {
        $scope.error = reason;
      });
    };

    $scope.register = function () {
      if ($scope.account.password === $scope.account.again) {
        Authorization.register($scope.account.username, $scope.account.password).then(function (response) {
          $location.path('/');
        }, function (reason) {
          $scope.error = reason;
        });
      };
    };

    $scope.dismiss = function () {
      delete $scope.error;
    };

    $scope.usernameInvalid = function () {
      var username = $scope.registration.username;

      return (username.$touched && username.$error.required);
    };

    $scope.passwordsTouched = function () {
      return ($scope.registration.password.$touched && $scope.registration.confirm.$touched);
    };

    $scope.passwordsMissing = function () {
      return ($scope.registration.password.$error.required || $scope.registration.confirm.$error.required);
    };

    $scope.passwordsMismatched = function () {
      return ($scope.account.password !== $scope.account.again);
    };

    $scope.passwordsInvalid = function () {
      return ($scope.passwordsTouched() && ($scope.passwordsMissing() || $scope.passwordsMismatched()));
    }
  }])
  .controller('AccountLogoutCtrl', ['$location', 'Authorization', function ($location, Authorization) {
    Authorization.logout();
    $location.path('/account/login');
  }]);