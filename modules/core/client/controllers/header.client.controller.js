'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$timeout',
  function ($scope, $state, Authentication, Menus, $timeout) {
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

    $timeout(function(){
      //Init Sub-Menus
      $('.ui.dropdown')
        .dropdown();
    }, 10);
  }
]);
