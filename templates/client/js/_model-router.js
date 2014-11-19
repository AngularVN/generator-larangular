'use strict';

angular.module('<%= baseName %>')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/<%= pluralize(name) %>', {
        templateUrl: 'views/<%= name %>/<%= pluralize(name) %>.html',
        controller: '<%= _.classify(name) %>Ctrl',
        resolve: {
          resolved<%= _.classify(name) %> : ['resource<%= _.classify(name) %>', function(resource<%= _.classify(name) %>) {
            return resource<%=_.classify(name) %>.query();
          }]
        }
      })
  }]);