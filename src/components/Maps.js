import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import NoMapDisplay from './ErrorOnLoad';

const GOOGLE_MAP_KEY = "AIzaSyAh_Of5ZWIfTTrmLR9OmtJ2HmdKLUK-jRI";
const FS_CLIENT_ID = "XF4YCWZWIJV5TXGND421NTGU0ZVYMRYZ3GJBV2P03MSVX3GU";
const FS_SECRET_ID = "VUWTLVHAWMEF5S4IOHIARPSRKYTXEJRJU5VH2ZCYX1ZMZLWZ";
const FS_VERSION = "20180323";

class Maps extends Component {
    state = {
        map: null,
        markers: [],
        markerProps: [],
        activeMarker: null,
        activeMarkerProps: null,
        showingInfoWindow: false
    };

    componentDidMount = () => {}

    componentWillReceiveProps = (props) => {
        this.setState({firstDrop: false});

        // Change in the number of locations, so update the markers
        if (this.state.markers.length !== props.locations.length) {
            this.closeInfoWindow();
            this.updateMarkers(props.locations);
            this.setState({activeMarker: null});

            return;
        }

        // The selected item is not the same as the active marker, so close the info window
        if (!props.selectedIndex || (this.state.activeMarker && 
            (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
            this.closeInfoWindow();
        }

        // Make sure there's a selected index
        if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
            return;
        };

        // Treat the marker as clicked
        this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
    }

    mapReady = (props, map) => {
        // Save the map reference in state and prepare the location markers
        this.setState({map});
        this.updateMarkers(this.props.locations);
    }

    closeInfoWindow = () => {
        // Disable any active marker animation
        this.state.activeMarker && this
            .state
            .activeMarker
            .setAnimation(null);
        this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null});
    }

    getBusinessInfo = (props, data) => {
        // Look for matching resort
        return data
            .response
            .venues
            .filter(item => item.name.includes(props.name) || props.name.includes(item.name));
    }

    onMarkerClick = (props, marker, e) => {
        // Close open windows
        this.closeInfoWindow();

        // Fetch the FourSquare data for the selected resort
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT_ID}&client_secret=${FS_SECRET_ID}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });

        // Create props for the active marker
        let activeMarkerProps;
        fetch(request)
            .then(response => response.json())
            .then(result => {
                
                let resorts = this.getBusinessInfo(props, result);
                activeMarkerProps = {
                    ...props,
                    foursquare: resorts[0]
                };

                // fetch images from Fourthsquare if they are available
                if (activeMarkerProps.foursquare) {
                    let url = `https://api.foursquare.com/v2/venues/${resorts[0].id}/photos?client_id=${FS_CLIENT_ID}&client_secret=${FS_SECRET_ID}&v=${FS_VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            activeMarkerProps = {
                                ...activeMarkerProps,
                                images: result.response.photos
                            };
                            if (this.state.activeMarker) 
                                this.state.activeMarker.setAnimation(null);
                            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                            this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                        })
                } else {
                    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                    this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                }
            })
    }

    updateMarkers = (locations) => {
        // done when filtered
        if (!locations) 
            return;
        
        // reset markers on map
        this
            .state
            .markers
            .forEach(marker => marker.setMap(null));

        // add markers
        let markerProps = [];
        let markers = locations.map((location, index) => {
            let mProps = {
                key: index,
                index,
                name: location.name,
                position: location.pos,
                street: location.street,
                city: location.city,
                state: location.state,
                zip: location.zip,
                url: location.url
            };
            markerProps.push(mProps);

            let animation = this.state.fisrtDrop ? this.props.google.maps.Animation.DROP : null;
            let marker = new this
                .props
                .google
                .maps
                .Marker({position: location.pos, map: this.state.map, animation});
            marker.addListener('click', () => {
                this.onMarkerClick(mProps, marker, null);
            });
            return marker;
        })

        this.setState({markers, markerProps});
    }

    render = () => {
        const style = {
            width: '100%',
            height: '100%'
        }
        const center = {
            lat: this.props.lat,
            lng: this.props.lon
        }
        let amProps = this.state.activeMarkerProps;

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                google={this.props.google}
                zoom={this.props.zoom}
                style={style}
                initialCenter={center}
                onClick={this.closeInfoWindow}>
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.closeInfoWindow}>
                    <div>
                        <h3>{amProps && amProps.name}</h3>
                        <p>{amProps && amProps.street}</p>
                        <p>{amProps && amProps.city}, {amProps && amProps.state}</p>
                        <p>{amProps && amProps.zip}</p>
                        {amProps && amProps.url
                            ? (
                                <a href={amProps.url} className="web-link">Visit the website</a>
                            )
                            : ""}
                        {amProps && amProps.images
                            ? (
                                <div><img
                                    alt={amProps.name + " resort image"}
                                    src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix}/>
                                </div>
                            )
                            : ""
                        }
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({apiKey: GOOGLE_MAP_KEY, LoadingContainer: NoMapDisplay})(Maps)