var myApp = angular.module('myApp', []);
myApp.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
  myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
    
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
    }]);
myApp.controller('userCtrl', ['$scope', '$http', function($scope, $http) {
   

$scope.requestUrl="http://localhost:3000/"
$scope.user={};
$scope.uploadFile = function(){

    var file = $scope.myFile;
    var uploadUrl = $scope.requestUrl+"multer";
    var fd = new FormData();
    fd.append('file', file);

    $http.post(uploadUrl,fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .then(function(fileData){
      console.log("success!!");
      console.log("fileData",fileData)
      $scope.user.profile=fileData.data
    })
    .catch(function(response){
      console.log("error!!",response);
    });
};
$scope.getUsers = function() {

    $http.get($scope.requestUrl + "users")
        .then(function (response) {
            $scope.users = response.data.data;
            console.log("   $scope.users",   $scope.users)
            console.log("OK:", response.data);
        }).catch(function (response) {
            console.log("ERROR:", response);
    });
};

$scope.getUsers();

$scope.addUser = function() {
  console.log("$scope.user", $scope.user);
  $http.post($scope.requestUrl + "users", $scope.user)
      .then(function (response) {
          $scope.getUsers();
      }).catch(function (response) {
          console.log("ERROR:", response);
      });
};

$scope.removeUser = function(id) {
  console.log("userid",id);

  $http.delete($scope.requestUrl + "users/" + id)
  .then(function (response) {
      $scope.getUsers();
  }).catch(function (response) {
      console.log("ERROR:", response);
  });

};

$scope.editUser = function(id) {
  console.log(id);
    $http.get($scope.requestUrl + "users/" + id)
        .then(function (response) {
            console.log("response",response)
            if (response.data) {
                console.log("response.data.data",response.data.data)
                $scope.user = response.data.data[0];
            }
        }).catch(function (response) {
            console.log("ERROR:", response);
        });
};  

$scope.updateUser = function() {

  var id = $scope.user._id
  $http.put($scope.requestUrl + "users/" + id, $scope.user)
      .then(function (response) {
          if (response.data) {
              $scope.getUsers();
          }
      }).catch(function (response) {
          console.log("ERROR:", response);
      });


};

$scope.clear = function() {
  $scope.user = {}
}

}]);