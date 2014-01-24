fontselectModule.directive('jdFontlist', ['jdFontselect.fonts', function(fontsService) {
  return {
    scope: {
      id: '=fsid',
      fonts: '=',
      current: '=',
      providerName: '@provider'
    },
    restrict: 'E',
    templateUrl: 'fontlist.html',
    replace: true,
    controller: ['$scope', '$filter', function($scope, $filter) {
      var _filteredFonts, _lastPageCount = 0;

      $scope.page = {
        size: 30,
        count: 0,
        current: 0
      };

      $scope.providerKey = _createKey($scope.providerName);

      /**
       * Set the current page
       *
       * @param {Number} currentPage
       * @return {void}
       */
      $scope.setCurrentPage = function(currentPage) {
        $scope.page.current = currentPage;
      };

      /**
       * Get an array with the length similar to the
       * amount of pages we have. (So we can use it in a repeater)
       *
       * Also update the current page and the current amount of pages.
       *
       * @return {Array}
       */
      $scope.getPages = function() {
        _updatePageCount();
        var pages = new Array($scope.page.count);

        _updateCurrentPage();

        /* Display the page buttons only if we have at least two pages. */
        if (pages.length <= 1) {
          return [];
        }
        return pages;
      };

      /**
       * Check if this list is active
       *
       * @return {Boolean}
       */
      $scope.isActive = function() {
        return $scope.current.provider === $scope.providerName;
      };

      /**
       * Activate or deactivate the this List.
       *
       * @return {void}
       */
      $scope.toggle = function() {
        if ($scope.isActive()) {
          $scope.current.provider = undefined;
        } else {
          $scope.current.provider = $scope.providerName;
        }
      };

      /**
       * Calculate the amount of pages we have.
       *
       * @return {void}
       */
      function _updatePageCount() {
        _lastPageCount = $scope.page.count;

        if (!angular.isArray($scope.fonts)) {
          return 0;
        }

        if (_updateFilteredFonts()) {
          $scope.page.count = Math.ceil(_filteredFonts.length / $scope.page.size);
        }
      }

      /**
       * Apply the current filters to our internal font object.
       *
       * @return {Boolean}
       */
      function _updateFilteredFonts() {
        if (!angular.isArray($scope.fonts)) {
          _filteredFonts = 0;
          return false;
        }

        _filteredFonts = $filter('fuzzySearch')($scope.fonts, $scope.current.search);
        _filteredFonts = $filter('filter')(_filteredFonts, {category: $scope.current.category}, true);

        return true;
      }

      /**
       * Whenever the amount of pages is changing:
       * Make sure we're not staying on a page that does not exist.
       * And if we have a font selected, try to stay on the page of
       * that font.
       *
       * @return {void}
       */
      function _updateCurrentPage() {
        /* do nothing if the amount of pages hasn't change */
        if (_lastPageCount === $scope.page.count) {
          return;
        }

        /* try to get the complete current font object */
        var currentFont = fontsService.getFontByKey($scope.current.font, $scope.providerName);
        /* check if the current font is anywhere on our current pages */
        var index = _filteredFonts.indexOf(currentFont);

        /* If we have a font selected and it's inside the filter we use */
        if (currentFont && index >= 0) {
          /* go to this page */
          $scope.page.current = Math.ceil((index + 1) / $scope.page.size) - 1;
        } else {
          /* Just go to the last page if the current does not exist */
          if ($scope.page.current > $scope.page.count) {
            $scope.page.current = $scope.page.count-1;
          }
        }
      }
    }]
  };
}]);
