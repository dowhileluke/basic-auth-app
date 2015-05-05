angular.module('services', [])
  .service('Authorization', ['$http', '$q', function ($http, $q) {
    var self = this;

    function setAuthHeader(value) {
      $http.defaults.headers.common.Authorization = value || '';
    };

    function onUserAuthenticated(user) {
      setAuthHeader('Basic ' + user.auth);
      self.user = user;
      return user;
    };

    function postCredentials(url) {
      return function (username, password) {
        return $http.post(url, {
          username: username,
          password: password
        }).then(function (response) {
          var data = response.data;

          if (data.auth) {
            return onUserAuthenticated(data);
          } else {
            return $q.reject(data.message || data.error);
          };
        });
      };
    };

    this.login = postCredentials('/api/account/login');
    this.register = postCredentials('/api/account/register');
    this.logout = function () {
      delete this.user;
      setAuthHeader();
    };

    setAuthHeader();
  }]);
