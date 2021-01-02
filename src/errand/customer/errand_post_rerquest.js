import React from 'react';
import Header from "../../header/header";
import PropTypes from 'prop-types';
import {BikeProfile, UserProfile} from "../../data/user_profile";

import {GoogleApiWrapper} from "google-maps-react";
import {Constants, ZLog} from "../../rglobal/constants";


import ErrandRequestDetail from './errand_detail'

import {SubPulseLoader} from "../../global/SubLoader";
import RestAPI from "../../global/RestAPI";


import CheckoutModal from "../../assets/components/CheckoutModal";
import RiderChoose from "../../assets/components/RiderChoose";
import ErrandRequestForm from "../../assets/components/ErrandRequestForm";
import ErrandRequestBreadcrumb from "../../assets/components/ErrandRequestBreadcrumb";

const STEP_REQINF = 1;
const STEP_CHOOSERIDER = 2;
const STEP_CONFIRM = 3;
const STEP_CHECKOUT = 4;


class  ErrandPostRequest extends React.Component{

    google = this.props.google
    bounds = new this.props.google.maps.LatLngBounds();


    state = {
        stepOfRequest:STEP_REQINF,
        currentLocation: null,
        mapDetailBounds : null,
        isPaymentStep:1,
        checkOutTimeOut: 0,
        isRiderLoading: false,
        carriers:[],
        selCarrier:null,
        selPayment: null,
        isLoginMode : true,
        selPickupAddr : null,
        selDestAddr : null,
        selPickLocation: null,
        selDestLocation: null,
        selSenderName : null,
        selSenderPhone : null,
        selRcverName : null,
        selRcverPhone : null,
        selParcelDesc : null,
        selDeliveryDesc : null,
        PayOptions : [],
        postedRequest: null,
    }
    constructor(props){
        super(props)
    }



    getCurLocation(callback){
        let options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        ZLog('Begin Get Location From Errand Post Request.')
        if (navigator && navigator.geolocation) {
            ZLog('Navigator is valid get location', navigator.geolocation)
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                ZLog('Get current position:', coords);
                this.setState({
                    mapCenter:{
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    },
                }, (err)=>{
                    ZLog('Unknown Callback from getCurrentPosition:', err);
                    // if(callback){
                    //     callback( { lat: coords.latitude, lng: coords.longitude })
                    // }
                })
            }, err=>{
                ZLog('Err in GetCurrentPosition: ', err)
                RestAPI.getIPAddress().then(res=>{
                    ZLog('Found ip address:', res)
                    this.setState({
                        mapCenter:{
                            lat: res.lat,
                            lng: res.lon
                        },
                        currentLocation: {
                            lat: res.lat,
                            lng: res.lon
                        },
                    }, (err)=>{
                        ZLog('Unknown Callback from getCurrentPosition:', err);
                    })

                }).catch(err=>{
                    ZLog('IP Address Location failed:', err)
                })
            }, options);

        }
    }

    componentDidMount() {

        this.getCurLocation();

        this.loadBasicData();



        let input = document.getElementById('pickup_addr');
        let searchBox1 = new this.google.maps.places.SearchBox(input, {
            bounds: this.bounds
        });
        let input2 = document.getElementById('dest_addr');
        let searchBox2 = new this.google.maps.places.SearchBox(input2, {
            bounds: this.bounds
        });

        searchBox1.addListener('places_changed', ()=>{
            let places = searchBox1.getPlaces();
            if(places.length > 0){
                let addr1 = places[0].formatted_address;
                let location1 = {
                    lat: places[0].geometry.location.lat(),
                    lng: places[0].geometry.location.lng(),
                }
                this.setState({
                    pickUpPosition: {
                        addr: addr1,
                        location:location1
                    },
                    selPickupAddr:addr1,
                    selPickLocation: location1
                })

                console.log('searchBox1', addr1, location1);
            }else{
                this.setState({
                    pickUpPosition: null
                })
            }
        })

        searchBox2.addListener('places_changed', ()=>{
            let places = searchBox2.getPlaces();
            console.log('searchBox2', places);
            if(places.length > 0){
                let addr2 = places[0].formatted_address;
                let location2 = {
                    lat: places[0].geometry.location.lat(),
                    lng: places[0].geometry.location.lng(),
                }
                this.setState({
                    destPosition: {
                        addr: addr2,
                        location:location2
                    },
                    selDestAddr: addr2,
                    selDestLocation: location2
                })

                // this.onLocationSelected()
                console.log('searchBox2', addr2, location2);
            }else{
                this.setState({
                    destPosition: null
                })
            }
        })


    }


    loadBasicData = ()=>{

        let hash = Constants.generateHash({clientId:117});
        console.log(hash)

        RestAPI.korba_CollectNetworkOptions().then(res=>{
            this.setState({ PayOptions: res})
            console.log(res)
        }).catch(err=>{
            alert('Somethings wrong while collecting payment basic data.')
            console.log(err)
        }).finally(()=>{

        })


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
    onSignup = ()=>{
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

    chkValidSel=()=>{
        const {selPickupAddr, selDestAddr, selSenderName, selSenderPhone, selRcverName, selRcverPhone, selPickLocation, selDestLocation} = this.state
        console.log('chk validation')
        console.log(selPickupAddr, selDestAddr, selSenderName, selSenderPhone, selRcverName, selRcverPhone, selPickLocation, selDestLocation)
        console.log(selPickupAddr!= null && selDestAddr != null &&
            selSenderPhone != null && selSenderName != null &&
            selRcverPhone != null && selRcverName != null &&
            selPickLocation != null && selDestLocation!= null)

        return selPickupAddr!= null && selDestAddr != null &&
            selSenderPhone != null && selSenderName != null &&
            selRcverPhone != null && selRcverName != null &&
            selPickLocation != null && selDestLocation!= null;
    }

    getBoundsForMap=(locations)=>{
        if(this.state.currentLocation == null){
            return null
        }
            let google = this.props.google
            console.log(locations, this.state.currentLocation)
            console.log(google)
            locations.push(this.state.currentLocation)
            // let SW = {lat:this.state.currentLocation.lat, lng: this.state.currentLocation.lng}
            // let NE = {lat:this.state.currentLocation.lat, lng: this.state.currentLocation.lng}

            let bounds = new google.maps.LatLngBounds();
        //     // let minLat = 0;
        //


            locations.forEach(item=>{
                let loc = {lat: parseFloat(item.lat), lng:parseFloat(item.lng)}
                    bounds.extend(loc);

                //     let swLat = Math.min(SW.lat, item.lat)
                //     let swLng = Math.min(SW.lng, item.lng)
                //     let neLat = Math.max(NE.lat, item.lat)
                //     let neLng = Math.max(NE.lng, item.lng)
                //     SW = {lat: swLat, lng: swLng}
                //     NE = {lat: neLat, lng: neLng}
                //
                }

            )
            bounds.extend(this.state.currentLocation)
        //     let bounds = new google.maps.LatLngBounds(
        //         new google.maps.LatLng(SW.lat, SW.lng), // SW
        //         new google.maps.LatLng(NE.lat, NE.lng)    // NE
        //     );

            console.log('bounds in getmapboudns func', bounds)

            this.setState({
                mapDetailBounds: bounds
            })
        return bounds

    }

    loginForRequest = (email, pwd)=>{

        return new Promise((resolve, reject)=>{

            RestAPI.login(email, pwd, (res, err)=>{

                if(err!== null){
                    alert('Failed to login. '+err)
                    reject(err)
                    return
                }
                console.log('logged in res==>', res)
                if(res.success === 1){
                    let user = res.data.user

                    if(user.role_id == UserProfile.ROLE_CUSTOMER){
                        let newUser = new UserProfile({
                            userName: user.first_name + ' ' + user.last_name,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            email: user.email,
                            phone: user.phone_number,
                            token: res.data.token,
                            // dob: new Date('1990-03-15'),
                            avatar: user.avatar,
                            role: user.role_id,
                            user_id: user.id,
                            is_active: user.is_active
                        });
                        global.setUser(newUser);
                    }else if(user.role_id == UserProfile.ROLE_RIDER){
                        let newUser = new UserProfile({
                            userName: user.first_name+' '+user.last_name,
                            email: user.email,
                            phone: user.phone_number,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            token: res.data.token,
                            // dob: new Date('1990-03-15'),
                            avatar: user.avatar,
                            address: user.staff.address,
                            role: user.role_id,
                            user_id: user.id,
                            staff_id: user.staff.id,
                            pickup_available: user.staff.pickup_available,
                            memberShip: user.staff.membership,
                            bikeProfile : new BikeProfile({
                                photo : user.staff.bike_photo,
                                name : user.staff.bike_name,
                                license : user.staff.bike_license,
                                reg_number : user.staff.bike_reg_number,
                                policeReport : user.staff.bike_report,
                                insurance : user.staff.bike_insurance,
                                price_per_mile : user.staff.price_per_mile,
                                min_price: user.staff.min_price,
                            }),
                            carrierProfile:{
                                carrier_id:user.staff.carrier_id,
                                is_free:user.staff.is_free,
                                max_width:user.staff.max_width,
                                max_height:user.staff.max_height,
                                max_depth:user.staff.max_depth,
                                max_weight:user.staff.max_weight,
                                grade:user.staff.grade,
                                delay:user.staff.delay,
                                min_price:user.staff.min_price,
                                price_per_mile:user.staff.price_per_mile,
                            }

                        });


                        global.setUser(newUser);

                    }

                    resolve(user)

                }else{
                    alert('Failed to login, please try with correct data.')
                    reject(res)
                }
            })
        })

    }

    onSubmit = ()=>{

        if(this.state.stepOfRequest <= STEP_CHECKOUT){

            if( global.curUser == null ){
                alert('Please login to request service.');
                window.location.href='/login';
                return
            }

            if(this.state.stepOfRequest == STEP_REQINF && !this.chkValidSel()){
                alert('Please input request data fully.')
                return
            }
            if(this.state.stepOfRequest == STEP_CHOOSERIDER){
                if(this.state.selCarrier == null){
                    alert('Select Carrier!')
                    return
                }
                const {selCarrier, selPickupAddr, selDestAddr, selSenderName, selSenderPhone, selRcverName, selRcverPhone, selPickLocation, selDestLocation} = this.state
                let carrierLocation = {lat:selCarrier.lat, lng:selCarrier.lng}
                try{
                    this.getBoundsForMap([selPickLocation, selDestLocation, carrierLocation])
                }catch(ex){
                    console.log(ex)
                }

            }

            let lat = null;
            let lng = null;
            if(!this.state.currentLocation){
                alert("Didn't get your location, please allow location permission and try again.");
                this.getCurLocation(()=>{
                    alert('Location is fetched.');
                });
                // return
            }else{
                lat = this.state.currentLocation.lat;
                lng = this.state.currentLocation.lng;
            }

            this.setState({stepOfRequest: this.state.stepOfRequest+1})
            if(this.state.stepOfRequest == STEP_CHOOSERIDER-1){

                this.setState({isRiderLoading: true})
                RestAPI.findNearByRiders(lat, lng, 1, (res, err)=>{
                    this.setState({isRiderLoading: false})

                    if(err != null){
                        alert('Failed to find near by riders, please try again after a moment.')
                        return
                    }
                    if(res.success == 1){
                        this.setState({
                            carriers:res.data
                        })
                    }else{
                        alert('Failed to find near by riders, please try again after a moment.')
                    }
                })

            }
        }
    }

    disCounter = 5;
    onCheckoutNext = (price, phone, desc, selPayment)=>{

        if(this.state.isPaymentStep === 1){
            if(this.state.selPayment == null){
                alert('Please select payment method');
                return
            }
        }

        ZLog('OnCheckout PaymentStep:', this.state.isPaymentStep)
        this.setState({ isLoading: true });
        this.submitRequest(price, phone, desc).then(data=>{

            this.onPayComplete(data.request, selPayment, phone, desc, (result=>{

                if( result == true ){
                    this.setState({ isLoading: false });
                    window.location.href = "/errand_requests"
                }else{
                    RestAPI.removeErrandReqByFailedPay(data.request.id).then(resRemove=>{

                    }).catch(errRemove=>{

                    }).finally(()=>{
                        this.setState({ isLoading: false });
                    })
                }
            }))
        }).catch(err=>{
            this.setState({ isLoading: false });
            alert('Failed to create errand request, please try again.');
            ZLog('failed post errand request', err)
        })

    }

    onPayComplete = (errandReqData, selPayment, phone, desc, callback)=>{

        let trdata = {
            currency_code:errandReqData.currency_code,
            amount:errandReqData.amount,
            trx_source:selPayment,
            trx_platform:'errand',
            action:'waiting_hook',
            rcv_id:errandReqData.rider_id,
            sender_id:global.curUser.id,
            net:errandReqData.net,
            fee:errandReqData.fee,
            req_id:errandReqData.id
            //merchant_reference:
            //merchant_id:
        }


        RestAPI.createTransaction(trdata).then(res=>{

            if( res.success == 1){

                let callbackUrl =   "https://admin.zendasgh.com/api/callbackKorba?transaction_id=UNIQUE_ID&status=SUCCESS&message=MESSAGE";

                let body = {
                    "customer_number": phone,
                    "amount": Constants.number2FixedDecimalString(errandReqData.amount) ,
                    "transaction_id": res.data.trx_id,
                    "network_code": res.data.trx_source,
                    "callback_url":  callbackUrl,
                    "description": desc + " From zendas errand service.",
                    "client_id": "117",
                    "payer_name": errandReqData.customer.first_name+' '+errandReqData.customer.last_name,
                    "extra_info":"req_id:"+errandReqData.id,
                    // "vodafone_voucher_code":"vodafone_voucher_code"
                }
                if( selPayment == 'VOD'){
                    body.vodafone_voucher_code = '' // voda code
                }
                console.log('JSON BOdy for collect api:', body)


                RestAPI.korba_Collect(body).then(reskorba=>{
                    console.log('reskorba:  ', reskorba)

                    if( reskorba.success == true){
                        let msg = 'After you confirm payment, request will be created and  notify carrier.';
                        alert(reskorba.results + '\n' + msg);
                        callback(true)
                    }else{
                        alert(reskorba.error_message)
                        ZLog('Failed to pay, and removed trasaction data.', reskorba);
                        RestAPI.removeFailedTrx(res.data.id)
                        callback(false)
                    }
                }).catch(errkorba=>{
                    console.log('errkorba:  ', errkorba)
                    console.log('Failed to pay, ' , errkorba)
                    alert('Failed to pay, ' + JSON.stringify(errkorba))
                    RestAPI.removeFailedTrx(res.data.id)
                    callback(false)
                })
            }else{
                callback(false)
                alert('Failed to create transaction, because ' + res.msg)
            }
        }).catch(err=>{

            console.log(' While Create Transaction:', err)
            alert('Failed to create transaction, please try again.')
            callback(false)
        })

    }


    submitRequest = (price, phone, desc)=>{

        const {selCarrier, selParcelDesc, selDeliveryDesc, selPickupAddr, selDestAddr, selSenderName, selSenderPhone, selRcverName, selRcverPhone, selPickLocation, selDestLocation} = this.state

        let data = {
            rider_id: selCarrier.user_id,
            action: 'waiting_hook',
            trx_platform: 'errand',
            currency_code:Constants.CURRENCY_CODE,
            amount: price,

            customer_address: '',
            customer_lat: this.state.currentLocation.lat,
            customer_lng: this.state.currentLocation.lng,

            address1: selPickupAddr,
            lat1:selPickLocation.lat,
            lng1:selPickLocation.lng,
            address2:selDestAddr,
            lat2:selDestLocation.lat,
            lng2:selDestLocation.lng,
            trip_distance: this.state.distance,
            trip_duration_secs: this.state.durationSecs,
            payment_method:this.state.selPayment,
            is_errand : 1,
            sender_name: selSenderName,
            receiver_name : selRcverName,
            sender_phone : selSenderPhone,
            receiver_phone : selRcverPhone,
            parcel_desc: selParcelDesc,
            delivery_desc : selDeliveryDesc,

        };

        ZLog('errand request post', data)


        return new Promise((resolve, reject)=>{
            RestAPI.postRequest(data, (res, err)=>{

                if(err !== null){
                    console.log('err from post request', err);
                    alert('Failed to create request, try again after a moment.');
                    reject(err)
                    return
                }
                if(res.success === 1){
                    resolve(res.data)
                }else{
                    console.log('post request failed', res)
                    alert('Failed to post new request, please try again.')
                    reject(err)
                }
            });
        })



    }

    onCancel=()=>{

        if(window.confirm('Are you sure to cancel request?')){
            window.location.href = '/errand';
        }
    }


    render(){
        return (
            <div>
                <Header

                    isErrand={true}
                    backgroundColor={'#fff'}
                />
                <div className="page-ttl-errand ">
                    <div className="layer-stretch">
                        <div className="page-ttl-container">
                            <h1>Post <span className="text-primary">Request</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Errand Request</span></p>
                        </div>
                    </div>
                </div>

                <div className="layer-stretch">
                    <div className="layer-wrapper">
                        {/* arrows at above in PC version */}
                            <ErrandRequestBreadcrumb stepOfRequest={this.state.stepOfRequest}/>
                        {/* End of arrows for PC */}

                        {/* Request Information */}
                        <ErrandRequestForm
                            stepOfRequest={this.state.stepOfRequest}
                            onChangeSenderName={val=>this.setState({selSenderName:val})}
                            onChangeReceiverName={val=>this.setState({selRcverName:val})}
                            onChangeSenderPhone={val=>this.setState({selSenderPhone:val})}
                            onChangeReceiverPhone={val=>this.setState({selRcverPhone:val})}
                            onChangeParcelDesc={val=>this.setState({selParcelDesc:val})}
                            onChangeDeliveryDesc={val=>this.setState({selDeliveryDesc:val})}
                        />
                        {/* End Request Information */}

                        {/* Choose Rider */}
                        {this.state.isRiderLoading ?
                            <SubPulseLoader isLoading={this.state.isRiderLoading}/>
                                  :
                            <RiderChoose
                                carriers = {this.state.carriers}
                                stepOfRequest={this.state.stepOfRequest}
                                selPickLocation={this.state.selPickLocation}
                                selDestLocation={this.state.selDestLocation}
                                onClick={(item)=>{
                                    // send request
                                    this.setState({selCarrier: item})
                                }}
                                selectedItem={this.state.selCarrier}
                            />
                        }

                        {/* End Choose Rider */}

                        {/*Confirm Request*/}
                        {this.state.stepOfRequest === STEP_CONFIRM  &&
                        <ErrandRequestDetail
                            bounds = {this.state.mapDetailBounds}
                            google={this.google}
                            isShowCustomer={false}
                            currentLocation={this.state.currentLocation}
                            selCarrier={this.state.selCarrier}
                            selPickupAddr={this.state.selPickupAddr}
                            selDestAddr={this.state.selDestAddr}
                            selPickLocation={this.state.selPickLocation}
                            selDestLocation={this.state.selDestLocation}
                            selSenderName={this.state.selSenderName}
                            selSenderPhone={this.state.selSenderPhone}
                            selRcverName={this.state.selRcverName}
                            selRcverPhone={this.state.selRcverPhone}
                            selParcelDesc={this.state.selParcelDesc}
                            selDeliveryDesc={this.state.selDeliveryDesc}
                        />}
                        {/*End Confirm*/}

                        {/* Checkout Modal */}
                        <CheckoutModal
                            // ref={ref=>this.checkoutRef=ref}
                            errandReqData={this.state.postedRequest}
                            isLoginMode={this.state.isLoginMode}
                            isPaymentStep={this.state.isPaymentStep}
                            checkOutTimeOut={this.state.checkOutTimeOut}
                            selPayment={this.state.selPayment}
                            isLoading ={this.state.isLoading}
                            selCarrier={this.state.selCarrier}
                            selPickLocation={this.state.selPickLocation}
                            selDestLocation={this.state.selDestLocation}

                            onClose = {()=>{
                                this.setState({
                                    stepOfRequest:STEP_CONFIRM,
                                    isPaymentStep : 1
                                })
                            }}
                            onClickPaymentMethod = {(method)=>{
                                this.setState({selPayment:method})
                            }}
                            onLogin={(email, pwd)=>{
                                console.log(email, pwd)
                                this.setState({isLoading:true})
                                this.loginForRequest(email, pwd).then(res=>{

                                }).catch(err=>{

                                }).finally(()=>{
                                    this.setState({isLoading:false})
                                })

                            }}
                            onClickRegister={()=>{
                                this.setState({isLoginMode: !this.state.isLoginMode})
                            }}
                            onClickPrev={(paymentStep)=>{
                                this.setState({isPaymentStep: paymentStep});
                            }}
                            onNext={(price, phone, desc, selPayment)=>{
                                this.onCheckoutNext(price, phone, desc, selPayment)
                            }}
                        />

                        {/*End checkout modal*/}

                        <div className="col pt-4 text-center">
                            {this.state.stepOfRequest !== STEP_CHECKOUT &&
                            <button
                                className="mdl-button mr-5 mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-danger button-pill"
                                onClick={this.onCancel}>
                                Cancel
                            </button>}

                            {this.state.stepOfRequest !== STEP_CHECKOUT && this.state.stepOfRequest < STEP_CONFIRM && <button
                                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-info button-pill"
                                onClick={this.onSubmit}>
                                Next
                            </button> }

                            {this.state.stepOfRequest >= STEP_CONFIRM &&
                            <a className="btn btn-info btn-pill  "
                                data-toggle="modal"
                                data-target="#checkoutModal" onClick={()=>{
                                this.onSubmit()
                            }}>CheckOut</a>}

                        </div>

                    </div>

            </div>

            </div>
        );
    }

}

ErrandPostRequest.propTypes = {
    onClickHome : PropTypes.func,
    onClickRegister : PropTypes.func,
}

export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(ErrandPostRequest);

