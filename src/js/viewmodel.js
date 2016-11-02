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
        if (!filter || filter == 0) {
            return markers();
        } else {
            return ko.utils.arrayFilter(markers(), function(i) {
                //console.log(i.genre == filter);
                //return i.genre == filter
                if (i.genre == filter) {
                    console.log(i);
                    return i.setMap(null);
                }


            });
        }
    });


}


// Activates knockout.js
ko.applyBindings(new ViewModel());