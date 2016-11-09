//ViewModel

function ViewModel() {
    var self = this;

    self.list = ko.observableArray(dataArray);
    self.currentFilter = ko.observable();
    self.filters = ko.observableArray([0, 1]);
    self.filter = ko.observable('');

    self.locationSelect = function(loc) {
        google.maps.event.trigger(loc, 'click');
    };

    self.filteredItems = ko.computed(function() {
        var filter = self.filter();
        if (!filter || filter === 0) {

            // SHOW ALL MARKERS WHEN FILTER RESETS
            markers().forEach(function(marker) {
                marker.setVisible(true);
            });
            return markers();

        } else {
            return ko.utils.arrayFilter(markers(), function(i) {
                // CREATE MATCH VARIABLE TO USE TO SET MARKER VISIBILITY
                var match = i.genre == filter;
                i.setVisible(match);
                //close any open infowindows
                if (infowindow) {
                    infowindow.close();
                }
                return match;

            });
        }
    });


}

// Activates knockout.js
ko.applyBindings(new ViewModel());