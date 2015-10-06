var marker;
var map;
var app;
var controller;

function initMap()
{
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'),
  {
    center: {lat: -37.8136, lng: 144.9631},
    scrollwheel: true,
    zoom: 8
  });

  marker = new google.maps.Marker(
  {
    position:  {lat: -37.8136, lng: 144.9631},
    map: map,
    title: 'Click to zoom',
    draggable: true
  });

  marker.addListener('dragend', function()
  {
    //when the marker is moved get the end position
    //query insta for locations at the point
    $('body').scope().getLocations(marker.getPosition());
  });
}

//Angular code
app = angular.module('MapApp', ['ngResource'])
.config(['$resourceProvider', function($resourceProvider)
{
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])
.controller('MapController', ['$scope', '$http', '$resource',  function($scope, $http, $resource)
{

  var instaLocations = $resource
  (
    "https://api.instagram.com/v1/locations/search",
    {
      callback: "JSON_CALLBACK"
    },
    {
      getLocations:
      {
        method: "JSONP"
      }
    }
  );
  var instaPhotos = $resource
  (
    'https://api.instagram.com/v1/locations/:id/media/recent',
    {
      id: '@id',
      callback: "JSON_CALLBACK"
    },
    {
      getPhotos:
      {
        method: "JSONP"
      }
    }
  );
  $scope.getLocations = function(latlong)
  {
    var token = window.location.hash.substring(14);
    var lat = latlong.lat();
    var long = latlong.lng();
    var locations = instaLocations.getLocations
    (
      {
        lat: lat,
        lng: long,
        access_token: token
      },
      function(data)
      {
        $scope.locations = locations.data;
      }
    );
  }
  $scope.showPhotos = function(id)
  {
    var token = window.location.hash.substring(14);
    var photos = instaPhotos.getPhotos
    (
      {
        id: id,
        access_token: token
      },
      function(data)
      {
        $scope.photos = data.data;
      }
    );
  };
}]);
