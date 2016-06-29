angular.module('placePeopleApp').filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});