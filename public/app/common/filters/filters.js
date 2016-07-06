angular.module('placePeopleApp')
    .filter('reverse', function () {
        return function (items) {
            if (items) {
                return items.slice().reverse();
            }
        };
    })
    .filter('filterBy', ['$parse', function ($parse) {
        return function (collection, search) {
            search = search.toLowerCase();
            return collection.filter(function (item) {
                return (item.first_name.toLowerCase().indexOf(search) > -1 ||
                item.last_name.toLowerCase().indexOf(search) > -1)
            });
        }
    }]);