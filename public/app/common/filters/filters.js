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
    })
    // only for search object in array by userId === id
    .filter('getById', function () {
        return function (input, id) {
            var i = 0, len = input.length;
            for (; i < len; i++) {
                // TODO change userId to id
                if (+input[i].userId == +id) {
                    return input[i];
                }
            }
            return null;
        }
    });