/// <reference path="counter.js">
"use strict";


var testModule = angular.module('test.mt.resource', ['ngResource']);

var restFactory = buildRestFactory(testModule, '/testPrefix/');
restFactory('Dog');

beforeEach(module('test.mt.resource'));

var rootScope, scope, http, compile, Dog;

beforeEach(inject(function ($httpBackend, $rootScope, $compile, Dog) {
  http = $httpBackend;
  rootScope = $rootScope;
  scope = $rootScope.$new();
  compile = $compile;
}));


describe("Matsuo Resources", function () {
  it("Rest factory", function () {

    http.expectPOST('/testPrefix/api/dogs/1').respond('{}');
    Dog.get({ idDog: 1 });

    http.flush();

    //expect(route).not.toBeNull();
  });
});