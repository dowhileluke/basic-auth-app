var app = angular.module('myApp', ['ngRoute', 'controllers'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    var path = '/static/partials/';

    $routeProvider
      .when('/', {
        templateUrl: path + 'index.html',
        controller: 'IndexCtrl'
      })
      .when('/account/login', {
        templateUrl: path + 'account/login.html',
        controller: 'AccountFormCtrl'
      })
      .when('/account/register', {
        templateUrl: path + 'account/register.html',
        controller: 'AccountFormCtrl'
      })
      .when('/account/logout', {
        template: false,
        controller: 'AccountLogoutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }]);