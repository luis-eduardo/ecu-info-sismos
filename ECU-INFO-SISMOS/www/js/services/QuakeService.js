angular.module('services').factory('QuakeService', ['$http', '$q', function ($http, $q) {

    return {

        all: function () {

            var deferred = $q.defer();

            $http.get('http://www.igepn.edu.ec/portal/ultimo-sismo/events.xml').success(function (data) {

                deferred.resolve(data);

            }).error(function () {

                deferred.reject("not found");

            });

            return deferred.promise;
        }

    };

}]);