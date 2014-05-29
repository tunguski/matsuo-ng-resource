

/**
 * Simplified version for registering resource factories. To create factory function, one have to pass angular module,
 * in which resources will be registered and base url. If base url is ommited, host and port for index.html is taken
 * by default.
 *
 * Options:
 * - parentName - name of parent entity; it is in url before actual entity part
 * - urlEntityName - nonstandard entity name in url - if grammar form for plural is not created by adding 's' suffix
 * - additionalFunctions - additional functions declared in factory object
 */
function buildRestFactory(module, baseUrl) {
  return function (name, options) {
    options = options || {};

    var idProperty = "id" + name;

    module.factory(name, function($resource) {
      var params = {};
      params[idProperty] = '@' + idProperty;
      var url = (baseUrl || '') + '/api/';

      if (options.parentName) {
        var parentLowerName = options.parentName.decapitalize();
        var idParentProperty = "id" + options.parentName;

        params[idParentProperty] = '@' + idParentProperty;
        url = url + parentLowerName + 's/:' + idParentProperty + '/';
      }

      url = url + (options.urlEntityName ? options.urlEntityName : name.decapitalize() + 's');

      function filterAndStringify(data) {
        return JSON.stringify(filterRequestData(data));
      }

      var functions = {
        update: { method: 'PUT',  transformRequest: filterAndStringify },
        save: {   method: 'POST', transformRequest: filterAndStringify },
        listByIds: { method : 'GET', isArray: true, url: url + "/list/byIds" }
      };
      if (options.additionalFunctions) {
        angular.forEach(options.additionalFunctions, function (fn, key) {
          // add this resource's prefix to url if url is not starting with that prefix already
          fn.url = fn.url ? ((fn.url.indexOf(url) != 0 ? url : '') + fn.url) : url;
          // default request method - GET
          fn.method = fn.method || 'GET';

          functions[key] = fn;
        });
      }

      var entity = $resource(url + '/:' + idProperty, params, functions);
      entity.prototype.isNew = function() {
        return (typeof (this.id) === 'undefined');
      };
      return entity;
    });
  };
}
