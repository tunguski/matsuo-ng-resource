/// <reference path="counter.js">
"use strict";


var testModule = angular.module('test.mt.resource', ['ngResource']);

var restFactory = buildRestFactory(testModule, '/testPrefix');
restFactory('Dog');
restFactory('Cat', {
  parentName: 'Animal',
  additionalFunctions: {
    eat: function () {}
  }
});

beforeEach(module('test.mt.resource'));

var rootScope, scope, http, compile, _Dog;

beforeEach(inject(function ($httpBackend, $rootScope, $compile, Dog) {
  http = $httpBackend;
  rootScope = $rootScope;
  scope = $rootScope.$new();
  compile = $compile;
  _Dog = Dog;
}));


describe("Matsuo Resources", function () {
  it("Basic crud operations work", function () {
    var dog;

    http.expectGET('/testPrefix/api/dogs/1').respond('{}');
    _Dog.get({ idDog: 1 }, function (_dog) {
      dog = _dog;
    });
    http.flush();

    dog.name = 'fluffy';
    http.expectPOST('/testPrefix/api/dogs').respond('');
    dog.$save();
    http.flush();
  });

  it("list by ids work", function () {
    http.expectGET('/testPrefix/api/dogs/list/byIds?ids=1&ids=2&ids=3').respond('[]');
    _Dog.listByIds({ ids: [1,2,3] });
    http.flush();
  });
});

