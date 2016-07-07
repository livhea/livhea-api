'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ArticlesService',
  function ($scope, Authentication, ArticlesService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;



    $scope.articles = ArticlesService.query();
  }
]);
