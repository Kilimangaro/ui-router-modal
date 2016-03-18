/** ui-router-modal - v0.0.0 - 2016-03-18
Add parents resolve capability to modalStateProvider.
(taken from https://lingohub.com/blog/2015/06/bootstrap-modal-window-custom-url-angularjs/)
*/
(function (window, angular, undefined) {
    'use strict';

    angular.module('ui-router-modal', [
            'ui.router',
            'ui.bootstrap'
        ])
        .provider('modalState', ['$stateProvider', function ($stateProvider) {

            var provider = this;
            var modalResult;

            this.$get = function () {
                return provider;
            };

            this.state = function (stateName, options) {
                var modalInstance;

                var stateOption = {
                    url: options.url,
                    onEnter: [],
                    onExit: function () {
                        if (modalInstance) {
                            modalInstance.close();
                        }
                    },
                    data: options.data
                };

                if (angular.isDefined(options.parent)) {
                    stateOption.parent = options.parent;
                }

                /**
                 * The onEnter function of uibModal is actually injected with parents resolves.
                 * We just need to declare the named resolve as in standard ui-router controllers
                 * Let use Inline Array Annotation to grabs theses values and pass it to the modal resolve
                 *
                 * 1. First, we inject the needed dependencies ($uibModal and $state)
                 * 2. After that, we loop options.modalResolve
                 * 3. Finally, we push the function with no parameters and we grab
                 */
                stateOption.onEnter.push('$uibModal');
                stateOption.onEnter.push('$state');
                if (angular.isArray(options.modalResolve)) {
                    angular.forEach(options.modalResolve, function (resolve) {
                        stateOption.onEnter.push(resolve);
                    });
                }
                stateOption.onEnter.push(function () {
                    // We need this to iterate through arguments
                    var args = Array.prototype.slice.call(arguments);

                    // Ours needed dependencies
                    var $uibModal = args.shift();
                    var $state = args.shift();

                    // Each named resolve is copied in the uibModal resolve attribute
                    if (angular.isArray(options.modalResolve)) {
                        options.resolve = {};
                        angular.forEach(options.modalResolve, function (resolve, index) {
                            options.resolve[resolve] = args[index];
                        });
                    }

                    modalInstance = $uibModal.open(options);
                    // When the modal uses $close({..}), the data (=result) will be assigned to the parent state as 'modalResult'.
                    modalInstance.result.then(function (result) {
                        modalResult = result;
                    }).finally(function () { // modal closes
                        if (modalResult) {
                            $state.get('^').modalResult = modalResult;
                        }
                        modalInstance = modalResult = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^'); // go to parent state
                        }
                    });
                });

                $stateProvider.state(stateName, stateOption);
                return provider;
            };
        }]);
})(window, window.angular);

