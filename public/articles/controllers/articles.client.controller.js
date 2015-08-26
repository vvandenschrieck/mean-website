angular.module('articles').controller('ArticlesController', 
		['$scope','$routeParams', '$location', 'Authentication', 'Articles',
			function($scope, $routeParams, $location, Authentication, Articles){
       			$scope.authentication = Authentication;
				/*
				 * Creation of an article by using the REST resource 
				 */ 
				$scope.create = function() {
					//Object creation from view data
					var article = new Articles({
				    	title: this.title,
				       	content: this.content
				    });
					//Save new article on resource
				    article.$save(
						function(response) {
							//callback for success : redirect to article url for display
				     		$location.path('articles/' + response._id);
				     	}, 
						function(errorResponse) {
							//Callback for error : display error message
				       		$scope.error = errorResponse.data.message;
						}
					);
			 	};
				/*
				 * Get all articles and send array to the view
				 */
				$scope.find = function() {
				     $scope.articles = Articles.query();
				};
				/*
				 * Get one article from URL param and send to the view
				 */ 
				$scope.findOne = function() {
					$scope.article = Articles.get({
				    	articleId: $routeParams.articleId
				    });
				};
				/*
				 * Update the resource base on the article from the scope
				 */
				$scope.update = function() {
					$scope.article.$update(
						function() {
				    		$location.path('articles/' + $scope.article._id);
				    	}, 
						function(errorResponse) {
				       		$scope.error = errorResponse.data.message;
				     	}
					);
				};	
				/*
				 * Delete an article from a list or from the article page
				 */ 
				$scope.delete = function(article) {
					if (article) {
				    	article.$remove(function() {
				        	for (var i in $scope.articles) {
				           		if ($scope.articles[i] === article) {
					           		$scope.articles.splice(i, 1);
					           	}
					 	   	} 
						});
					} else {
						$scope.article.$remove(function() {
					   		$location.path('articles');
					    });
					} 
				};			
     		}
		]
);