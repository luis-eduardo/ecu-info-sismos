angular.module('controllers').controller('MainController', ['$scope', '$ionicPlatform', '$ionicPopup', '$ionicLoading', 'QuakeService', 'GeoService', function ($scope, $ionicPlatform, $ionicPopup, $ionicLoading, QuakeService, GeoService) {

    $scope.initialize = function () {

        $ionicPlatform.ready(function () {

            init();

            if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    };

    $scope.getLocalDate = function (date) {
        var newDate = Date.parse(date + " GMT");
        return newDate;
    };

    $scope.getDistance = function (latitude, longitude) {
        return parseInt(GeoService.getDistance(latitude, longitude));
    };

    $scope.wasLow = function (magnitude) {
        return magnitude >= 0 && magnitude < 4.0;
    };

    $scope.wasMedium = function (magnitude) {
        return magnitude >= 4.0 && magnitude < 5.5;
    };

    $scope.wasHigh = function (magnitude) {
        return magnitude >= 5.5;
    };

    //Private methods
    init = function () {
        console.log("$ionicPlatform.ready");

        $ionicLoading.show({ template: 'Obteniendo coordenadas...' });
        GeoService.getCurrentLocation().then(function () {
            $ionicLoading.hide();
            loadQuakeMarkers();
        }).catch(function (reason) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ha ocurrido un error al tratar de obtener la ubicación del dispositivo.',
                template: reason
            });
        });
    };

    loadQuakeMarkers = function () {
        $ionicLoading.show({ template: 'Cargando datos...' })
        QuakeService.all().then(function (xmlDoc) {
            var x2js = new X2JS();
            var jsonObj = x2js.xml_str2json(xmlDoc);

            $scope.quakeMarkers = jsonObj.markers.marker;
            $ionicLoading.hide();
        }).catch(function (reason) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Ha ocurrido un error.',
                template: reason
            });
        });
    };
}]);