/**
 * Created by sibi on 5/12/2017.
 */
/*To bind the reponse from the server to HTML and to send User's date to Server*/
var app=angular.module("githubApp",[]);

app.controller("githubCtrl",function ($scope,$http) {

    $scope.gitFunc = function () {

        var userName=$scope.userName;

        var total = $http.post("http://127.0.0.1:8081/"+userName,{gDate:$scope.gDate})
        total.success(function (data) {

            $scope.totalContributions={"total_contributions": data.totContributions[0]

            };
        });
    }
});