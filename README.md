# ui-router-modal
Add parents resolve capability to modalStateProvider
Usage

Include ['ui-router-modal'] in modules.
Inject modalStateProvider in config.
Declare state with

modalStateProvider.state('user.edit', {
      url: '/edit'
    templateUrl: 'user/edit.html',
    controller: 'UserEditCtrl',
    controllerAs: 'vm',
    modalResolve: ['User'] // From parent
});

User is considered to be a parent state resolved dependencies and will now be available in UserEditCtrl
