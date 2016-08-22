angular.module('placePeopleApp').controller('HiddenPubContoller', ['$scope',function ($scope){
    $scope.$emit('userPoint', 'user');
}]);