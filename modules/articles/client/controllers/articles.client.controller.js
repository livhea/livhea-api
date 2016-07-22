(function () {
  'use strict';

  // Articles controller
  angular
  .module('articles')
  .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'Authentication', 'articleResolve', 'ProgramsService', '$timeout'];

  function ArticlesController ($scope, $state, Authentication, article, ProgramsService, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.article = article;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.programs = ProgramsService.query();
    vm.programs.$promise.then(function(){
      $('.dropdown').dropdown();
      $timeout(function(){
        $('.ui.fluid.dropdown').dropdown('set selected', vm.article.program);
      },1);
    });

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
