var mainApplicationModuleName= 'meanapp';

var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngResource','ngRoute','users','example', 'articles']);

mainApplicationModule.config(['$locationProvider', 
	function($locationProvider){
		$locationProvider.hashPrefix('!');
	}
]);

angular.element(document).ready(function(){
	angular.bootstrap(document, [mainApplicationModuleName]);
});