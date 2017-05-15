/**
 * Created by sibi on 5/12/2017.
 */
/*To bind the response from the server to HTML and to send User's date to Server*/
var app=angular.module("githubApp",[]);             //module

app.controller("githubCtrl",function ($scope,$http) {           //controller

    $scope.gitFunc = function () {

        var userName=$scope.userName;                             //storing HTML DOM value into Angular $scope variable

        var total = $http.post("http://127.0.0.1:8080/"+userName,{gDate:$scope.gDate})      //passing user's value as parameters to $http post function (AJAX)
        total.success(function (data) {

            $scope.totalContributions={"total_contributions": data.totContributions[0]          //storing the result into $scope variable

            };
        });
    }
});