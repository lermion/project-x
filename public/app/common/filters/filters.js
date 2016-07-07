angular.module('placePeopleApp')
    .filter('reverse', function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    })
    .filter('searchFor', function () {
        return function (arr, searchString) {
            if (!searchString) {
                return arr;
            }
            var result = [];
            searchString = searchString.toLowerCase();
            angular.forEach(arr, function (item) {
                if (item.first_name.toLowerCase().indexOf(searchString) !== -1 ||
                    item.last_name.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(item);
                }
            });
            return result;
        };
    });