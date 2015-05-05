angular.module('controllers', ['services'])
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
    $scope.login = function () {
      Authorization.login($scope.account.username, $scope.account.password).then(function (response) {
        $location.path('/');
      });
    };

    $scope.register = function () {
      if ($scope.account.password === $scope.account.again) {
        Authorization.register($scope.account.username, $scope.account.password).then(function (response) {
          $location.path('/');
        });
      };
    };
  }])
  .controller('AccountLogoutCtrl', ['$location', 'Authorization', function ($location, Authorization) {
    Authorization.logout();
    $location.path('/account/login');
  }]);