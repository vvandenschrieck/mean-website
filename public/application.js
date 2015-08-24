var mainApplicationModuleName= 'meanapp';

var mainApplicationModule = angular.module(mainApplicationModuleName, []);

angular.element(document).ready(function(){
	angular.bootstrap(document, [mainApplicationModuleName]);
});