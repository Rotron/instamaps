var app = angular.module('MapApp', [])
var controller = app.controller('MapController', ['$scope', function($scope)
{
  this.showPhotos = function(id)
  {
    var photos = getInstaPhotos(id);

  };

}]);

function getInstaPhotos(id)
{
  var token = window.location.hash.substring(14);
  var query = 'https://api.instagram.com/v1/locations/' + id + '/media/recent';
  $.ajax
  ({
    url: query,
    data:
    {
      access_token: token,
      format: "json"
    },
    success: function(data)
    {
      return (data);
    },
    dataType: "jsonp"
  });
}

function initMap()
{
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'),
  {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: true,
    zoom: 8
  });

  var marker = new google.maps.Marker(
  {
    position:  {lat: -34.397, lng: 150.644},
    map: map,
    title: 'Click to zoom',
    draggable: true
  });

  marker.addListener('dragend', function()
  {
    //when the marker is moved get the end position
    //query insta for locations at the point
    getLocations(marker.getPosition());
  });
}

function getLocations(latlong)
{
  var token = window.location.hash.substring(14);
  var lat = latlong['H'];
  var long = latlong['L'];
  var query = "https://api.instagram.com/v1/locations/search";
  $.ajax
  ({
    url: query,
    data:
    {
      lat: lat,
      lng: long,
      access_token: token,
      format: "json"
    },
    success: function(data)
    {
      var scope = $('.info').scope();
      scope.locations = data.data;
      scope.$apply();
    },
    dataType: "jsonp"
  });
}
