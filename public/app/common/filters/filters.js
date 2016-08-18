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
	}).filter('linkCheck',['$filter',
		function($filter) {
			return function(text, target) {
				if (!text) return text;

				var replacedText = $filter('linky')(text, target);

				var targetAttr = "";
				if (angular.isDefined(target)) {
					targetAttr = ' target="' + target + '"';
				}

				// replace #hashtags and send them to twitter
				var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
				replacedText = text.replace(replacePattern1, "$1<a href='javascript:void(0);'" + targetAttr + ">#$2</a>");

				// replace @mentions but keep them to our site
				var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
				replacedText = replacedText.replace(replacePattern2, '$1<a href="$2"' + targetAttr + '>@$2</a>');

				return replacedText;
			};

		}
	]);