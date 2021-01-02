import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Loader from 'react-loader-spinner'

/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/

import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'

import Header from "../header/header";

import Footer from "../footer/footer";
import {Animated} from "react-animated-css";
import BikeMapModal from "./bike_map_modal";

import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import {UserProfile} from "../data/user_profile";
import {Constants, ZLog} from "../rglobal/constants";
import RestAPI from "../global/RestAPI";
import {SubLoader} from "../global/SubLoader";


class  BikeHome extends React.Component{
     trackStyles = {

        width: '100%',
        height: '100%',
         zIndex: '0'
    }

    google = this.props.google;
    map = null;
    directionsService = null;
    directionsDisplay = null;
    startAddr = '';
    endAddr = '';

    mapModalRef = null;
    mapRef = null;


    paymentModal = null;

    constructor(props){
        super(props)
        let bounds = new this.props.google.maps.LatLngBounds();
        this.state = {
            isLoginMode: true,
            selPayment:null,
            isPaymentStep:1,
            isShowModal:true,
            isLoading : false,
            address:'',
            bounds:bounds,
            duration : '',
            durationSecs : null,
            distance: null,
            selPrice: null,
            selectedBike: null,
            postedRequest: null,
            mapCenter:{
                lat: 47.49855629475769,
                lng: -122.141844169
            },
            currentLocation:{
                lat: 47.49855629475769,
                lng: -122.141844169
            },
            bikes: [],
            bidBikes: [],
            onceTriggered : false,
            onceBikesBounded: false,
            pos1:null,
            pos2:null,
            originRegionName : null,
        }

        // this.getBounds()
    }

    onClickMapMarker = (bike)=>{
        console.log(bike)
        // this.setState({selectedBike: bike})
        let price = Constants.calcMilePrice(this.state.distance, bike.price_per_mile)
        this.setState({
            selectedBike: bike,
            selPrice: price,
        })

        this.mapModalRef.onClickBike(bike)

        // if(this.mapModalRef){
        //     this.mapModalRef.onClickBike(bike)
        // }

    }

    displayMarkers = () => {

        return this.state.bikes.map((store, index) => {
            return <Marker key={index} id={index} position={{
                    lat: store.lat,
                    lng: store.lng
                }}
               icon={{
                   url: require("../assets/images/bike-marker.png"),
                   // url: store.bike_photo,
                   anchor: new this.props.google.maps.Point(25,25),
                   scaledSize: new this.props.google.maps.Size(50,50)
               }}
              onClick={()=>{this.onClickMapMarker(store)}} />
        })
    }

    setBoundsForCenter=()=>{
        let bounds = new this.props.google.maps.LatLngBounds();
        
        let delta = [-0.08, 0.08];
        
        delta.forEach(x=>{
            delta.forEach(y=>{
                let item = {
                    lat: this.state.currentLocation.lat + x,
                    lng: this.state.currentLocation.lng + y                
                }
                bounds.extend(item)
            })
        })
        
        bounds.extend(this.state.currentLocation);
        
        
        this.setState({
            bounds: bounds
        })
    };

    getBounds = ()=>{
        let bounds = new this.props.google.maps.LatLngBounds();
        // let minLat = 0;

        for (let i = 0, len = this.state.bikes.length; i < len ; i++) {
            bounds.extend(this.state.bikes[i]);
            // minLat = this.state.bikes[i].lat < minLat ? this.state.bikes[i].lat : minLat;
        }
        bounds.extend(this.state.currentLocation);

        this.setState({
            bounds: bounds
        })

    }

    componentDidMount() {
        let urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('pay')){
            alert(urlParams.get('pay'))
        }
        console.log(urlParams.has('pay')); // true
        console.log(urlParams.get('pay')); // "edit"

        this.findLoop();
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                ZLog('My Location in bike_home getcurrent:', pos)
                const coords = pos.coords;
                this.setState({
                    mapCenter:{
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                }, ()=>{
                    
                });
                
                if(this.state.onceTriggered === false){
                    this.setBoundsForCenter();
                    
                    this.setState({onceTriggered: true})
                }
            })
        }
        
        // data-toggle="modal"
        //                    data-target="#paymentModal"
        
        
    
    
    }
    
    // setTimeout(() => {
        
    // }, 1500);
    
    findLoop = ()=>{
        setTimeout(()=>{
            this.findNearByRiders(this.state.currentLocation.lat, this.state.currentLocation.lng, ()=>{ this.findLoop(); })
        }, 5000)
    };

    findNearByRiders=(lat, lng, callBack)=>{
        // this.setState({isLoading:true})
        // console.log('Func Find NearByRiders', lat, lng)
        if(lat === null || lng === null){
            // console.log('go back now')
            callBack();
            return ;
        }
        RestAPI.findNearByRiders(lat, lng, 0, (res, err)=>{
            // this.setState({isLoading:true})
            if(err != null){
                // console.log('Failed to search riders', err)
                callBack();
                return
            }
            if(res.success == 1){
                // console.log('Find near by results in 5 secs.', res);
                this.setState({bikes:res.data})
                if(this.state.onceBikesBounded === false){
                    this.getBounds()
                    this.setState({onceBikesBounded : true})
                }
            }else{
                // console.log('Failed search riders even res is exist', res)
            }
            callBack();
        })
    }

    fetchPlaces = (mapProps, map) => {
        const {google} = mapProps;
        const service = new google.maps.places.PlacesService(map);
        this.map = map;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        let currentLocation = new google.maps.LatLng(this.state.currentLocation.lat, this.state.currentLocation.lng);
        // let mapOptions = {
        //     zoom:7,
        //     center: this.state.currentLocation
        // }

        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));


    }
     calcRoute = (pos1, pos2, travelMode)=>{

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
        this.setState({isLoading : true,  duration :'- - -',});
        this.directionsService.route(request, (response, status) => {
            this.setState({isLoading : false})
            if (status === 'OK') {
                // this.setState({duration: response.leave()})
                let isFoundRoute =  false;

                if(response.routes && response.routes.length > 0 ){
                    if(response.routes[0].legs && response.routes[0].legs.length > 0){
                        console.log('calc result=>',response);
                        let duration = response.routes[0].legs[0].duration.text || '';
                        let durationSecs = response.routes[0].legs[0].duration.value || null;
                        let distance = response.routes[0].legs[0].distance.value || null;
                        this.setState({
                            duration: duration,
                            durationSecs: durationSecs,
                            distance: distance
                        });
                        isFoundRoute = true
                    }
                }

                if(!isFoundRoute){
                    this.setState({duration: 'Directions not found from google.', durationSecs: null})
                }

                this.directionsDisplay.setDirections(response);
                // console.log('CalcRoute found>>>>>>', response, status)

            }else{
                console.log('CalcRoute not found>>>>>>', response, status)
                this.setState({duration: 'Directions not found.', durationSecs: null})
            }
        });
    }

    onLogin = ()=>{
        const newUser = new UserProfile({
            userName: 'Test User',
            email: 'test@test.com',
            phone: '123412341234',
            token: 'aksd918ueaskjdc',
            dob: new Date('1990-03-15'),
            avatar: ''
        });
        global.setUser(newUser);
        this.forceUpdate()
    }

    onSubmit = ()=>{
        const newUser = new UserProfile({
            userName: 'Test User',
            email: 'test@test.com',
            phone: '123412341234',
            token: 'aksd918ueaskjdc',
            dob: new Date('1990-03-15'),
            avatar: ''
        });
        global.setUser(newUser);
        this.forceUpdate()
    }

    onClickNextForRequest = (isZWalletCheckOut)=>{

        if( this.state.isPaymentStep < 2){
            
            this.setState({isPaymentStep: this.state.isPaymentStep+1})
            return
        }
        
        
        // if(this.state.isPaymentStep === 1){
        //     if(this.state.selPayment == null){
        //         alert('Please select payment method');
        //         return
        //     }
        // }
        
        this.setState({isLoading:true})
        RestAPI.geoCodingFromLocationIQ(this.state.currentLocation.lat, this.state.currentLocation.lng, (resAdd, errAdd)=>{
            let address = "";
            if(errAdd != null){
                address = null;
            }else{
                address = resAdd.display_name
            }

            let paymentMethod = this.state.selPayment;
            let data = {
                rider_id: this.state.selectedBike.user_id,
                action: 'waiting_hook',
                trx_platform: 'bike',
                currency_code:Constants.CURRENCY_CODE,
                amount: this.state.selPrice,

                customer_address: address,
                customer_lat: this.state.currentLocation.lat,
                customer_lng: this.state.currentLocation.lng,
                is_errand:false,                
                address1: this.state.pos1.addr,
                lat1:this.state.pos1.location.lat,
                lng1:this.state.pos1.location.lng,
                address2:this.state.pos2.addr,
                lat2:this.state.pos2.location.lat,
                lng2:this.state.pos2.location.lng,
                trip_distance: this.state.distance,
                trip_duration_secs: this.state.durationSecs,
                payment_method:paymentMethod,

            };

            // alert(isZWalletCheckOut +', '+ this.state.isPaymentStep)
            RestAPI.postRequest(data, (res, err)=>{
                this.setState({isLoading:false});
                if(err !== null){
                    console.log('err from post request', err);
                    alert('Failed to create request, try again after a moment.');
                    return
                }
                if(res.success === 1){

                    let paymentStep = this.state.isPaymentStep  + 1;

                    this.setState({isPaymentStep: paymentStep, postedRequest : res.data})
                    setTimeout(() => {
                        window.location.href = "/bike_trips"    
                    }, 3000);
                    
                    // return <Redirect to={'/carrier_dashboard'}/>
                }else{
                    console.log('post request failed', res)
                    alert('Failed to post new request, please try again.')
                }
            });



        })




    }


    mapClicked = (mapProps, map, clickEvent)=>{
        console.log('><><><><><><><><><><>><>>><><><', clickEvent.latLng.lat(), clickEvent.latLng.lng());
        
        this.mapModalRef.setCurFocusedLocation(clickEvent.latLng.lat(),  clickEvent.latLng.lng());
      
    }

    renderBikeMainHome = ()=>{
        const mapStyles = {
            position: 'absolute',
            top: 100,
            left: 0,
            width: '100%',
            // height:'100%',
            bottom:0,
            
            // zIndex: 0,
            
            // right: 0,
            // bottom: 0,
        };


        return ( <div>
                <Map
                    ref={ref=>this.mapRef = ref}
                    google={this.props.google}
                    zoom={8}
                    style={mapStyles}
                    initialCenter={{ lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng}}
                    // center={{
                    //     lat: this.state.mapCenter.lat,
                    //     lng: this.state.mapCenter.lng
                    // }}

                    onReady={this.fetchPlaces}
                    onClick={this.mapClicked}
                    bounds={this.state.bounds}
                >
                    {this.displayMarkers()}
                    <Marker position={{ lat: this.state.currentLocation.lat, lng: this.state.currentLocation.lng}} />
                </Map>
                <BrowserView>
                    <Animate
                        start={() => ({
                            y: 0,
                        })}

                        update={() => ({
                            y: [this.state.isShowModal ? 0 : -400],
                            timing: { duration: 750, ease: easeExpOut },
                        })}
                    >
                        {(state) => {
                            const { y } = state
                            return (
                                <div style={this.trackStyles}>
                                    <div
                                        style={{
                                            // position: 'absolute',
                                            // width: 50,
                                            // height: 50,
                                            borderRadius: 4,
                                            opacity: 1,
                                            backgroundColor: '#ffffff',
                                            WebkitTransform: `translate3d(${y}px, 0, 0)`,
                                            transform: `translate3d(${y}px, 0, 0)`,
                                        }}
                                    >
                                        <BikeMapModal
                                            ref = {ref=>this.mapModalRef = ref}
                                            google={this.props.google}
                                            bounds={this.state.bounds}
                                            duration={this.state.duration}
                                            durationSecs={this.state.durationSecs}
                                            distance={this.state.distance}
                                            bikes={this.state.bikes}
                                            tempReq={this.state.tempReq}
                                            onSelectBike={(bike)=>{
                                                let price = Constants.calcMilePrice(this.state.distance, bike.price_per_mile)
                                                this.setState({
                                                    selectedBike: bike,
                                                    selPrice: price,
                                                })
                                            }}
                                            selectedBike={this.state.selectedBike}
                                            onLocation2Selected={(pos1, pos2, curMode)=>{
                                                this.startAddr = pos1.addr;
                                                this.endAddr = pos2.addr;
                                                this.setState({
                                                    pos1: pos1,
                                                    pos2: pos2,
                                                });
                                                this.calcRoute(this.startAddr, this.endAddr, curMode)
                                            }}
                                            onToggleModal = {()=>{
                                                this.setState({
                                                    isShowModal: !this.state.isShowModal,
                                                })
                                            }}
                                            onSelectedOriginRegionName = {(regionName)=>{
                                                this.setState({ originRegionName : regionName})
                                            }}
                                            onClickRequest = {()=>{

                                                if(global.curUser === null){
                                                    alert('Please login to make request.')
                                                    window.location.href = '/login'
                                                }else{
                                                    this.setState({
                                                        isPaymentStep:1
                                                    })
                                                }
                                            }}

                                            onClickPostNew={(pos1, pos2, regionName, callBackTempReq)=>{
                                               
                                                this.setState({isLoading:true})
                                                console.log(global.curUser)
                                                if(global.curUser == null){
                                                    alert('You have to login to post request.')
                                                    window.location.href = '/login'
                                                    return
                                                }
                                                if( !this.state.originRegionName ){
                                                    alert('You have not selected valid region. please try again after select location in valid region.')
                                                    return 
                                                }

                                                RestAPI.geoCodingFromLocationIQ(this.state.currentLocation.lat, this.state.currentLocation.lng, (res, err)=>{
                                                    let user_addr = 'Unknown'
                                                    if(err== null && res != null){
                                                        user_addr = res.display_name
                                                    }

                                                    let data= {
                                                        user_id : global.curUser.user_id,
                                                        address1 : pos1.addr,
                                                        lat1 : pos1.location.lat,
                                                        lng1 : pos1.location.lng,
                                                        address2 : pos2.addr,
                                                        lat2 : pos2.location.lat,
                                                        lng2 : pos2.location.lng,
                                                        user_address : user_addr,
                                                        region_name: regionName,
                                                        user_lat : this.state.currentLocation.lat,
                                                        user_lng : this.state.currentLocation.lng,

                                                        trx_platform: 'bike',
                                                        trip_distance: this.state.distance,
                                                        trip_duration_secs: this.state.durationSecs,
                                                    }
                                                    // console.log('Uploaded data for temp request:-> ',data)
                                                    // return
                                                    RestAPI.postTempBikeReq( data, (res, err)=>{
                                                        this.setState({ isLoading : false})
                                                        if( err != null){
                                                            callBackTempReq(false, 0, null)
                                                            this.setState({tempReq: null})
                                                            alert('Some errors are occurred while posting new request')

                                                            return
                                                        }
                                                        if(res.success == 1){
                                                            let riderIds = res.data.near_riders

                                                            if(riderIds.length <= 0){
                                                                alert('Unfortunately, there is nobody can pickup this request, please try again after a moment.')
                                                            }else{
                                                                // alert('The '+riderIds.length+' riders can check your request and will response if they can pickup you.')
                                                            }
                                                            this.setState({tempReq:  res.data.req})
                                                            callBackTempReq(true, riderIds.length, res.data.req)

                                                        }else{
                                                            callBackTempReq(false, 0, null)
                                                            this.setState({tempReq: null})
                                                            alert('Failed to post new request, please try again.')
                                                            return
                                                        }
                                                    })
                                                 })
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        }}

                    </Animate>
                </BrowserView>
                <MobileView>

                    <BikeMapModal
                        ref = {ref=>this.mapModalRef = ref}
                        google={this.props.google}
                        bounds={this.state.bounds}
                        duration={this.state.duration}
                        durationSecs={this.state.durationSecs}
                        distance={this.state.distance}
                        bikes={this.state.bikes}
                        onSelectBike={(bike)=>{
                            let price = Constants.calcMilePrice(this.state.distance, bike.price_per_mile)
                            this.setState({
                                selectedBike: bike,
                                selPrice: price,
                            })
                        }}
                        selectedBike={this.state.selectedBike}
                        onLocation2Selected={(pos1, pos2, curMode)=>{
                            this.startAddr = pos1.addr;
                            this.endAddr = pos2.addr;
                            this.setState({
                                pos1: pos1,
                                pos2: pos2,
                            });
                            this.calcRoute(this.startAddr, this.endAddr, curMode)
                        }}
                        onToggleModal = {()=>{
                            this.setState({
                                isShowModal: !this.state.isShowModal,
                            })
                        }}
                        onClickRequest = {()=>{
                            if(global.curUser === null){
                                alert('Please login to make request.')
                                window.location.href = '/login'
                            }else{
                                this.setState({
                                    isPaymentStep:1
                                })
                            }

                        }}
                    />
                </MobileView>
                
                {this.state.isPaymentStep >= 1 ?
                <div id="paymentModal" className="modal fade" ref={modal => this.paymentModal = modal}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Request for Rider#{this.state.selectedBike && this.state.selectedBike.user && Constants.ucFirst(this.state.selectedBike.user.first_name) + ' ' + Constants.ucFirst(this.state.selectedBike.user.last_name) }</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={()=>{
                                        this.setState({
                                            isPaymentStep:1
                                        })
                                    }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        
                        </div>
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isPaymentStep === 1}>
                            <div style={{position:'absolute', top:0, left:0,width:'100%'}}>
                                <SubLoader isLoading={this.state.isLoading}/>
                            </div>
                            <div className="modal-body" style={{display:this.state.isPaymentStep == 1 ?'inline':'none'}}>
                                <div className="row mr-1 ml-1 pl-3" >
                                    <span>At the end of the service, you will pay with one option of followings.</span>
                                </div>
                                <div className="row mr-1 ml-1 justify-content-center">
                                    
                                        <div 
                                            // style={{
                                                // borderBottom: this.state.selPayment == Constants.PaymentMethod.Airtel ? 'solid 3px green' : '', paddingBottom:5,
                                                // opacity: this.state.selPayment == Constants.PaymentMethod.Airtel ? 1 : 0.5}}
                                            className="m-2"  
                                            onClick={()=>{this.setState({selPayment:Constants.PaymentMethod.Airtel})}}>
                                            <img src={Constants.PayLogo.Airtel} alt="airtel" style={{height:50}}/>
                                        </div>
                                        <div 
                                            //  style={{
                                            //     borderBottom: this.state.selPayment == Constants.PaymentMethod.MTN ? 'solid 3px green' : '', paddingBottom:5,
                                            //     opacity: this.state.selPayment == Constants.PaymentMethod.MTN ? 1 : 0.5}}
                                            className="m-2"  
                                            onClick={()=>{this.setState({selPayment:Constants.PaymentMethod.MTN})}}>
                                            <img src={Constants.PayLogo.MTN} alt="mtn" style={{height:50}}/>
                                        </div>
                                        <div
                                            //  style={{
                                            //     borderBottom: this.state.selPayment == Constants.PaymentMethod.TIGO ? 'solid 3px green' : '', paddingBottom:5,
                                            //     opacity: this.state.selPayment == Constants.PaymentMethod.TIGO ? 1 : 0.5}} 
                                            className="m-2"  
                                            onClick={()=>{this.setState({selPayment:Constants.PaymentMethod.TIGO})}}>
                                            <img src={Constants.PayLogo.TIGO} alt="tigo" style={{height:50}}/>
                                        </div>
                                        <div 
                                            //  style={{
                                            //     borderBottom: this.state.selPayment == Constants.PaymentMethod.VODA ? 'solid 3px green' : '', paddingBottom:5,
                                            //     opacity: this.state.selPayment == Constants.PaymentMethod.VODA ? 1 : 0.5}}
                                            className="m-2"  
                                            onClick={()=>{this.setState({selPayment:Constants.PaymentMethod.VODA})}}>
                                            <img src={Constants.PayLogo.VODA} alt="vodafone" style={{height:50}}/>
                                        </div>
                                    
                                </div>                               
                            </div>
                        </Animated>
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isPaymentStep === 2}>
                            <div style={{position:'absolute', top:0, left:0,width:'100%'}}>
                                <SubLoader isLoading={this.state.isLoading}/>
                            </div>
                            <div className="modal-body" style={{display:this.state.isPaymentStep === 2?'inline':'none'}}>

                                <div className="row mr-1 ml-1">
                                    <div className="col-md">
                                        <div style={{display: global.curUser === null ? 'inherit':'none'}}>
                                            <h4>Lets Continue with Login!</h4>
                                            <p className="mb-4">
                                                To continue, please try to login with your account or create account.
                                            </p>

                                            <div className="layer-stretch" style={{display : this.state.isLoginMode ? 'inherit' : 'none'}}>
                                                <div className="layer-wrapper">
                                                    <div className="row pt-4">

                                                        <div className="col">
                                                            <div
                                                                className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                                <input className="mdl-textfield__input"
                                                                       type="email" id="email"/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="email">Email Address</label>
                                                            </div>
                                                            <div
                                                                className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                                <input className="mdl-textfield__input"
                                                                       type="password" id="password"/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="password">Password</label>
                                                            </div>

                                                            <div className="pt-4 text-center">
                                                                <button
                                                                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                                    onClick={this.onLogin}>Sign
                                                                    In
                                                                </button>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="login-link">
                                                            <span
                                                                className="paragraph-small">Don't you have an account?</span>
                                                    <Link to={"/register"} >Register as New User</Link>
                                                    {/*<a className="" onClick={()=>{*/}
                                                    {/*    this.setState({isLoginMode: !this.state.isLoginMode})*/}
                                                    {/*}}></a>*/}
                                                </div>
                                            </div>

                                            <div className="layer-stretch"  style={{display : !this.state.isLoginMode ? 'inherit' : 'none'}}>
                                                <div className="layer-wrapper"
                                                     style={{paddingBottom: '0px'}}>
                                                    <div className="row pt-4">

                                                        <div className="col">
                                                            <div
                                                                className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                                <input className="mdl-textfield__input"
                                                                       type="text" id="user_name"/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="user_name">User Name</label>
                                                            </div>
                                                            <div
                                                                className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                                <input className="mdl-textfield__input"
                                                                       type="email" id="user_email"/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="user_email">Email Address</label>
                                                            </div>
                                                            <div
                                                                className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input"}>
                                                                <input className={"mdl-textfield__input"}
                                                                       type="password" id="pwd"/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="pwd">Password</label>
                                                            </div>
                                                            <div
                                                                className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input"}>
                                                                <input className="mdl-textfield__input"
                                                                       type="password" id="repwd"/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="repwd">Confirm Password</label>
                                                            </div>

                                                            <div
                                                                className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                                <input className="mdl-textfield__input"
                                                                       type="date" id="dob" placeholder=''/>
                                                                <label className="mdl-textfield__label"
                                                                       htmlFor="dob">Date of birthday</label>
                                                            </div>
                                                            <div className="">
                                                                <button
                                                                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                                    onClick={this.onSubmit}>&nbsp;&nbsp;&nbsp; Submit &nbsp;&nbsp;&nbsp;</button>
                                                            </div>

                                                            <div className="login-link">
                                                                <div className="row">
                                                                    <span className="paragraph-small">I have an account</span>
                                                                    <a className="" onClick={()=>{
                                                                        this.setState({isLoginMode: !this.state.isLoginMode})
                                                                    }}>Sign in</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display:global.curUser !== null ? 'inherit' : 'none'}}>
                                            <div className="">
                                                <i className="icon-wallet panel-head-icon"></i>
                                                <span className="panel-title-text">
                                                    <h5 style={{marginTop:'8px'}}>
                                                        Payment 
                                                        {/* {this.state.selPayment === Constants.PaymentMethod.Airtel && 'with Airtel'} 
                                                        {this.state.selPayment === Constants.PaymentMethod.MTN && 'with MTN'} 
                                                        {this.state.selPayment === Constants.PaymentMethod.TIGO && 'with TIGO'} 
                                                        {this.state.selPayment === Constants.PaymentMethod.VODA && 'with Vodafone'}  */}
                                                    </h5>
                                                    {/* {this.state.selPayment === Constants.PaymentMethod.Airtel && <img src={Constants.PayLogo.Airtel} alt="airtel" style={{height:50}}/>} 
                                                    {this.state.selPayment === Constants.PaymentMethod.MTN && <img src={Constants.PayLogo.MTN} alt="MTN" style={{height:50}}/>} 
                                                    {this.state.selPayment === Constants.PaymentMethod.TIGO && <img src={Constants.PayLogo.TIGO} alt="TIGO" style={{height:50}}/>} 
                                                    {this.state.selPayment === Constants.PaymentMethod.VODA && <img src={Constants.PayLogo.VODA} alt="VODA" style={{height:50}}/>}                                                      */}
                                                    
                                                </span>
                                            </div>
                                            <div className="text-left mt-1 ml-4">
                                                <p style={{fontSize:'18px'}}>
                                                    Amount: {this.state.selectedBike !== null && Constants.CURRENCY_CODE + ' '+this.state.selPrice}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Animated>
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isPaymentStep === 3}>
                            <div style={{position:'absolute', top:0, left:0,width:'100%'}}>
                                <SubLoader isLoading={this.state.isLoading}/>
                            </div>
                            <div className="modal-body" style={{display:this.state.isPaymentStep === 3?'inline':'none'}}>

                                <div className="row mr-1 ml-1">
                                    <div className="col-md">
                                        <div>
                                            <h4>Your request is posted!</h4>
                                            <p className="mb-4">
                                                Rider will reach out you soon.<br/>Please check your trip details at your dashboard.
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </Animated>
                        <div className="modal-footer"
                             style={{
                                 justifyContent:'center',
                                 display: global.curUser === null && this.state.isPaymentStep === 2 || this.state.isPaymentStep === 3 ? 'none':'inherit'
                             }}>

                            <div className="row w-100">
                                <div className="col-md-6 text-left">
                                    <button className="btn btn-default btn-pill"
                                            onClick={()=>{
                                                let paymentStep = this.state.isPaymentStep  - 1;
                                                paymentStep = paymentStep <= 1 ? 1 : paymentStep;
                                                this.setState({isPaymentStep: paymentStep});
                                            }}
                                    >Prev</button>
                                </div>
                                <div className="col-md-6 text-right">
                                    
                                    <button
                                        onClick={()=>{
                                            this.onClickNextForRequest(this.state.isPaymentStep >= 2 && global.curUser !== null
                                                && this.state.selPayment === Constants.PaymentMethod.ZWallet);
                                        }}
                                        style={{display:this.state.isPaymentStep === 2 && global.curUser !== null
                                            && this.state.selPayment === Constants.PaymentMethod.CreditCard ? 'none':''}}
                                        className="btn btn-primary btn-pill"
                                    >
                                        {this.state.isPaymentStep >= 2 && global.curUser !== null ? 'Post Request':'Continue'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : null}


                <div id={'directionsPanel'} style={{display:'none'}}></div>

                <Animated animationIn="fadeInLeft" animationOut="fadeOutLeft"  animationInDuration={800} animationOutDuration={800} isVisible={this.state.isLoading}>
                    <div className="row map_loader" style={{display: this.state.isLoading ? 'inline' : 'none'}}>
                        <Loader
                            type="Oval"
                            color="#ff654d"
                            height="50"
                            width="50"
                        />
                    </div>
                </Animated>

            </div>
        )
    }
    
    render(){
        
        return (
            <Router>
                <div>
                    <Header
                        backgroundColor={'#fff'}
                        isBike={true}
                    />
                    {this.props.subPath === '/' && this.renderBikeMainHome()}
                    {/*{this.props.subPath === 'trips' && <strong>Here is ou nacksndklajsndclkajsnd clkajsdnc</strong>}*/}
                </div>
            </Router>
        );
    }
}

// export default BikeHome;
export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(BikeHome);
