angular.module('services').factory('GeoService', ['$q', function ($q) {

    var API_KEY = "AIzaSyDd1R2d0jsnv4wVyCUyaZC9pqGfy10OOhg";

    var _currentLocation;

    var toRadians = function (Value) {
        return Value * Math.PI / 180;
    }

    return {

        getCurrentLocation: function () {

            var deferred = $q.defer();

            navigator.geolocation.getCurrentPosition(
              function (position) {
                  _currentLocation = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                  };

                  deferred.resolve(position);
              },
              function () {

                  deferred.reject("Error getting location");

              });

            return deferred.promise;
        },

        getLocationName: function (latitude, longitude) {

            var deferred = $q.defer();

            var uri = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + API_KEY;

            $http.get(uri).success(function (data) {

                deferred.resolve(data);

            }).error(function () {

                deferred.reject("not found");

            });

            return deferred.promise;
        },

        getDistance: function (latitude, longitude) {
            if (!_currentLocation) {
                return 0;
            }

            var R = 6371; // km
            var dLat = toRadians(latitude - _currentLocation.latitude);
            var dLon = toRadians(longitude - _currentLocation.longitude);
            var latitude1Rad = toRadians(_currentLocation.latitude);
            var latitudeRad = toRadians(latitude);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(latitude1Rad) * Math.cos(latitudeRad) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var d = R * c;

            return d;
        }

    };

}]);