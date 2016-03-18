(function () {

    'use strict';

    describe('ui-router-modal', function () {
        context('{Module} ui-router-modal', function () {
            var modul;

            beforeEach(function () {
                modul = angular.module('ui-router-modal');
            });

            it('is defined', function () {
                expect(modul).to.be.an('object');
            });

            it('is named correctly', function () {
                expect(modul.name).to.eq('ui-router-modal');
            });

            it('registers a provider', function () {
                expect(modul._invokeQueue[0]).to.contain('$provide');
            });

            it('depends on ui.router', function () {
                expect(modul.requires).to.contain('ui.router');
            });
        });

        context('modalStateProvider', function () {
            var $sp, $msp, $state, $root;

            beforeEach(function () {
                module('ui-router-modal', function ($stateProvider, modalStateProvider) {
                    $sp    = $stateProvider;
                    $msp = modalStateProvider;
                    $msp.state('modal', {
                        controller: angular.noop
                    });
                });

                inject(function ($injector) {
                    $root  = $injector.get('$rootScope');
                    $state = $injector.get('$state');
                });
            });

            it('is defined', function () {
                expect($msp).to.have.property('state').that.is.a('function');
            });

            context('full state object', function () {
                beforeEach(function () {
                    $msp.state('xyz', {
                        controller:  'ctrl',
                        templateUrl: 'tpl',
                        resolve:     {}
                    });
                    $root.$digest();
                });

                ['controller', 'templateUrl', 'resolve'].forEach(function (prop) {
                    it('does not expose ' + prop + ' on the state object', function () {
                        expect($state.get('xyz')).to.not.have.property(prop);
                    });
                });
            });

        });

    });


}());
