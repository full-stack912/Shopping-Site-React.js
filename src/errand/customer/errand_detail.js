import React from 'react';
import Header from "../../header/header";
import PropTypes from 'prop-types';
import {UserProfile} from "../../data/user_profile";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import {GoogleApiWrapper, Map, Marker, InfoWindow} from "google-maps-react";
import {Constants} from "../../rglobal/constants";
import StarRatings from "react-star-ratings";

import Loader from 'react-loader-spinner'
import ErrandReqItem from "../../data/errand_req_item";
import BikeMapModal from "../../bike/bike_map_modal";

class  ErrandRequestDetail extends React.Component{
    // google = this.props.google
    // bounds = new this.props.google.maps.LatLngBounds();

    state = {
        currentLocation : this.props.currentLocation,
        showingInfoWindow: false,
        activeMarker:{}
    }

    locations = [];
    pins = {
        my:require("../../assets/images/my_pin.png"),
        pickup:require("../../assets/images/origin_pin.png"),
        carrier:require("../../assets/images/carrier_pin.png"),
        destination:require("../../assets/images/receiver_pin.png"),
    };


    constructor(props){
        super(props)

    }


    componentDidMount() {

        const {
            currentLocation,
            selPickLocation,
            selDestLocation,
            selCarrier
        } = this.props

    }

    onClickMapMarker=(props, marker, e)=>{
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    fetchPlaces = (mapProps, map) => {
        if(this.state.currentLocation === null){
            return
        }
        const {google} = mapProps;
        const service = new google.maps.places.PlacesService(map);
        this.map = map;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        let currentLocation = new google.maps.LatLng(this.state.currentLocation.lat, this.state.currentLocation.lng);
        let mapOptions = {
            zoom:7,
            center: this.state.currentLocation
        }

        this.directionsDisplay.setMap(this.map);
        // this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));


    }

    getRandomLocation = (location)=>{
        let deltaLat =  Math.random()*0.01
        let deltaLng =  Math.random()*0.01
        // console.log(deltaLat, deltaLng)
        return {
            lat:location.lat + deltaLat,
            lng: location.lng + deltaLng,
        };
    }
    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });
    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };
    displayMarkers = (pickLocation, destLocation, curLocation, carrierLocation) => {

        // if(this.state.currentLocation === null){
        //     return
        // }

        let sampleData = new ErrandReqItem({
        });

        let locations = [curLocation, pickLocation, destLocation,  carrierLocation]
        let names = ['My Position','Pickup','Destination','Carrier']
        let pins = [this.pins.my, this.pins.pickup, this.pins.destination,  this.pins.carrier]
        let anchors = [
            new this.props.google.maps.Point(25,25),
            new this.props.google.maps.Point(18,50),
            new this.props.google.maps.Point(18,50),
            new this.props.google.maps.Point(18,50),
        ];
        let sizes = [
            new this.props.google.maps.Size(50,50),
            new this.props.google.maps.Size(36,50),
            new this.props.google.maps.Size(36,50),
            new this.props.google.maps.Size(36,50),
        ];

        return locations.map((store, index) => {
            return <Marker key={index}
                           name={names[index]}
                           id={index}
                           position={{
                               lat: store.lat,
                               lng: store.lng
                           }}
                           icon={{
                               // url: require("../assets/images/moto2.png"),
                               url: pins[index],
                               anchor: anchors[index],
                               scaledSize: sizes[index]
                           }}
                           onClick={this.onClickMapMarker} />
        })
    }

    showMapForRequest = ()=>{

        const {
            isShowCustomer,
            selCarrier,
            selPickupAddr,
            selDestAddr,
            selPickLocation,
            selDestLocation,
            selSenderName ,
            selSenderPhone,
            selRcverName ,
            selRcverPhone,
            selParcelDesc,
            selDeliveryDesc,
            bounds
        } = this.props;
        console.log('bounds in details ', bounds);
        const mapStyles = {
            width: '90%',
            height:'500px',
        };

        let curLocation = this.state.currentLocation ? this.state.currentLocation : {lat: 0, lng:0};
        // let mapCenter = this.state.mapCenter ? this.state.mapCenter : {lat : 0, lng:0};

        return (
            <Map
                ref={ref=>this.mapRef = ref}
                onClick={this.onMapClicked}
                google={this.props.google}
                zoom={5}
                style={mapStyles}
                initialCenter={{ lat: curLocation.lat, lng: curLocation.lng }}
                // center={{
                //     lat: curLocation.lat,
                //     lng: curLocation.lng
                // }}
                onReady={this.fetchPlaces}
                // onClick={this.mapClicked}
                bounds={bounds}
            >
                {this.displayMarkers(selPickLocation, selDestLocation, curLocation, {lat:selCarrier.lat, lng: selCarrier.lng})}
                <InfoWindow
                    marker={this.state.activeMarker}
                    // onOpen={this.windowHasOpened}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onInfoWindowClose}
                >
                    <div>
                        <span className="text-info font-weight-bold">{this.state.selectedPlace  ? this.state.selectedPlace.name : 'No selected'}</span>
                    </div>
                </InfoWindow>
            </Map>
        )
    }

    onSubmit = ()=>{

    }

    render(){

        const {
            errandItem,
            // isShowCustomer,
            selCarrier,
            selPickupAddr,
            selDestAddr,
            selPickLocation,
            selDestLocation,
            selSenderName ,
            selSenderPhone,
            selRcverName ,
            selRcverPhone,
            selParcelDesc,
            selDeliveryDesc,
        } = this.props;
        let carrierName = '';
        if(selCarrier != null){
            console.log(selCarrier.user.first_name, selCarrier.user.last_name)
            let fName = selCarrier.user.first_name;
            let lName = selCarrier.user.last_name;
            carrierName = Constants.ucFirst(fName)+' '+Constants.ucFirst(lName)
        }else{
            return null
        }


        let distance = Constants.distance(selPickLocation.lat, selPickLocation.lng,  selDestLocation.lat, selDestLocation.lng)
        let price = selCarrier.price_per_mile * distance;
        price = Math.round(Math.max(price , selCarrier.min_price)*100)/100

        let avatar = require('../../assets/images/avatar_empty.png');

        let isShowCustomer = true;
        if( global.curUser.isCustomer() ){
            isShowCustomer = false;
            if(   selCarrier && selCarrier.user && selCarrier.user.photo){
                avatar = {uri: selCarrier.user.photo}
            }
        }else{
            isShowCustomer = true;
            if( errandItem && errandItem.customer && errandItem.customer.photo){
                avatar = {uri: errandItem.customer.photo}
            }
        }

        let customer = errandItem ? errandItem.customer : global.curUser;
        let rider = errandItem ? errandItem.rider : null;

        let dist = null;
        if( errandItem ){
            dist = Constants.distance(errandItem.customer_lat, errandItem.customer_lng,  rider.staff.lat, rider.staff.lon).toFixed(2) + ' miles'

        }else{
            dist = selCarrier.distance + ' ' + selCarrier.unit
        }

        return (
            <div>
                <div className="layer-stretch">
                    <div className="layer-wrapper">
                        <div className="row">
                            <div className="col-md-7">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">{isShowCustomer ? 'Customer' : 'Carrier'} </div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            <table className="table table-bordered table-striped">
                                                <tbody>
                                                <tr>
                                                    <td colSpan={2} align={'center'} valign={'center'}>
                                                        <img className="w-25 rounded" src={avatar}/>
                                                        <p>{isShowCustomer && errandItem ? errandItem.customer.first_name+ ' ' + errandItem.customer.last_name : carrierName}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Email: </td><td>{ errandItem ? ( isShowCustomer ? customer.email : rider.email ) : selCarrier.user.email}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phone: </td>
                                                    <td>

                                                        <div className="text-info">
                                                            <a href={ errandItem ? (isShowCustomer ? 'tel://'+customer.phone_number : 'tel://'+rider.phone_number) : 'tel://'+selCarrier.user.phone_number}>
                                                                { errandItem ? (isShowCustomer ? customer.phone_number : rider.phone_number) : selCarrier.user.phone_number}
                                                                <i className="fa fa-phone fa-lg ml-2"></i>
                                                            </a>
                                                        </div>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Address: </td><td>{ errandItem==null ? selCarrier.address : (rider && rider.staff ? rider.staff.address : '')}</td>
                                                </tr>
                                                <tr>
                                                    <td>In Distance: </td><td>{dist}</td>
                                                </tr>
                                                <tr>
                                                    <td>Price: </td><td>{Constants.CURRENCY_CODE} {price}</td>
                                                </tr>

                                                </tbody>
                                            </table>

                                        </div>
                                    </div>

                                </div>

                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Errand Request</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            <table className="table table-bordered table-striped">
                                                <tbody>
                                                <tr>
                                                    <td>Pickup Address</td><td>{selPickupAddr}</td>
                                                </tr>
                                                <tr>
                                                    <td>Destination</td><td>{selDestAddr}</td>
                                                </tr>
                                                <tr>
                                                    <td>Sender</td><td>{selSenderName}</td>
                                                </tr>
                                                <tr>
                                                    <td>Sender Phone</td>
                                                    <td>

                                                        <div className="text-info">
                                                            <a href={'tel://'+selSenderPhone}>
                                                                {selSenderPhone}
                                                                <i className="fa fa-phone fa-lg ml-2"></i>
                                                            </a>
                                                        </div>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Receiver</td><td>{selRcverName}</td>
                                                </tr>
                                                <tr>
                                                    <td>Receiver Phone</td>
                                                    <td>
                                                        <div className="text-info">
                                                            <a href={'tel://'+selRcverPhone}>
                                                                {selRcverPhone}
                                                                <i className="fa fa-phone fa-lg ml-2"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Parcel Description</td><td>{selParcelDesc}</td>
                                                </tr>
                                                <tr>
                                                    <td>Additional Description</td><td>{selDeliveryDesc}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Location</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            <div className="row" style={{height:'500px'}}>
                                            {this.showMapForRequest()}
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>

                </div>

            </div>
        );
    }

}

ErrandRequestDetail.propTypes = {
    // requestData : PropTypes.object.isRequired,
    isShowCustomer : PropTypes.bool.isRequired
}
ErrandRequestDetail.defaultProps = {
    isShowCustomer: false
}
export default ErrandRequestDetail

// export default GoogleApiWrapper({
//     apiKey: Constants.GOOGLE_API_KEY
// })(ErrandRequestDetail);

