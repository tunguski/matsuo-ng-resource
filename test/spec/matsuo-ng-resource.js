/// <reference path="counter.js">
"use strict";


var testModule = angular.module('test.mt.resource', ['mt.resource'])
    .config(function (restFactoryProvider, mtResourceConfig) {
      restFactoryProvider.define('Dog');
      restFactoryProvider.define('Cat', {
        parentName: 'Animal',
        additionalFunctions: {
          eat: {
            url: '/eat'
          }
        }
      });
      mtResourceConfig.baseUrl = '/testPrefix'
    });

beforeEach(module('test.mt.resource'));

var rootScope, scope, http, compile, Dog, Cat;

beforeEach(inject(function ($httpBackend, $rootScope, $compile, _Dog_, _Cat_) {
  http = $httpBackend;
  rootScope = $rootScope;
  scope = $rootScope.$new();
  compile = $compile;
  Dog = _Dog_;
  Cat = _Cat_;
}));


describe("Matsuo Resources", function () {

  it("Basic crud operations work", function () {
    var dog;

    http.expectGET('/testPrefix/api/dogs/1').respond('{}');
    Dog.get({ idDog: 1 }, function (Dog) {
      dog = Dog;
    });
    http.flush();

    dog.name = 'fluffy';
    http.expectPOST('/testPrefix/api/dogs').respond('');
    dog.$save();
    http.flush();
  });

  it("list by ids work", function () {
    http.expectGET('/testPrefix/api/dogs/list/byIds?ids=1&ids=2&ids=3').respond('[]');
    Dog.listByIds({ ids: [1,2,3] });
    http.flush();
  });

  it("resource with parent and additional function work", function () {
    http.expectGET('/testPrefix/api/animals/cats/eat').respond('{}');
    Cat.eat();
    http.flush();
  });

  it("isNew work", function () {
    expect(new Cat().isNew()).toBe(true);
    expect(new Cat({ id: 1 }).isNew()).toBe(false);
  });
});

