angular.module('placePeopleApp')
    .filter('reverse', function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    })
    .filter('userByName', function () {
    return function (items) {
        return (item.userId.toString().indexOf($scope.filterValue) > -1 ||
        item.firstName.toLowerCase().indexOf($scope.filterValue) > -1)
    };
});