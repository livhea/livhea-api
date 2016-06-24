(function () {
  'use strict';

  angular
    .module('vitals')
    .controller('VitalsListController', VitalsListController);

  VitalsListController.$inject = ['VitalsService'];

  function VitalsListController(VitalsService) {
    var vm = this;

    vm.vitals = VitalsService.query();
  }
})();
