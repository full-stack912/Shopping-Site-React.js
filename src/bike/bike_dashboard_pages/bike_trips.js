import React , {useState, useRef}  from 'react';
import { Link } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { SubLoader, SubClipLoader } from "../../global/SubLoader"

import {Animated} from "react-animated-css";

import {Constants} from "../../rglobal/constants";
// import $ from 'jquery'
import RestAPI from "../../global/RestAPI";
import AllReviews from "./AllReviews";


export const GetPrice = (data)=>{
    let val = parseFloat( data.amount)
    let price = val ? val.toFixed(2) : 0.0
    let region = data.region ? data.region : ( data.temp_req ? data.temp_req.region : null) 
    
    console.log('Distance Timereq selected region : ', region, data)
    if( region ){
        let minPrice = parseFloat(region.price);
        let priceKm = parseFloat( region.price_km);
        price = parseFloat(data.trip_distance) / 1000 * priceKm + minPrice;
        price = price.toFixed(2)        
        return price
    }else{
        return 0;
    }
}

export const DistanceTimeReq = props => {
    const { data } = props
    
    let val = parseFloat( data.amount)
    let price = val ? val.toFixed(2) : 0.0
    let isEsimated = false
    let region = data.region ? data.region : ( data.temp_req ? data.temp_req.region : null) 
    console.log('Distance Timereq selected region : ', region, data)
    if( region ){
        let minPrice = parseFloat(region.price);
        let priceKm = parseFloat( region.price_km);
        price = parseFloat(data.trip_distance) / 1000 * priceKm + minPrice;
        price = price.toFixed(2)        
        isEsimated = true;
    }
    
    return (<>
        <div className="comment-post text-info">
            {isEsimated ? 'Estimated Price:' : ''} {Constants.CURRENCY_CODE} {price} , Distance: {Constants.convMToKm(data.trip_distance) }Km
        </div>
        <div className="comment-post text-info">
            Estimated time of arrival at destination : {Constants.secsToHumanTime(data.trip_duration_secs)}
        </div>
        </>
    )
}
export const CustomerRiderDistance = props => {
    const { data, forCustomer } = props
    let firstWord = forCustomer ? 'Rider' : 'Customer'
    let dist = null;
    let time = null;
    if(data.rider ){
        dist =   Constants.distance(data.rider.staff.lat, data.rider.staff.lon, data.customer_lat, data.customer_lng, 'K')
        dist = dist.toFixed(2)
        console.log('CustomerRideDistance, ********<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', data.rider.staff.lat, data.rider.staff.lon, data.customer_lat, data.customer_lng, dist, data)
        time = (dist / 60)
        time = Constants.secsToHumanTime(time * 3600) ;
    }

    
    // let distanceKm = data.trip_distance / 1000;
    // distanceKm = distanceKm.toFixed(2)

    
    
    return (
        <div className="comment-post text-default">                            
            { firstWord + ' is in ' + dist + 'Km,  can arrive in about '+ time }
        </div>
    )
    
}


export const PaymentModal = ({isShow,  data, payOptions})=>{
    
    let [ selPayment, setSelPayment ] = useState('MTN');
    let [ isLoading , setIsLoading ] = useState(false)

    let [ phone, setPhone ] = useState('');
    let [ desc, setDesc] = useState('');

    // let [ payOptions, setPayOptions ] = useState(initPayOptions)
    // alert(JSON.stringify(data))
    let staticOptionList = [Constants.PaymentMethod.Airtel, Constants.PaymentMethod.MTN, Constants.PaymentMethod.TIGO, Constants.PaymentMethod.VODA];
    
    let modalRef = useRef();
    
    const containsPayOption = (option)=>{
        console.log(typeof payOptions, payOptions)
        if( !payOptions ){
            return false;
        }
        let res = false;
        for(let i =0; i<payOptions.length ; i++){
            if( payOptions[i].code == option ){
                res = true;
                break;
            }
        }
        
        return res;
    }

    const onPayComplete = ()=>{
        
        
        setIsLoading(true)



        let trdata = {
            currency_code:data.currency_code,
            amount:data.amount,
            trx_source:selPayment,
            trx_platform:'bike',
            action:'waiting_hook',
            rcv_id:data.rider_id,
            sender_id:data.customer_id,
            net:data.net,
            fee:data.fee,
            req_id:data.id
            //merchant_reference:
            //merchant_id:
        }
        
        
        RestAPI.createTransaction(trdata).then(res=>{
            
            if( res.success == 1){
                
                let callbackUrl =   "https://admin.zendasgh.com/api/callbackKorba?transaction_id=UNIQUE_ID&status=SUCCESS&message=MESSAGE";

                let body = {
                    "customer_number": phone,
                    "amount": Constants.number2FixedDecimalString(data.amount) ,    
                    "transaction_id": res.data.trx_id,
                    "network_code": res.data.trx_source,
                    "callback_url":  callbackUrl,
                    "description": desc + " From zendas bike service.",
                    "client_id": "117",
                    "payer_name": data.customer.first_name+' '+data.customer.last_name,
                    "extra_info":"req_id:"+data.id,
                    // "vodafone_voucher_code":"vodafone_voucher_code"
                 }
                 if( selPayment == 'VOD'){
                     body.vodafone_voucher_code = '' // voda code
                 }
                 console.log('JSON BOdy for collect api:', body)
                 

                 RestAPI.korba_Collect(body).then(reskorba=>{
                     console.log('reskorba:  ', reskorba)
                    
                    if( reskorba.success == true){
                        alert(reskorba.results)
                        
                        RestAPI.completeRequest(trdata.req_id, (res, err)=>{ 
                        })
                        
                    }else{
                        alert(reskorba.error_message)
                        RestAPI.removeFailedTrx(res.data.id)
                    }
                 }).catch(errkorba=>{
                    console.log('errkorba:  ', errkorba)
                     console.log('Failed to pay, ' , errkorba)
                    alert('Failed to pay, ' + JSON.stringify(errkorba))
                    RestAPI.removeFailedTrx(res.data.id)
                 }).finally(()=>{
                    setIsLoading(false)
                 })
                
            }else{
                setIsLoading(false)
                alert('Failed to create transaction, because ' + res.msg)
            }
        }).catch(err=>{
            setIsLoading(false)
            console.log(' While Create Transaction:', err)
            alert('Failed to create transaction, please try again.')    
        }).finally(()=>{
            
        })
    
    
    }
    
    let price =  data ? parseFloat( data.amount) : 0

    return <>
        <div id="paymentCompleteModal" className="modal fade" ref={ref => modalRef = ref}>
        <div className="modal-dialog" role="document">
            
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Completed Request #{data ? data.id : ''}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={true}>
                    <div style={{position:'absolute', top:0, left:0,width:'100%'}}>
                        {/* <SubLoader isLoading={isLoading}/> */}
                    </div>
                    <div className="modal-body" style={{display:'inline'}}>
                        <div className="row mr-1 ml-1 pl-3" >
                            <span style={{fontSize:15}}>Let's complete request with payment for driver!</span>
                        </div>
                        <div className="row mr-1 ml-1 justify-content-center"> 
                            { 
                                staticOptionList && staticOptionList.map((code, index)=>{
                                    if( containsPayOption(Constants.PaymentMethod.Airtel) ){
                                        return <div 
                                                    key={index}
                                                    style={{
                                                        cursor:'pointer',
                                                        borderBottom: selPayment == code ? 'solid 3px green' : '', paddingBottom:5,
                                                        opacity: selPayment == code ? 1 : 0.5
                                                    }}
                                                    className="m-2"  
                                                    onClick={()=>{setSelPayment(code) }}>
                                                    <img src={Constants.PayLogo[code]} alt="airtel" style={{height:50}}/>
                                                </div>
                                    
                                    }else{
                                        return null;
                                    }
                                })
                                 
                                
                            }   
                            
                        </div>                               
                        
                        <div className="row mr-3">
                            <div className="col text-right">
                                <h4> {data ? data.currency_code : '$'}{data ? price.toFixed(2) : 0.00}</h4>
                            </div>                                
                        </div>
                        {/*<div className={"row"}>*/}
                            <div className={'col-12'}>
                                <label form={'#phone_number'} >Phone Number</label>
                                <input className="mdl-textfield__input" type="text" id="phone_number"
                                   autoComplete={'off'}
                                   value={phone}
                                   onChange={event=>{
                                       let val = event.target.value;
                                       let newVal = "";
                                       for(let i = 0; i<val.length; i++){
                                           let letter = val.substr(i,1);
                                           if( !isNaN(parseInt(letter)) ){
                                               newVal += letter
                                           }
                                       }
                                       setPhone(newVal);
                                   }}/>
                                <div>
                                    <span style={{fontSize:12, color:'#55f'}}>( Phone number should be 10 digits in format : 02xxxxxxxx)</span>
                                </div>



                            </div>

                        {/*</div>*/}
                        {/*<div className={"row"}>*/}

                            <div className={'col-12 mt-2'}>
                                <label form={'#desc_input'} >Description</label>
                                <textarea className="form-control" rows="5" id="desc_input" value={desc}
                                          onChange={event=>{
                                            setDesc(event.target.value)
                                        }}>
                                </textarea>
                            </div>
                            <div className={'col-3'}></div>
                        {/*</div>*/}
                    </div>
                </Animated>
                <div className="modal-footer"
                     style={{
                         justifyContent:'center',
                         display: global.curUser === null ? 'none':'inherit'
                     }}>
                    
                    <div className="row w-100">
                        <div className="col-md-6 text-left">
                         
                        </div>
                        <div className="col-md-6 text-center">
                            
                            { 
                                isLoading ? <SubClipLoader isLoading={isLoading}/> : 
                            <button 
                                onClick={()=>{
                                    if( isLoading ){return }
                                    onPayComplete() 
                                }} 
                                className="btn btn-primary btn-pill" >
                                Pay & Complete
                            </button>
                            }
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
    </>

}

export const WaitingItem = ({data, index, onClickRequestMapView, onCanceled})=>{
        
    let [ isLoading, setIsLoading ] = useState(false)
  
    
    return(
            <li key={index}>
                <div className="row">
                    <div  className = {"col-12"} style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>                        
                        <div>
                            <span className = {"text text-default text-sm pl-2"}>ID: { '#' + data.id }</span>                        
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}> 
                            <span className={"text text-danger"}>{Constants.timeDiff(data.created_at)}</span>
                            <div  style={{ color:'#ff654d', marginLeft:10}} //position:'absolute', right:'10px', top:'15px',
                            >                            
                                <a
                                    data-toggle="modal"
                                    data-target={"#mapModal"}
                                    href="#" className="mr-2"
                                    onClick={()=>{ onClickRequestMapView(data) }}
                                >
                                <i className="fa fa-map-marker fa-lg  fa-info-circle"></i></a>
                                <button onClick={()=>{
                                    if( isLoading ){
                                        return 
                                    }

                                    let chk = window.confirm('Are you sure cancel this request?')
                                    if(chk){
                                        setIsLoading(true)
                                        RestAPI.cancelTempReq(data.id).then(res=>{
                                            if(res.success === 1){
                                                // this.loadingRequest()
                                                if( onCanceled ){
                                                    onCanceled();
                                                }
                                                
                                            }else{
                                                alert('Failed to cancel, try again after a moment.')
                                            }
                                        }).catch(err=>{
                                            alert('Failed to cancel request, ')
                                        }).finally(()=>{setIsLoading(false)})                                        
                                    }

                                }} className="text-primary">
                                    { isLoading ? <SubLoader isLoading={isLoading}/> : <i className="fa fa-trash fa-lg  fa-info-circle"></i>} 
                                </button>
                            </div>
                        </div>
                        
                    </div> 

                    <div className={'col-12'}>                            
                        <div className="comment-post">
                            <span className="text-info">From:</span>{data.address1}
                        </div>
                        <div className="comment-post">
                            <span className="text-info">To:</span> {data.address2}
                        </div>
                        <DistanceTimeReq data = {data}/>
                        
                       
                    </div>
                </div>
                
            </li>
        );
    
}




class  BikeTrips extends React.Component{
    directionsService = null;
    directionsDisplay = null;

    constructor(props){
        super(props)

        this.state = {
            isLoading: true,
            curPageNo : 0,
            upcomingList : [],
            pastList:[],
            waitingList: [],
            selUserID:null,
            selRider:null,
            isShowEmpty : true,
            isShowAllReviews : false,
            selRequest : null,
            mapCenter:{
                lat: 47.49855629475769,
                lng: -122.141844169
            },
            currentLocation:{
                lat: 47.49855629475769,
                lng: -122.141844169
            },
            selData:null,

            PayOptions : null,
        };
    
    }

    componentDidMount() {
        this.loadBasicData();
        this.loadingRequest()
    }

    loadBasicData = ()=>{

        let hash = Constants.generateHash({clientId:117});
        console.log(hash)
        
        RestAPI.korba_CollectNetworkOptions().then(res=>{            
            this.setState({ PayOptions: res})            
            console.log(res)
        }).catch(err=>{
            alert('Somethings wrong while collecting basic data.')
            console.log(err)
        }).finally(()=>{
            
        })
        
        
    }
    loadingRequest=()=>{

        this.setState({isLoading: true})
        RestAPI.getCustomerRequests(10, this.state.curPageNo || 0, (res, err)=>{
            this.setState({isLoading: false})
            if(err !== null){
                // alert('Failed to load data, try again.')
                console.log('err while getcustomerrequests: ', err, res)
            
                return
            }
            if(res.success === 1){
                let isShowEmpty = (res.data.upcoming.length + res.data.pasts.length) <= 0
                this.setState({
                    upcomingList: res.data.upcoming,
                    pastList: res.data.pasts,
                    isShowEmpty: isShowEmpty,
                    waitingList: res.data.waiting.data
                })
            
            }else{
                alert('Some issues are there, please try to load again.')
                return
            }
        })

    }

    render5Stars = (point)=>{
        if(point <= 0) {
            return (
                <div>
                    <i key={'star1'} className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i key={'star2'} className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i key={'star3'} className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i key={'star4'} className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i key={'star5'} className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                </div>
            )
        }

        let starList = [];
        [1,2,3,4,5].forEach((value, index1) => {
            if(point >= value){
                starList.push(<i key={'star'+index1} className="fa fa-star" style={{color:'#ff654d'}}></i>)
            }else{
                starList.push(<i key={'star'+index1} className="fa fa-star" style={{color:'#b9b9b9'}}></i>)
            }
        })
        
        return (
            <div>
                {starList}
            </div>
        )

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

    getBounds = (locations)=>{
        let bounds = new this.props.google.maps.LatLngBounds();
        bounds.extend(this.state.currentLocation);
        let count = 1;
        // let minLat = 0;
        if(locations){
            locations.forEach(location=>{
                bounds.extend(location);
                count ++;
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
    onClickRequestMapView = (item)=>{

        let pos1 = {lat: parseFloat(item.lat1) , lng: parseFloat(item.lng1) }
        let pos2 = {lat: parseFloat(item.lat2) , lng: parseFloat(item.lng2)}
        let posCustomer = {lat: parseFloat(item.customer_lat || item.user_lat), lng: parseFloat(item.customer_lng || item.user_lng)}
        this.setState({
            selRequest: item,
        })

        this.calcRoute(pos1, pos2)
        this.getBounds([posCustomer, pos1, pos2])
    }

    showUpcomingItem = (data, index)=>{
        let defBikePhoto = require('../../assets/images/empty_bike.png')
        let bikePhoto = defBikePhoto;
        let riderName = "";
        let regNumber = "";
        let phoneNumber = "";
        if(data.rider ){
            phoneNumber = data.rider.phone_number;
            if(data.rider.staff){
                bikePhoto = data.rider.staff.photo;
                regNumber = data.rider.staff.bike_reg_number;
            }
            riderName = Constants.ucFirst(data.rider.first_name)+' '+Constants.ucFirst(data.rider.last_name)
        }
        let reviewMark = 0;
        let reviewsCount = data.rider.reviews_count;
        if(data.rider.reviews_count > 0){
            reviewMark = data.rider.reviews_mark
        }

        let payStatus = 'Not Paid';
        
        if(data.transaction && data.transaction.length){
            
            switch(data.transaction[0].action){
                case 'waiting_hook': 
                    payStatus="On Processing";
                    break;
                case 'payment': 
                    payStatus="Paid";
                    break;
                case 'refund': 
                    payStatus="Refunded";
                    break;
                case 'failed': 
                    payStatus="Failed";
                    break;
                default:
                    payStatus="Not Paid";
            }
        }
        
        bikePhoto = bikePhoto || defBikePhoto


        return (
            <li key={index}>
                <div className="row">
                    <div  className = {"col-12"} style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>                        
                        <div>
                            <span className = {"text text-default text-sm pl-2"}>ID: { '#' + data.id }</span>                        
                        </div>
                        <span className={"text text-danger"}>Payment: {payStatus}</span>
                    </div>
                    <div className="col-2 hidden-xs-down pr-0 comment-img">
                        <img src={bikePhoto} alt="" style={{resize:'cover'}}/>                    
                    </div>
                    <div className="col-10 comment-detail text-left">
                        <div className="row">
                            <div className="col" style={{display:'flex',flexDirection:'row'}}>
                                <span><h4>{riderName}</h4></span>

                                <div className={'pl-2'}>
                                    <button                         
                                        
                                        data-toggle="modal"
                                        data-target={"#paymentCompleteModal"}
                                        className="btn btn-outline btn-sm btn-success btn-pill btn-outline-1x m-1" 
                                        onClick={(e)=>{
                                            this.setState({ selData: data })
                                            // let res = window.confirm('Are you sure that this request was completed?')
                                            
                                            // if(res){
                                            //     this.setState({isLoading:true})
                                            //     RestAPI.completeRequest(data.id, (res, err)=>{
                                            //         this.setState({isLoading:false})
                                            //         this.loadingRequest()
                                            //     })
                                            // }
                                        
                                        }}>Completed
                                    </button>
                                </div>
                            </div>
                            

                        
                            
                        </div>
                        
                        <div className="comment-post d-flex flex-row justify-content-between align-items-center">
                            <div className="row">
                                <div className="col">
                                    <div className="rating pt-1 d-flex flex-row align-items-center justify-content-start" style={{width:80}}>
                                        {this.render5Stars(reviewMark)}
                                    </div>
                                </div>
                                <div className="col" title="See All">
                                    <a className="text-primary" onClick={()=>{
                                        this.setState({
                                            selUserID: data.rider_id,
                                            selRider: data.rider,
                                            isShowAllReviews: true,
                                        })
                                    }}>({reviewsCount}reviews)</a>
                                </div>
                            </div>

                            <div className="comment-post text-right">
                                <span className="text-success"> {data.updated_human_diff} {Constants.ucFirst(data.status)}</span>
                            </div>
                        </div>
                       
                    </div>
                    <div className={'col-12'}>
                            <div className="mt-1">
                                <span className="text-info">Reg Number:</span> {regNumber} &nbsp;&nbsp;&nbsp; <span className="text-info">Phone:</span> {phoneNumber}
                            </div>
                            <div className="comment-post">
                                <span className="text-info">From:</span>{data.address1}
                            </div>
                            <div className="comment-post">
                                <span className="text-info">To:</span> {data.address2}
                            </div>
                            <DistanceTimeReq data = {data}/>
                            <CustomerRiderDistance data = {data} forCustomer = {true} />
                            {/* <div className={data.payment_status === 'paid' ? "comment-post text-success" :  "comment-post text-primary"}>
                                {data.payment_status === 'paid' ? 'PAID' : 'NOT PAID'}
                            </div> */}

                            <ul className="comment-action pt-1" style={{display: data.rider_comment == null ? '' : 'none'}}>
                                <li>
                                    <a href="#"
                                    data-toggle="modal"
                                    data-target={"#reviewModal"+data.id}>
                                        <i className="far fa-comment-alt fa-lg text-primary"></i>&nbsp; Leave comment
                                    </a>
                                </li>
                            </ul>
                            
                            
                            <div style={{position:'absolute', right:'10px', top:'15px', color:'#ff654d'}}>
                            <a href={"tel:"+phoneNumber} className="mr-3">
                                <i className="fa fa-phone fa-lg  fa-info-circle"></i>
                            </a>
                            <a
                                data-toggle="modal"
                                data-target={"#mapModal"}
                                href="#" className="mr-2"
                                onClick={()=>{
                                    this.onClickRequestMapView(data)
                                }}
                            >
                                <i className="fa fa-map-marker fa-lg  fa-info-circle"></i></a>
                            <button onClick={()=>{
                                let chk = window.confirm('Are you sure cancel this request?')
                                if(chk){
                                    this.setState({isLoading:true})
                                    RestAPI.canceledRequest(data.id, (res, err)=>{
                                        this.setState({isLoading:false})
                                        if(err !== null){
                                            alert('Failed to cancel request')
                                            return
                                        }
                                        if(res.success === 1){
                                            this.loadingRequest()
                                        }else{
                                            alert('Failed to cancel, try again after a moment.')
                                        }
                                    })
                                }

                            }} className="text-primary">
                                <i className="fa fa-trash fa-lg  fa-info-circle"></i>
                            </button>


                        </div>
                        </div>
                </div>
                
            </li>
        );
    }
    showUpcomingList = (dataList)=>{
        let list = [];
        // console.log(dataList)
        dataList.map((item, index)=>{
            list.push(this.showUpcomingItem(item, index))
        });
        return list
    }

    showPastItem= (data, index) => {

        let bikePhoto = require('../../assets/images/empty_bike.png')
        let riderName = "";
        let regNumber = ""
        let phoneNumber = ""
        let riderAvatar = require('../../assets/images/avatar_empty.png');
        if(data.rider ){
            phoneNumber = data.rider.phone_number
            if(data.rider.staff){
                bikePhoto = data.rider.staff.photo
                regNumber = data.rider.staff.bike_reg_number
            }
            riderName = Constants.ucFirst(data.rider.first_name)+' '+Constants.ucFirst(data.rider.last_name)
            riderAvatar = data.rider.avatar
        }
        let reviewMark = 0;
        let reviewsCount = data.rider ? data.rider.reviews_count : 0;
        if(data.rider != null && data.rider.reviews_count > 0){
            reviewMark = data.rider.reviews_mark
        }
        
        let payStatus = 'Unknown';
        
        if(data.transaction && data.transaction.length){
            
            switch(data.transaction[0].action){
                case 'waiting_hook': 
                    payStatus="On Processing";
                    break;
                case 'payment': 
                    payStatus="Paid";
                    break;
                case 'refund': 
                    payStatus="Refunded";
                    break;
                case 'failed': 
                    payStatus="Failed";
                    break;
                default:
                    payStatus="Not Paid";
            }
        }
        

        return (
            <li key={index}>
                <div className="row">
                    <div  className = {"col-12 text-right"}>
                        <span className = {"text text-default text-sm pl-2"}>ID: { '#' + data.id }</span>
                    </div>
                    <div className="col-2 hidden-xs-down pr-0 comment-img">
                    <img style={{width:80, borderRadius:10}} src={bikePhoto} alt="" />
                    
                    </div>

                    <div className="col-10 comment-detail text-left">
                            <div className=" d-flex flex-row justify-content-between w-100">
                                <div className="d-flex flex-row justify-content-start ">
                                    <img src={riderAvatar} alt="" style={{borderRadius:'50%', width:60,height:60}}/>
                                    <div className="comment-meta pl-2">
                                        <span>{riderName}</span>
                                        <div className="comment-post ">
                                            <div className="rating pt-1 d-flex flex-row align-items-center justify-content-start">
                                                <div className="d-flex flex-row justify-content-start align-items-center" style={{width:80}}>
                                                    {this.render5Stars(reviewMark)}
                                                </div>
                                                &nbsp;&nbsp;
                                                <div className="col" title="See All">
                                                    <a className="text-primary" onClick={()=>{
                                                        this.setState({
                                                            selUserID: data.rider_id,
                                                            selRider: data.rider,
                                                            isShowAllReviews: true,
                                                        })
                                                    }}>({reviewsCount}reviews)</a>
                                                </div>
                                            </div>

                                        </div>
                                        <div style={{position:'absolute', right:'10px', top:'55px', color:'#ff654d'}}>
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
                                            <a href={"tel:"+phoneNumber} className="mr-3">
                                                <i className="fa fa-phone fa-lg  fa-info-circle"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className=" d-flex flex-row justify-content-between">
                                    {/*<span>{riderName}</span>*/}
                                    <div className=" text-right">
                                        {/*<div>*/}
                                        {/*    */}
                                        {/*</div>*/}
                                        <div>
                                            <span className={data.status == "canceled" ? "text-danger" : "text-info"}>{data.updated_human_diff} &nbsp;{Constants.ucFirst(data.status)}</span>
                                            
                                        </div>
                                        <div>
                                            <span className={"text-danger"}>{payStatus}</span>
                                        </div>
                                        
                                    </div>

                                </div>

                            </div>
                        {/*</div>*/}

                        <div className="comment-post">
                            <div className="row">
                                <div className="col-md-1 text-info">
                                    Phone:
                                </div>
                                <div className="col-md-11">
                                    {phoneNumber}
                                </div>
                            </div>
                            <div className="row">
                            <div className="col-md-1 text-info">
                                From:
                            </div>
                            <div className="col-md-11">
                                {data.address1}
                            </div>
                            </div>
                            <div className="row">
                            <div className="col-md-1  text-info">
                                To:
                            </div>
                            <div className="col-md-11">
                                {data.address2}
                            </div>
                            </div>
                        </div>
                        
                        <DistanceTimeReq data = {data}/>
                        <CustomerRiderDistance data = {data} forCustomer = {true} />
                        
                        {data.rider_mark != null && <div className="comment-post pl-2">
                            <div className="d-flex flex-row justify-content-start">
                                <div >
                                    <img className="fixed_avatar-40" src={data.customer.avatar || require('../../assets/images/avatar_empty.png')} width={30}/>
                                </div>
                                <div >
                                    <div className="rating pt-1 pb-1">
                                        {this.render5Stars(data.rider_mark)}
                                    </div>
                                    {data.rider_comment == null ? '' :
                                        <div>
                                            <i className="far fa-comment-alt fa-lg text-primary"></i>&nbsp;{data.rider_comment}
                                            <br/>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>}

                        <ul className="comment-action pt-1" style={{display: data.rider_mark == null && data.status != "canceled"  ? '' : 'none'}}>
                            <li>
                                <a href="#"
                                   data-toggle="modal"
                                   data-target={"#reviewModal"+data.id}>
                                    <i className="far fa-comment-alt fa-lg text-primary"></i>&nbsp; Leave comment
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

    changeRating = ( newRating, name )=>{
        console.log('newRating: ', newRating)

        this.setState({
            rating: newRating
        });
    }

    reviewModalRender = (postList)=>{
      return   postList.map((item, index)=>{
          if(item.rider == null){
              return null;
          }
            return (
                <div id={"reviewModal"+item.id} className="modal fade" key={item.id}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Leave Review for {'Driver '+Constants.ucFirst(item.rider.first_name)+' '+Constants.ucFirst(item.rider.last_name)}</h5>
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
                                            <textarea className="form-control" rows="3" id={"contact-message"+item.id}></textarea>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button
                                            data-dismiss="modal"
                                            onClick={()=>{
                                                let cmtid = "contact-message"+item.id
                                                let commentInput = document.getElementById(cmtid);
                                                this.setState({isLoading: true})
                                                RestAPI.leaveReview(item.id, commentInput.value, this.state.rating, global.curUser.role, (res, err)=>{
                                                    this.setState({isLoading: false})

                                                   if(err!= null){
                                                        alert('Failed to leave review, try again.')
                                                        return
                                                    }
                                                    if(res.success === 1){
                                                        this.loadingRequest()
                                                    }else{
                                                        alert('Failed to leave review. try again after refresh.'+JSON.stringify(res))
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


        })
    }
    
    render(){
        
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-wrapper">
                        <SubLoader isLoading={this.state.isLoading}/>
                        {!this.state.isLoading && !this.state.isShowAllReviews && <div className="panel-body">
                            <ul className="nav nav-tabs nav-tabs-line nav-tabs-line-danger">
                            <li className="nav-item">
                                    <a className="nav-link active" href="#waiting"
                                       data-toggle="tab">Waiting</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#upcoming"
                                       data-toggle="tab">Upcoming</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#past"
                                       data-toggle="tab">Past</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div role="tabpanel" className="tab-pane active" id="waiting">
                                    <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.showBalance}>
                                        <div className="panel panel-default">                                            
                                            <div className="panel-wrapper">
                                                <div className="panel-body">
                                                    <ul className='comment-list'>
                                                        {/* {this.showUpcomingList(this.state.upcomingList)} */}
                                                        {
                                                            this.state.waitingList.map((waitingItem, index)=>(
                                                                <WaitingItem 
                                                                    data={waitingItem} 
                                                                    index={index}
                                                                    onClickRequestMapView={this.onClickRequestMapView}
                                                                    onCanceled={()=>{
                                                                        let list = this.state.waitingList;
                                                                        list.splice(index, 1);
                                                                        this.setState({ waitingList: list })
                                                                    
                                                                    }}/>
                                                            ))
                                                        }
                                                    </ul>
                                                    {this.state.waitingList.length <= 0 && showBikeEmpty()}
                                                </div>
                                            </div>

                                            {/*<div className="panel-footer"></div>*/}
                                        </div>
                                    </Animated>
                                </div>
                                
                                <div role="tabpanel" className="tab-pane" id="upcoming">
                                    <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.showBalance}>
                                        <div className="panel panel-default">
                                            {/*<div className="panel-head">*/}
                                            {/*    <div className="panel-title"></div>*/}
                                            {/*</div>*/}
                                            <div className="panel-wrapper">
                                                <div className="panel-body">
                                                    <ul className='comment-list'>
                                                        {this.showUpcomingList(this.state.upcomingList)}
                                                    </ul>
                                                    {this.state.upcomingList.length <= 0 && showBikeEmpty()}
                                                </div>


                                            </div>

                                            {/*<div className="panel-footer"></div>*/}
                                        </div>
                                    </Animated>
                                </div>
                                
                                <div role="tabpanel" className="tab-pane" id="past">
                                    
                                    <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.showBalance}>
                                        <div className="panel panel-default">
                                            {/*<div className="panel-head">*/}
                                            {/*    <div className="panel-title"></div>*/}
                                            {/*</div>*/}
                                            <div className="panel-wrapper">
                                                <div className="panel-body">
                                                    <ul className='comment-list'>
                                                        {this.showPastList(this.state.pastList)}
                                                    </ul>
                                                    {this.state.pastList.length <= 0 && showBikeEmpty()}
                                                </div>
                                            </div>
                                            {/*<div className="panel-footer"></div>*/}
                                        </div>
                                    </Animated>
                                    <br/>
                                    {this.state.isShowEmpty ?
                                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.isShowEmpty}>
                                            <strong>Nothing yet.</strong>
                                            <br/>
                                            <div className='row'>
                                                {showBikeEmpty()}
                                            </div>
                                        </Animated> : null}

                                </div>

                            </div>

                            <div style={{position:'absolute', top:40, right:40}}>
                                <a href={"#"} onClick={()=>{
                                    this.loadingRequest()
                                }}>
                                    <i className={"fa fa-redo  fa-lg"}></i>
                                </a>
                            </div>
                        </div>}

                        {this.state.selUserID != null && this.state.isShowAllReviews &&
                            <AllReviews
                                onClose={()=>{
                                    this.setState({
                                        selUserID: null,
                                        selRider: null,
                                        isShowAllReviews: false,
                                    })
                                }}
                                rider={this.state.selRider}
                                user_id={this.state.selUserID}/>}

                    </div>
                </div>

                {this.reviewModalRender(this.state.upcomingList)}
                {this.reviewModalRender(this.state.pastList)}

                
                {/* Show Map View */}

                <div id="mapModal" className="modal fade">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Location </h5>
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
                <PaymentModal isShow={true} data={this.state.selData} payOptions={this.state.PayOptions}/>
            </div>
        );
    }

}

export function showBikeEmpty(){

    return (
        <div >
            <h4 className="text-center">Looks like you haven't taken a trip yet.<small></small></h4>
            <div className="text-center">
                <img src={require('../../assets/images/zenda_bike_emo.png')} width={200}/>
            </div>
            <br/><br/>
            <h5 className="text-center">Get a ride in minutes <small></small></h5>
            {/*<p className="mb-4">Book an Bike from a web browser, no app install necessary.</p>*/}
            <div className="text-center">
                <Link className="btn btn-primary btn-pill  " to={'/bike'}>Request a Ride</Link>
            </div>


        </div>
    );
}


export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(BikeTrips);

// export default BikeTrips;
