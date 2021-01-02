import React from 'react';
// import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import StarRatings from 'react-star-ratings';
import Loader from 'react-loader-spinner'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/

import {Animated} from "react-animated-css";    

import {Constants} from "../../rglobal/constants";
import RestAPI from "../../global/RestAPI";
import {SubLoader} from "../../global/SubLoader";
import { DistanceTimeReq, GetPrice } from "../../bike/bike_dashboard_pages/bike_trips"

export const RiderCustomerDistance = props => {
    const { currentLocation, customer_lat, customer_lng  } = props
    let dist =   Constants.distance(currentLocation.lat, currentLocation.lng, customer_lat, customer_lng, 'K')
    let time = dist / 60
    return (
        <div className="comment-post text-default">                            
            { 'Customer is in ' + dist.toFixed(2) + 'Km,  can arrive in about '+ Constants.secsToHumanTime( time * 3600 ) }
        </div>
    )
}



class  RiderRequest extends React.Component{

    mapRef = null;
    watchID = null;
    map = null;

    directionsService = null;
    directionsDisplay = null;

    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            rating:0,
            activeTab : 0,  // 0: newRequest, 1: Upcoming , 2: Past
            selRequest: null,
            upcomingList:[],
            pastList:[],
            newRequests : [],
            curPageNo:0,
            mapCenter:{
                lat: 47.49855629475769,
                lng: -122.141844169
            },
            currentLocation:{
                lat: 47.49855629475769,
                lng: -122.141844169
            },
        };

    }

    componentWillUnmount() {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchID);
        }
    }

    componentDidMount() {
        this.loadingRequest()
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                // let bikeData = this.getSampleData(pos.coords)

                this.setState({
                    mapCenter:{
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                    // bikes: bikeData
                })
                this.getBounds()
                // console.log('Current location from browser>', this.state.currentLocation)
            })

            this.watchID = navigator.geolocation.watchPosition(position =>{
                // const lastPosition = JSON.stringify(position);
                const coords = position.coords;

                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                });
            })
        }

    }

    loadingRequest=()=>{

        this.setState({isLoading: true})
        RestAPI.getRiderRequests(10, this.state.curPageNo, (res, err)=>{

            this.setState({ isLoading : false })

            if(err !== null){
                alert('Failed to load data, try again.')
                return
            }

            if(res.success === 1){
                let isShowEmpty = (res.data.upcoming.length + res.data.pasts.length) <= 0
                console.log(res.data.newRequests)
                this.setState({
                    upcomingList: res.data.upcoming,
                    pastList: res.data.pasts,
                    newRequests: res.data.newRequests,
                    isShowEmpty: isShowEmpty
                })

            }else{
                alert('Some issues are there, please try to load again.')
                return
            }
        })

    }

    getBounds = (locations)=>{
        let bounds = new this.props.google.maps.LatLngBounds();
        bounds.extend(this.state.currentLocation);
        // let count = 1;
        // let minLat = 0;
        if(locations){
            locations.forEach(location=>{
                bounds.extend(location);
                // count ++;
            })
        }
        this.setState({
            bounds: bounds
        })
        if(this.map){
            // alert('fit->  count> '+count)
            setTimeout(()=>{
                this.map.fitBounds(bounds)
            }, 500)
        }
    }

    onClickRequestMapView = (item)=>{

        let pos1 = {lat: parseFloat(item.lat1) , lng: parseFloat(item.lng1) }
        let pos2 = {lat: parseFloat(item.lat2) , lng: parseFloat(item.lng2)}
        let posCustomer = {lat: parseFloat(item.customer_lat), lng: parseFloat(item.customer_lng)}
        this.setState({
            selRequest: item,
        })

        this.calcRoute(pos1, pos2)
        this.getBounds([posCustomer, pos1, pos2])
    }

    showUpcomingItem = (data, index)=>{

        return (
            <li key={index}>
                <div className="row">
                    <div className={'col-12 text-right'}>
                        <span className = {"text text-default text-sm pl-2"}>ID: { '#' + data.id }</span>
                    </div>
                    <div className="col-2 hidden-xs-down pr-0 comment-img">
                        <img style={{width:80, height:80, borderRadius:10, resizeMode:'contain'}} src={data.customer && data.customer.avatar ? {uri: data.customer.avatar} : require('../../assets/images/avatar_empty.png')} alt=""/>
                        
                        {(data.status === 'requested' || data.status == null) &&
                        <button
                            onClick={()=>{
                                let reqData = {
                                    rider_id : global.curUser.user_id,
                                    temp_req_id : data.id,
                                    currency_code : Constants.CURRENCY_CODE,
                                    // amount : Constants.convMToKm(data.trip_distance) * global.curUser.bikeProfile.price_per_mile,
                                    amount: GetPrice(data),
                                    is_errand : 0
                                }
                                this.setState({isLoading:true})
                                RestAPI.acceptBikeReqByRider(reqData, (res, err)=>{
                                    this.setState({isLoading:false})
                                    if(err!== null){
                                        alert('Failed to accept request, try again.')
                                        return
                                    }
                                    if(res.success === 1){
                                        this.loadingRequest()
                                        this.setState({activeTab: 1})
                                    }else{
                                        if(res.err_code == RestAPI.ErrCode.RegisterFailed){
                                            alert('This request was accepted by other rider, please try to check other request.')
                                            return
                                        }
                                        alert('Failed to accept, try again after a moment.')
                                        return
                                    }
                                })
                                // RestAPI.acceptRequest(data.id, (res, err)=>{
                                //     this.setState({isLoading:false})
                                //     if(err!== null){
                                //         alert('Failed to accept request, try again.')
                                //         return
                                //     }
                                //     if(res.success === 1){
                                //         this.loadingRequest()
                                //     }else{
                                //         alert('Failed to accept, try again after a moment.')
                                //         return
                                //     }
                                // })
                            }}
                            className="btn btn-outline btn-sm btn-success btn-pill btn-outline-1x m-1">Accept
                        </button>
                        }
                        {data.status === 'requested' || data.status === 'accepted' ?
                            <button
                                onClick={()=>{
                                    let res = window.confirm('Are you sure reject this request?')
                                    if(res){
                                        this.setState({isLoading:true})
                                        RestAPI.rejectRequest(data.id, (res, err)=>{
                                            this.setState({isLoading:false})
                                            if(err!== null){
                                                alert('Failed to reject request, try again.')
                                                return
                                            }
                                            if(res.success === 1){
                                                this.loadingRequest()
                                            }else{
                                                alert('Failed to reject, try again after a moment.')
                                                return
                                            }
                                        })
                                    }
                                }}
                                className="btn btn-outline btn-sm btn-primary btn-pill btn-outline-1x m-1">
                                Reject
                            </button>
                            : null
                        }
                    </div>
                    <div className="col-10 comment-detail text-left">
                        <div className="">
                            {
                                data.customer ? 
                                <span>{Constants.ucFirst(data.customer.first_name)} &nbsp; {Constants.ucFirst(data.customer.last_name)}</span>
                                : <span>No Customer</span>
                            }
                            
                            <span>{data.updated_human_diff} {data.status && Constants.ucFirst(data.status)}</span>
                        </div>
                        <div className="comment-post">
                            {
                                data.customer && 
                                <div className="rating pt-1">
                                    <StarRatings
                                        rating={data.customer.reviews_count > 0  && data.customer.reviews_mark >= 0 ? parseFloat(data.customer.reviews_mark) : 0}
                                        starRatedColor="#ff654d"
                                        numberOfStars={5}
                                        // name='rating'
                                        starDimension="20px"
                                        starSpacing="3x"
                                    />
                                    ({data.customer.reviews_count}reviews)
                                    {/*{this.render5Stars(review)}*/}
                                </div>
                            
                            }
                        
                        </div>
                        {
                            data.customer && 
                            <div className="">
                                <span className="text-info">Phone:</span> {data.customer.phone_number}
                            </div>
                        }
                        
                        <div className="comment-post">
                            <span className="text-info">From:</span> {data.address1}
                        </div>
                        <div className="comment-post">
                            <span className="text-info">To:</span> {data.address2}
                        </div>
                        {/* <div className="comment-post  text-info">
                            Price: {Constants.CURRENCY_CODE} {data.amount || Constants.convMToKm(data.trip_distance) * global.curUser.bikeProfile.price_per_mile}, Time: {Constants.secsToHumanTime(data.trip_duration_secs) },  Distance: {Constants.convMToKm(data.trip_distance) }Km
                        </div> */}
                        <DistanceTimeReq data={data}/>
                        <RiderCustomerDistance currentLocation = { this.state.currentLocation } customer_lat = {data.customer_lat || data.user_lat} customer_lng = { data.customer_lng || data.user_lng } />
                        <div className={data.payment_status === 'paid' ? "comment-post text-success" :  "comment-post text-primary"}>
                            {data.payment_status === 'paid' ? 'PAID' : 'NOT PAID'}
                        </div>
                        <div className="comment-post text-right">
                            <span className="text-info">{data.updated_human_diff} {data.status && Constants.ucFirst(data.status)}</span>
                        </div>
                        <div style={{position:'absolute', right:'10px', top:'5px', color:'#ff654d'}}>
                            <a
                                data-toggle="modal"
                                data-target={"#mapModal"}
                                href="#" className="mr-3"
                                onClick={()=>{
                                    this.onClickRequestMapView(data)
                                }}
                            >
                                <i className="fa fa-map-marker fa-lg  fa-info-circle"></i>  
                            </a>
                            {
                                data.customer && 
                                <a href={"tel:"+data.customer.phone_number} className="">
                                    <i className="fa fa-phone fa-lg  fa-info-circle"></i>
                                </a>
                            }
                            
                            {/*<a href="#" className="mr-3">*/}
                            {/*    <i className="fa fa-trash fa-lg  fa-info-circle"></i></a>*/}
                            {/*<a href="#" className="">*/}
                            {/*    <i className="fa fa-trash fa-lg  fa-info-circle"></i></a>*/}
                        </div>
                    </div>
                </div>
            </li>
        );
    }
    showUpcomingList = (dataList)=>{
        let list = [];
        console.log(dataList)
        dataList.map((item, index)=>{
            list.push(this.showUpcomingItem(item, index))
        });
        return list
    }
    showPastItem= (data, index) => {
        
        return (
            <li key={index}>
                <div className="row">
                    <div className = {"col-12 text-right"}>
                        <span className = {"text text-default text-sm pl-2"}>ID: { '#' + data.id }</span>
                    </div>                   
                    <div className="col-2 hidden-xs-down pr-0 comment-img">
                    {/* <img style={{width:80, borderRadius:10}} src={bikePhoto} alt="" /> */}
                        <img style={{borderRadius:'50%', width:60,height:60}} src={data.customer.avatar || require('../../assets/images/avatar_empty.png')} alt=""/>
                        
                    </div>
                    
                    <div className="col-10 comment-detail text-left">
                        <div className="comment-meta">
                            <span>{Constants.ucFirst(data.customer.first_name)} &nbsp; {Constants.ucFirst(data.customer.last_name)}</span>
                            <span>{data.updated_human_diff} {Constants.ucFirst(data.status)}</span>
                        </div>
                        <div className="comment-post">
                            <div className="rating pt-1">

                                <StarRatings
                                    rating={data.customer.reviews_count > 0  && data.customer.reviews_mark >= 0  ? parseFloat(data.customer.reviews_mark) : 0}
                                    starRatedColor="#ff654d"
                                    numberOfStars={5}
                                    // name='rating'
                                    starDimension="20px"
                                    starSpacing="3x"
                                />
                                ({data.customer.reviews_count}reviews)
                                {/*{this.render5Stars(review)}*/}
                            </div>
                        </div>
                        <div className="comment-post">
                            <div className="row">
                            <div className="col-md-1 text-right">
                                From:
                            </div>
                            <div className="col-md-11">
                                {data.address1}
                            </div>
                            </div>
                            <div className="row">
                            <div className="col-md-1 text-right">
                                To:
                            </div>
                            <div className="col-md-11">
                                {data.address2}
                            </div>
                            </div>
                        </div>
                        <DistanceTimeReq data={data}/>
                        <RiderCustomerDistance currentLocation = { this.state.currentLocation } customer_lat = {data.customer_lat} customer_lng = { data.customer_lng } />
                        <div className="comment-post">
                            {data.rider_comment === null || data.rider_comment === '' ? '' :
                                <div>
                                    <i className="far fa-comment-alt fa-lg text-primary"></i>&nbsp;{data.rider_comment}
                                    <br/>
                                </div>
                            }


                        </div>
                        <div className="comment-post">
                        <div className="rating pt-1 " style={{width:'120px'}}>
                            {/*{this.render5Stars(review)}*/}
                            <StarRatings
                                rating={ data.rider_mark!= null ? parseFloat(data.rider_mark) : 0}
                                starRatedColor="#ff654d"
                                numberOfStars={5}
                                starDimension="18px"
                                starSpacing="2px"
                            />
                        </div>
                        </div>

                        <ul className="comment-action pt-1" style={{display: data.customer_comment == null || data.customer_comment == '' ? '' : 'none'}}>
                            <li>
                                <a href="#"
                                   className="text-primary"
                                   data-toggle="modal"
                                   data-target={"#reviewModal"+data.id}>
                                    <i className="far fa-comment-alt fa-lg text-primary"></i>&nbsp; Leave comment to Customer
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        );
    }
    
    showPastList = (dataList)=>{
        let list = [];
        console.log(dataList)
        dataList.map((item, index)=>{
            list.push(this.showPastItem(item, index))
        });
        return list
    }
    displayMarkers = () => {

        let locations = [this.state.currentLocation]
        let pins = [require("../../assets/images/my_pin.png")];
        let anchors = [new this.props.google.maps.Point(25,25)];
        let sizes = [new this.props.google.maps.Size(50,50)];

        if(this.state.selRequest && this.state.selRequest.customer_lat && this.state.selRequest.customer_lng){
            let customerLocation = {lat: this.state.selRequest.customer_lat , lng: this.state.selRequest.customer_lng}
            locations.push(customerLocation)
            pins.push(require("../../assets/images/customer_pin.png"))
            anchors.push(new this.props.google.maps.Point(25,50))
            sizes.push(new this.props.google.maps.Size(50,50))
        }
        return locations.map((store, index) => {
            return <Marker key={index}
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
                   onClick={()=>{this.onClickMapMarker(store)}} />
        })
    }
    changeRating = ( newRating, name )=>{
        this.setState({
            rating: newRating
        });
    }

    fetchPlaces = (mapProps, map) => {
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

    mapClicked=(mapProps, map, clickEvent) =>{
        console.log(clickEvent);
    }

    calcRoute = (pos1, pos2, travelMode='DRIVING')=>{
        console.log('CalcRoute request pos :', pos1, pos2);
        if(pos1 === null || pos1 === ''){
            window.alert('Confirm', 'Please input start address correctly.');
            return;
        }
        if(pos2 === null || pos2 === ''){
            window.alert('Confirm', 'Please input destination address correctly.');
            return;
        }

        // DRIVING (Default)
        //     BICYCLING
        //     TRANSIT
        //     WALKING

        let request = {
            origin:pos1,
            destination:pos2,
            travelMode: travelMode
        };
        this.setState({isLoading : true,  duration :'- - -',})
        this.directionsService.route(request, (response, status) => {
            this.setState({isLoading : false})
            if (status === 'OK') {
                // this.setState({duration: response.leave()})
                let isFoundRoute =  false;
                if(response.routes && response.routes.length > 0 ){
                    if(response.routes[0].legs && response.routes[0].legs.length > 0){
                        let duration = response.routes[0].legs[0].duration.text+' on '+travelMode || ''
                        this.setState({duration: duration})
                        isFoundRoute = true
                    }
                }

                if(!isFoundRoute){
                    this.setState({duration: 'Directions not found from google.'})
                }

                this.directionsDisplay.setDirections(response);
                // console.log('CalcRoute found>>>>>>', response, status)

            }else{
                // console.log('CalcRoute not found>>>>>>', response, status)
                this.setState({duration: 'Directions not found.'})
            }
        });
    }

    showMapForRequest = ()=>{

        const mapStyles = {
            width: '100%',
            height:'500px',
        };

        return (
            <Map
                ref={ref=>this.mapRef = ref}
                google={this.props.google}
                zoom={10}
                style={mapStyles}
                initialCenter={{ lat: this.state.currentLocation.lat, lng: this.state.currentLocation.lng}}
                center={{
                    lat: this.state.mapCenter.lat,
                    lng: this.state.mapCenter.lng
                }}
                onReady={this.fetchPlaces}
                onClick={this.mapClicked}
                bounds={this.state.bounds}
            >
                {this.displayMarkers()}
                {/*<Marker position={{ lat: this.state.currentLocation.lat, lng: this.state.currentLocation.lng}} />*/}
            </Map>
        )
    }

    render(){
        return (
            <div>

                <SubLoader isLoading={this.state.isLoading}/>
                {/* Request List view */}
                {!this.state.isLoading &&
                    <div className="panel panel-default">

                        <div className="panel-wrapper">
                            <div className="panel-body">
                                <ul className="nav nav-tabs nav-tabs-line nav-tabs-line-danger">
                                    <li className="nav-item">
                                        <a className={ this.state.activeTab  === 0 ?  "nav-link active" : "nav-link" } href="#new_requests"
                                           data-toggle="tab">New Requests</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={this.state.activeTab  === 1 ?  "nav-link active" : "nav-link"} href="#upcoming"
                                           data-toggle="tab">Upcoming</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={this.state.activeTab  === 2 ?  "nav-link active" : "nav-link"} href="#past"
                                           data-toggle="tab">Past</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div role="tabpanel" className={ this.state.activeTab  === 0 ?  "tab-pane active" : "tab-pane" } id="new_requests">
                                        {this.state.newRequests.length >0 &&
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                            <div className="panel panel-default">
                                                {/*<div className="panel-head">*/}
                                                {/*    <div className="panel-title"></div>*/}
                                                {/*</div>*/}
                                                <div className="panel-wrapper">
                                                    <div className="panel-body">
                                                        <ul className='comment-list'>
                                                            {this.showUpcomingList(this.state.newRequests)}
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/*<div className="panel-footer"></div>*/}
                                            </div>
                                        </Animated>}
                                        {this.state.newRequests.length <=0 &&
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                            <div className='row'>
                                                {showRequestEmpty()}
                                            </div>
                                        </Animated>}
                                    </div>
                                    <div role="tabpanel" className={ this.state.activeTab  === 1 ?  "tab-pane active" : "tab-pane" } id="upcoming">
                                        {this.state.upcomingList.length >0 &&
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                            <div className="panel panel-default">
                                                {/*<div className="panel-head">*/}
                                                {/*    <div className="panel-title"></div>*/}
                                                {/*</div>*/}
                                                <div className="panel-wrapper">
                                                    <div className="panel-body">
                                                        <ul className='comment-list'>
                                                            {this.showUpcomingList(this.state.upcomingList)}
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/*<div className="panel-footer"></div>*/}
                                            </div>
                                        </Animated>}
                                        {this.state.upcomingList.length <=0 &&
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                            <div className='row'>
                                                {showRequestEmpty()}
                                            </div>
                                        </Animated>}
                                    </div>
                                    <div role="tabpanel"  className={ this.state.activeTab  === 2 ?  "tab-pane active" : "tab-pane" } id="past">

                                        {this.state.pastList.length > 0 &&
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                            <div className="panel panel-default">
                                                {/*<div className="panel-head">*/}
                                                {/*    <div className="panel-title"></div>*/}
                                                {/*</div>*/}
                                                <div className="panel-wrapper">
                                                    <div className="panel-body">
                                                        <ul className='comment-list'>
                                                            {this.showPastList(this.state.pastList)}
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/*<div className="panel-footer"></div>*/}
                                            </div>
                                        </Animated>}

                                        {this.state.pastList.length <=0 &&
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                                            <div className='row'>
                                                {showRequestEmpty()}
                                            </div>
                                        </Animated>}

                                    </div>

                                </div>

                                <div style={{position:'absolute', top:40, right:40}}>
                                    <a href={"#"} onClick={()=>{
                                        this.loadingRequest()
                                    }}>
                                        <i className={"fa fa-redo  fa-lg"}></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/*end of request list*/}

                {/* Show Map View */}

                <div id="mapModal" className="modal fade">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Customer's Location </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    {this.state.selRequest && <span>Time: {Constants.secsToHumanTime(this.state.selRequest.trip_duration_secs) }</span>}
                                </div>
                                <div style={{marginLeft:'-1rem', marginTop:'10px'}}>
                                {this.showMapForRequest()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* End Show Map View */}
                {/* Review Modal */}

                {this.state.pastList.map((item, index)=>{
                    return (
                        <div id={"reviewModal"+item.id} className="modal fade">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Leave Review for customer {Constants.ucFirst(item.customer.first_name)}&nbsp;{Constants.ucFirst(item.customer.last_name)}</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row pb-3">
                                            <div className="col-md-12 text-center">
                                                <StarRatings
                                                    rating={this.state.rating}
                                                    starRatedColor="#ff654d"
                                                    changeRating={this.changeRating}
                                                    numberOfStars={5}
                                                    name='rating'
                                                    starDimension="35px"
                                                    starSpacing="5px"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div
                                                    className="form-group"
                                                    data-upgraded=",MaterialTextfield">
                                            <textarea className="form-control" rows="3"
                                                      id={"contact-message"+item.id}></textarea>
                                                </div>
                                            </div>
                                            <div className="col-12 text-center">
                                                <button
                                                    data-dismiss ="modal"
                                                    onClick={()=>{
                                                        let cmtid = "contact-message"+item.id
                                                        let commentInput = document.getElementById(cmtid);
                                                        this.setState({isLoading: true})
                                                        RestAPI.leaveReview(item.id, commentInput.value, this.state.rating, global.curUser.role, (res, err)=>{
                                                            this.setState({isLoading: false})
                                                            if(err!== null){
                                                                alert('Failed to leave review, try again.')
                                                                return
                                                            }
                                                            if(res.success === 1){
                                                                this.loadingRequest()
                                                            }else{
                                                                alert('Failed to leave review. try again after refresh.')
                                                            }
                                                        })
                                                    }}
                                                    className="btn btn-outline btn-primary btn-main-fill-60 btn-pill m-1">Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                })}

                {/* End of Review Modal*/}

            </div>
        );
    }

}

export function showRequestEmpty(){

    return (
        <div className="col text-center">
            <h4>Nothing request!</h4>
            <div>
                <img src={require('../../assets/images/zenda_bike_emo.png')} width={200}/>
            </div>
            <br/><br/>
            <p className="mb-4">Check if you have turn on your pickup availability. And try to get more requests by upgrading your membership.</p>
        </div>
    );
}

// export default RiderRequest;
export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(RiderRequest);
