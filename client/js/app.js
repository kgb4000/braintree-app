var module = angular.module('Skeleton.Project',
									['baseModule',
                                     'ngRoute',
									 'ngResource',
									 'ngSanitize',
									 'ui.bootstrap']);

module.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
            templateUrl: './templates/login.html',
            controller: 'LoginPageController'
		})
        .when('/home', {
            templateUrl: './templates/home.html',
            controller: 'HomePageController'
        })
        .when('/404', {
            templateUrl: './templates/404.html'
        })
		.otherwise({
			redirectTo: '/404'
		});
}]);