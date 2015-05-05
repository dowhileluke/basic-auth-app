angular.module('directives', [])
  .directive('unique', function($q, $http) {
    // code based on <https://docs.angularjs.org/guide/forms>

    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$asyncValidators.unique = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            return $q.when();
          };

          var def = $q.defer();

          $http.get('/api/account/exists/' + modelValue).then(function (result) {
            if (result.data.exists) {
              def.reject();
            } else {
              def.resolve();
            };
          });

          return def.promise;
        };
      }
    };
  });