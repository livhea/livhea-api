'use strict';

// Configuring the Articles module
angular.module('users').run(['Menus',
  function (Menus) {


    Menus.addMenuItem('topbar', {
      title: 'Consult Myra',
      state: 'home',
      type: 'item',
      roles: ['user']
    });

    Menus.addMenuItem('topbar', {
      title: 'Week Wise Baby Tracker',
      state: 'home',
      type: 'item',
      roles: ['user']
    });

    Menus.addMenuItem('topbar', {
      title: 'Milestones',
      state: 'home',
      type: 'item',
      roles: ['user']
    });

    Menus.addMenuItem('topbar', {
      title: 'Settings',
      state: 'home',
      type: 'item',
      roles: ['user']
    });

    Menus.addMenuItem('topbar', {
      title: 'Profile',
      state: 'settings',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    Menus.addSubMenuItem('topbar', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });

  }
]);
