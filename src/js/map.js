 // Create a map variable
     var map;
     // Function to initialize the map within the map div
     function initMap() {
       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.74135, lng: -73.99802},
         zoom: 14
       });
       // Create a single latLng literal object.
       var singleLatLng = {lat: 40.74135, lng: -73.99802};
       // TODO: Create a single marker appearing on initialize -
       var marker = new google.maps.Marker ({
        position: singleLatLng,
        map: map,
        title: "1st marker"
       });

       var infowindow = new google.maps.InfoWindow ({
        content: "content of infowindow"
       });

       marker.addListener("click", function(){
        infowindow.open(map, marker);

       });
       // Create it with the position of the singleLatLng,
       // on the map, and give it your own title!
       // TODO: create a single infowindow, with your own content.
       // It must appear on the marker
       // TODO: create an EVENT LISTENER so that the infowindow opens when
       // the marker is clicked!
     }