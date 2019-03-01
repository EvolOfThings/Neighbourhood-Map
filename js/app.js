
//Interesting places in Bengaluru
//////////////////   Model  \\\\\\\\\\\\\\\\\\\\
let places = [
    {
        title: 'Bangalore Palace',
        location: {
            lat: 12.595470,
            lng: 77.353157
        }
    },{
        title: 'Lal Bagh Botanical Garden',
        location: {
            lat: 12.948228,
            lng: 77.586002
        }
    },{
        title: 'Nandi Hills',
        location: {
            lat: 0.104680,
            lng: 35.183159
        }
    },{
        title: 'Cubbon Park',
        location: {
            lat: 12.976347,
            lng: 77.592926
        }
    },{
        title: 'Vidhana Soudha',
        location: {
            lat: 12.982030,
            lng: 77.593536
        }
    },{
        title: 'Bannerghatta National Park',
        location: {
            lat: 12.800285,
            lng: 77.577049
        },
    },{
        title: 'Jawaharlal Nehru Planetarium',
        location: {
            lat: 12.984847,
            lng: 77.589619
        }
    },{
        title: 'Sankey Tank',
        location: {
            lat: 13.009888,
            lng: 77.574004
        }
    }
];

/////////////////   Initialize the map   \\\\\\\\\\\\\\\\\\\\
let map;
initMap = () =>  {
     "use strict"
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 12.9716,
            lng: 77.5946 
        },
        zoom: 14
    });

    const viewmodel = new ViewModel();
    ko.applyBindings(viewmodel);
};
 


        
///////////////////   ViewModel   \\\\\\\\\\\\\\\\\\\\

ViewModel = () => {
    let self = this;
    self.locations = ko.observableArray(); //array of locations
    self.search = ko.observable(''); // query
    self.markers = [];

    
// when marker is clicked, the infowindow is populated
populateInfoWindow = (marker, infowindow) => {
    if(infowindow.marker != marker) {
        infowindow.marker = marker;
        // infowindow.addListener('clickclose', () => infowindow.marker = null); 

        //Foursquare API request
        let client_ID = 'FDGCRKRLYS42R3NUFTQTFB5PFCQ1YP0GOHBTBBXWYWEJM2QD';
        let client_secret = '311TMOJ0BLVKHZ5PVU4GLLKV4M5N33DNY0GBHZ3YY5Z2DHWB';
        let loc = marker.position.lat() + ',' + marker.position.lng();

        let foursquareURL = 'https://api.foursquare.com/v2/venues/search?11=' +
                            loc +
                            '&client_id=' + client_ID + 
                            '&client_secret=' + client_secret + 
                            '&v=20161129&m=foursquare';
            $.ajax({
                url: foursquareURL,
                dataType: 'jsonp',
                async: false,
                success: (data) => {
                    let details = {id: "", name: "", address: ""};
                    details.name = data.response.venues[0].name;
                    details.id = data.response.venues[0].id;
                    details.address = data.response.venues[0].location.formattedAddress;

                    infowindow.setContent('<div>' + details.name + '</div>' + '<div>Address:' + details.address + '</div>');

                    bounceAnimation(marker);
                    infowindow.open(map, marker);

                error: () => {
                    infowindow.setContent('<div>Unable to get the data</div>');
                }
            }
        });

        infowindow.addListener('closeclick', () => { infowindow.marker = null; }); //to clear the marker
    }
}
}

bounceAnimation = (marker) => {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => { marker.setAnimation(null); }, 700);
    }
}








googleMapError = () => {
    $('#map').html('Google map could not load, try again.')
}