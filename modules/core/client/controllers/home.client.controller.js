'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ArticlesService',
  function ($scope, Authentication, ArticlesService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    //var vm = this;

    // vm.articles =

    $scope.articles = ArticlesService.query();

  }
]);

// (function () {
//   'use strict';
//
//   angular
//     .module('core')
//     .controller('HomeController', HomeController);
//
//   HomeController.$inject = ['$scope', 'Authentication', 'ArticlesService'];
//
//   function Home($scope, Authentication, ArticlesService) {
//     $scope.authentication = Authentication;
//
//     var vm = this;
//
//     vm.articles = ArticlesService.query();
//   }
// })();
