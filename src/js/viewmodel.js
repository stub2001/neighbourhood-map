//ViewModel

function ViewModel() {
    var self = this;
    self.list = ko.observableArray(dataArray);
    self.locationSelect = function(loc) {
        google.maps.event.trigger(markers()[loc.id], 'click');
    }
}

// Activates knockout.js
ko.applyBindings(new ViewModel());