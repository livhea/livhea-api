'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$timeout', '$rootScope',
  function ($scope, $state, Authentication, Menus, $timeout, $rootScope) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    $ = window.jQuery;

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $('.ui.sidebar').sidebar('toggle');
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $rootScope.$on('$viewContentLoaded',function(event, view){
      $('.ui.dropdown').dropdown();
    });

  }
]);
