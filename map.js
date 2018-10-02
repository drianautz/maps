const Locations = [
    {lat: -38.050718, lng: 145.2591823},
    {lat: -37.978088, lng: 145.3966413},
    {lat: -38.2428981, lng: 145.2757047},
    {lat: -38.2886326, lng: 145.6648911},
    {lat: -38.0295947, lng: 145.0823671},
]


// Apps JS Comment
//  - Line 14776
//  - Line 14677


let Map

function maps() {
    if (document.getElementById('office-map')) {
        Map = new google.maps.Map(document.getElementById('office-map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 14,
            styles: [{"elementType": "geometry", "stylers": [{"color": "#f5f5f5"}]}, {
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#616161"}]
            }, {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#f5f5f5"}]
            }, {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#bdbdbd"}]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#eeeeee"}]
            }, {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#e5e5e5"}]
            }, {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}]
            }, {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#757575"}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#dadada"}]
            }, {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#616161"}]
            }, {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9e9e9e"}]
            }, {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{"color": "#e5e5e5"}]
            }, {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{"color": "#eeeeee"}]
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#c9c9c9"}]
            }, {"featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#9e9e9e"}]}]
        })
    }
}

$(document).ready(() => {
    maps()

    const bounds = new google.maps.LatLngBounds()
    // let infowindow_open
    let MarkerFocus
    let Markers = []

    // Clustering
    const MarkerCluster = new MarkerClusterer(Map, Markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})

    //Icon Marker Data
    const IconMarker = {
        Big: '/assets/img/map-big.png',
        Small: '/assets/img/map-small.png',
    }

    function setActiveMarker(el, marker) {
        if (MarkerFocus) MarkerFocus.setIcon(IconMarker.Small) // change latest marker to small

        const marker_selected = typeof marker === 'number'
            ? Markers[marker]
            : marker

        marker_selected.setIcon(IconMarker.Big)
        MarkerFocus = marker_selected

        $('.maps__item').removeClass('marker-active')
        el.addClass('marker-active')
    }


    // Scroll Content Container
    const scroll_container = $('.scroll-content')
    const scroll_container_position = scroll_container[0].getBoundingClientRect().top

    // Bind Data to Each Item sidebar
    $('.maps__item').each(function () {
        const position = $(this)[0].getBoundingClientRect().top - scroll_container_position
        $(this).attr('position-top', position)
    })


    Locations.forEach((loc, key) => {
        const marker = new google.maps.Marker({
            position: loc,
            map: Map,
            icon: IconMarker.Small,
            title: `Map ${key}`,
        })

        // const infowindow = new google.maps.InfoWindow({
        //     content: `Map Infowindow ${key}`
        // })

        // marker Listener Click
        marker.addListener('click', function () {

            // To Close other infowindow if open
            // if (infowindow_open) infowindow_open.close()
            // infowindow_open = infowindow

            // infowindow.open(Map, marker)

            const el = $('.maps__item').eq(key) // sidebar left item by Index
            setActiveMarker(el, marker)

            Map.panTo(marker.getPosition()) // set map focus to marker

            // Scroll left sidebar
            const position = el.attr('position-top')
            scroll_container.scrollTop(position)

            MarkerFocus = marker
            marker.setIcon(IconMarker.Big)

        })


        bounds.extend(marker.position)
        Markers.push(marker)
    })


    MarkerCluster.addMarkers(Markers)
    MarkerCluster.redraw()

    Map.fitBounds(bounds) // set map center all marker


    // Sidebar Left

    $('.maps__item').on('click', function () {

        // get index of sidebar item, change this on your listener
        const index = $('.maps__item').index(this)
        // Match location with selected index
        const selected_marker = Markers[index]

        if (!selected_marker) return // list location only 4 if null return

        setActiveMarker($(this), index) // set active marker

        // Map.setZoom(16) // set zoom optional
        Map.panTo(selected_marker.getPosition()) // set map focus to marker

    })
})

