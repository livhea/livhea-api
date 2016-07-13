'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ArticlesService', '$state',
  function ($scope, Authentication, ArticlesService, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.articles = ArticlesService.query();

    if(!$scope.authentication.user){
      $state.go('authentication.signin');
    }else{
      var state = 'dashboard.programs';
      if($scope.authentication.user.length > 0){
        state = 'dashboard.myProgram';
      }else{
        state = 'dashboard.programs';
      }
      $state.go(state);
    }

  }
]);
