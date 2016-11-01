//ViewModel

function ViewModel() {
    var self = this;
    self.list = ko.observableArray(dataArray);
    self.currentFilter = ko.observable();
    self.locationSelect = function(loc) {
        google.maps.event.trigger(loc, 'click');
    };


    self.filterProducts = ko.computed(function() {

        if (!self.currentFilter()) {
            //console.log('nofilter');
            return markers();
        } else {
            return ko.utils.arrayFilter(markers(), function(prod) {

                if (prod.genre == !self.currentFilter()) {

                    return prod.setMap(null);
                    return prod.display = "hide";

                }
                //return prod.genre == self.currentFilter()
            });
        }
    });


    self.filter = function(genre) {
        self.currentFilter(genre);

    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers().length; i++) {
            markers()[i].setMap(map);
        }
    }

    self.unfilter = function() {
        setMapOnAll(map);
    }
}


// Activates knockout.js
ko.applyBindings(new ViewModel());