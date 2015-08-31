describe('Testing Articles Controller', function() {
	var _scope, ArticlesController;
	beforeEach(function() {
		module('meanapp');
		jasmine.addMatchers({
			toEqualData: function(util, customEqualityTesters) {
				return {
					compare: function(actual, expected) {
						return {
							pass: angular.equals(actual, expected)
						};
					}
				};
			}
		});

		inject(function($rootScope, $controller) {
			_scope = $rootScope.$new();
			ArticlesController = $controller('ArticlesController', {
				$scope: _scope
			});
		});
	});
	it('Should have a find method that uses $resource to retrieve a list of articles',
		inject(function(Articles) {
			inject(function($httpBackend) {
				var sampleArticle = new Articles({
					title: 'An Article about MEAN',
					content: 'MEAN rocks!'
				});
				var sampleArticles = [sampleArticle];
				$httpBackend.expectGET('api/articles').respond(sampleArticles);
				_scope.find();
				$httpBackend.flush();
				expect(_scope.articles).toEqualData(sampleArticles);
			});
		})
	);
	it('Should have a findOne method that uses $resource to retreive a single of article', 
	inject(function(Articles) {
		inject(function($httpBackend, $routeParams) {
			var sampleArticle = new Articles({
				title: 'An Article about MEAN',
				content: 'MEAN rocks!'
			});
			$routeParams.articleId = 'abcdef123456789012345678';
			//configuring backend to respond with json sample article
			$httpBackend.expectGET(/api\/articles\/([0-9a-fA-F]{24})$/).respond(sampleArticle);
			//Call the controller method
			_scope.findOne();
			//Ask the backend to respond to HTTP request
			$httpBackend.flush();
			//Verification of the result in the scope
			expect(_scope.article).toEqualData(sampleArticle);
		});
	}));
});
