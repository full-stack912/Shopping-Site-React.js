import React  from 'react';

import PropTypes from 'prop-types';
import {Animated} from "react-animated-css";

import BikeItem from "./bike_item";

import {Constants} from "../rglobal/constants";
import {BtnNormal} from '../assets/components/btns';
import RestAPI from '../global/RestAPI';

/**** https://www.npmjs.com/package/react-places-autocomplete ****/



class  BikeMapModal extends React.Component{
    google = this.props.google
    bounds = this.props.bounds


    isDidMounted = false;

    constructor(props){
        super(props)

        this.state = {
            getAccept : false,
            fromVal:'',
            toVal: '',
            position1 : null,
            position2 : null,

            numberOfNearByRiders : null,
            curMode: 0,
            tempReq: null,
            isDetailShow: false,
            selItem: this.props.selectedBike,
            tempReqId : null,
            curFocusedIndex : 0, // 0,1 for 2 locations

            feeData: null,
            originRegionName: null,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let selItem = this.props.selectedBike;


    }

    setReceiveAccept = ( isAccepted )=>{
        this.setState({ getAccept : isAccepted })
    }
    
    loadBasicData = ()=>{
        
        if(this.state.originRegionName){
            RestAPI.getFeeData(this.state.originRegionName).then(res=>{
                if( res.success == 1){
                    this.setState({ feeData: res.data})
                }else{
                    alert(res.msg)
                }
            }).catch(err=>{
                alert('Failed to get fee data from server, please try again after reload. ' + err.message)
            }).finally(()=>{})
        }
        
    }
    componentDidMount() {
        
        this.isDidMounted = true
        this.setReceiveAccept =  this.setReceiveAccept.bind(this)
        global.observe.receiveAccept = this.setReceiveAccept
        
        // let options = {
        //     bounds: this.bounds,
        //     types: ['establishment']
        // };
        //

        let input = document.getElementById('where_from');
        let searchBox1 = new this.google.maps.places.SearchBox(input, {
            bounds: this.bounds
        });
        let input2 = document.getElementById('where_to');
        let searchBox2 = new this.google.maps.places.SearchBox(input2, {
            bounds: this.bounds
        });

        input.setAttribute('disabled','disabled');
        input2.setAttribute('disabled','disabled');
        setTimeout(()=>{
            input.removeAttribute('disabled');
            input2.removeAttribute('disabled');
        }, 2000);


        searchBox1.addListener('places_changed', ()=>{
            let places = searchBox1.getPlaces();
            console.log('Places from search box 1 for all data->', places)
            if(places.length > 0){
                let addr1 = places[0].formatted_address;
                let location1 = {
                    lat: places[0].geometry.location.lat(),
                    lng: places[0].geometry.location.lng(),
                }
                this.setState({ curFocusedIndex : 0}, ()=>{
                    this.setCurFocusedLocation(location1.lat, location1.lng);
                })
                

                console.log('searchBox1', addr1, location1);
            }else{
                this.setState({
                    position1: null
                })
            }


        })
        searchBox2.addListener('places_changed', ()=>{
            let places = searchBox2.getPlaces();
            console.log('searchBox2', places);
            if(places.length > 0){
                // let addr2 = places[0].formatted_address;
                let location2 = {
                    lat: places[0].geometry.location.lat(),
                    lng: places[0].geometry.location.lng(),
                }

                this.setState({ curFocusedIndex : 1}, ()=>{
                    this.setCurFocusedLocation(location2.lat, location2.lng);
                })
                

            }else{
                this.setState({
                    position2: null
                })
            }
        })

        // if(this.props.selectedBike){
        //     this.onClickBike(this.props.selectedBike)
        // }
    }

    setCurFocusedLocation = (lat, lng)=>{
        RestAPI.geoCodingFromLocationIQ(lat, lng, (res, err)=>{
            console.log('Result from geoCodingfro mLocation: ',res, err)
            if(err== null && res != null){
                let addr = res.display_name
                
                let location = {
                    lat: lat,
                    lng: lng,
                }
                
                if( this.state.curFocusedIndex == 0 ){
                    this.input1Ref.value = addr
                    let regionName = res.address ? res.address.state : null;
                    
                    this.setState({
                        position1: {
                            addr: addr,
                            location:location
                        },
                        originRegionName:regionName
                    }, ()=>{
                        if( this.props.onSelectedOriginRegionName ){
                            this.props.onSelectedOriginRegionName(regionName)
                        }
                        
                        this.onLocationSelected()
                        this.loadBasicData()

                    })
                    
                }else if(this.state.curFocusedIndex == 1){
                    this.input2Ref.value = addr
                    this.setState({
                        position2: {
                            addr: addr,
                            location:location
                        }
                    })
                    this.onLocationSelected()
                }                
            }
        
        })
    }


    onLocationSelected = ()=>{
        if(this.chkAddressAvailable()){

            let mode = this.getModeString(this.state.curMode)

            this.props.onLocation2Selected(this.state.position1, this.state.position2, mode)

        }

    }

    getModeString = (mode)=>{
        let modeStr = null;
        switch(mode){
            case 0:
                modeStr = 'DRIVING';
                break;
            case 1:
                modeStr = 'BICYCLING';
                break;
            case 2:
                modeStr = 'TRANSIT';
                break;
            case 3:
                modeStr = 'WALKING';
                break;
            default: 
                modeStr = 'DRIVING';
                break;
        }
        return modeStr;
    }

    
    chkAddressAvailable = ()=>{
        let input = document.getElementById('where_from');
        let input2 = document.getElementById('where_to');

        if(this.state.position1 === null){
            input.focus();
            return false
        }

        if(this.state.position2 === null){
            input2.focus();
            return false
        }
        return true
    }

    onSelMode = (mode)=>{

        this.setState({curMode:mode})
        let modeStr = this.getModeString(mode);

        if(this.chkAddressAvailable()){
            this.props.onLocation2Selected(this.state.position1, this.state.position2, modeStr)
        }

    }

    onClickBike = (data)=>{
        console.log('click from modal')
        if(this.props.onSelectBike){
            this.props.onSelectBike(data)
        }
        this.setState({
            selItem: data,
            isDetailShow: true,
        })
    }

    renderBikes = () => {

        return this.props.bikes.map((data, index) => {
            return(
                <BikeItem data={data}
                          duration = {this.props.duration}
                          distance = {this.props.distance}
                          durationSecs = {this.props.durationSecs}
                          onClickItem={()=>{this.onClickBike(data)}} />
            )

        })
    }

    renderBikeTable = ()=>{
        
        if(this.props.bikes.length > 0 && false){
            let item_list = this.renderBikes()
            return (
                <table className="table table-striped bc-w">
                    <tbody>
                        {item_list}
                    </tbody>
                </table>
            )
        }else{
            let disabled = this.state.position1 == null || this.state.position2 == null ? true : false
            let disabledTitle = "";
            if(disabled){
                disabledTitle = "Input address of origin and destination."
            }

            disabled = this.props.tempReq != null || disabled

            if(this.props.tempReq!= null){
                disabledTitle = "Waiting response from riders..."
            }

            return (<>
                
                { this.state.getAccept ? 
                    <>
                        <div className={'pt-3'}>
                            <BtnNormal                                
                                disabledTitle={disabledTitle}
                                title={'Check Trip Schedule'}
                                onClick={()=>{
                                   window.location.href = "/bike_trips"
                                }}
                            />
                        </div>
                    </>
                : <>
                <div className={'pt-3'}>
                    
                    <BtnNormal
                        disabledTitle={disabledTitle}
                        title={'Post request'}
                        disabled={disabled}
                        onClick={()=>{
                            if(this.props.onClickPostNew){
                                this.props.onClickPostNew(this.state.position1, this.state.position2, this.state.originRegionName, (success, riderLen)=>{
                                    this.setState({ numberOfNearByRiders : riderLen })
                                    if(success){
                                        if(riderLen > 0){
                                            
                                        }
                                    }else{

                                    }
                                })
                            }
                        }}
                    />  

                </div>
                {
                    disabled && 
                    <div className={'row justify-content-center pt-2'}>
                        <span>
                            or you can click location on map <br/> which is origin or destination.
                        </span>
                    </div>
                }
                
                </>
                 }
                
                </>
            )
        }

    }

    closeDetail=()=>{

        this.setState({isDetailShow: false})

    }


    renderDetailView = (data)=>{

        const {bike_photo, bike_name, price, seats, base_fare, color, min_fare, cancel_fee, per_km, price_per_mile, description} = data;

        return (
            <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isDetailShow}>

            <div>
                <div style={{position:'absolute', top:10, left:10 , zIndex:1}}  onClick={this.closeDetail}><i className="fa fa-times fa-lg"/></div>
                <div class='col-md-12 overflow-auto-bike-detail bc-w' >

                    <div class="row bc-w pr-3 pl-3 pt-3 pb-3">
                        <img src={bike_photo || require("../assets/images/empty.jpg")} width={'100%'} alt="Image of Bike"/>
                    </div>
                    <div className="row bc-w">
                        <div className="col-md-12 text-right"><h6>{bike_name}</h6></div>
                    </div>
                    <div className="row bc-w">
                        <div className="col-md-2 text-left"><img src={data.user.avatar || require("../assets/images/avatar_empty.png")} className="fixed_avatar-50" width={'50px'}/></div>
                        <div className="col-md-10 text-left">
                            <h5>{data.user.first_name+' '+data.user.last_name}</h5>
                            <strong><a href={"mailto:"+data.user.email} className="text-primary"><i className="fa fa-envelope"></i>&nbsp;&nbsp;{data.user.email}</a></strong><br/>
                            <strong><a href={"tel:"+data.user.phone_number} className="text-primary"><i className="fa fa-phone"></i>&nbsp;&nbsp;{data.user.phone_number}</a></strong>
                        </div>
                    </div>
                    {/*<div className="row bc-w">*/}
                    {/*    <div className="col-md-6 text-left"><h5>{color}</h5></div>*/}
                    {/*    <div className="col-md-6 text-right"><strong> {Constants.CURRENCY_CODE} {Constants.calcMilePrice(this.props.distance, price_per_mile)}</strong></div>*/}
                    {/*</div>*/}
                    <div className="row bc-w">
                        <div className="col-md-6 text-left">
                            <h5>in {data.distance} miles </h5>
                        </div>

                        <div className="col-md-6 text-right"><strong> {Constants.CURRENCY_CODE} {Constants.calcMilePrice(this.props.distance, price_per_mile)}</strong></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 text-left"><strong>Price per mile</strong></div>
                        <div className="col-md-6 text-right"><strong>{Constants.CURRENCY_CODE} {data.price_per_mile}</strong></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 text-left"><strong>Min price</strong></div>
                        <div className="col-md-6 text-right"><strong>{Constants.CURRENCY_CODE} {data.min_price}</strong></div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-left"><strong>License</strong></div>
                        <div className="col-md-12 text-left pl-4">{data.bike_license}</div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-left"><strong>Reg Number</strong></div>
                        <div className="col-md-12 text-left pl-4">{data.bike_reg_number}</div>
                    </div>

                </div>
                <div className="col-md-12 w-100" style={{paddingTop:'20px', paddingBottom:'10px'}}>
                    {this.props.distance!== null && <div className="col-md-12">
                        <a className="btn btn-primary btn-pill  "  data-toggle="modal"
                           data-target="#paymentModal" onClick={()=>{
                            if(this.props.onClickRequest){
                                this.props.onClickRequest();
                            }
                        }}>Request</a>
                    </div>}
                    {this.props.distance === null &&
                        <div className="col-md-12 ml-2">
                            <a onClick={this.closeDetail} className="text text-success">Please input your trip origin and destination.</a>
                        </div>
                    }

                    
                </div>
            </div>
            </Animated>
        )
    }

    render(){

        const {isDetailShow, selItem} = this.state;
        let isShowList = !(isDetailShow && selItem !== null);
        let defClass = "btn btn-outline btn-default btn-pill btn-outline-2x m-1";
        let warnClass = "btn btn-outline btn-warning btn-pill btn-outline-2x m-1";
        return (
            <div class="view-on-map" >
                <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={isShowList}>
                    <div style={{display: isShowList ? 'inline':'none'}}>
                        <div class="top-header-modal" style={{ paddingLeft:'60px'}}>
                            <div style={{borderRadius:'50%', background:this.state.position1 ===  null ? '#bbb' : '#afa', position:'absolute', top:'30px', left:'25px', width:'10px', height:'10px'}}>&nbsp;</div>
                            <div style={{background: this.state.position1 && this.state.position2 ? '#fff' :'#bbb' , position:'absolute', top:'42px', left:'28px', width:'3px', height:'46px'}}>&nbsp;</div>
                            <div style={{background: this.state.position2 === null ? '#bbb' : '#ff654d', position:'absolute', top:'90px', left:'25px', width:'10px', height:'10px'}}>&nbsp;</div>
                            <div class="row form-group">
                                <div className="col-md-12 " >
                                    <input
                                        ref={ref=>this.input1Ref = ref}
                                        id={'where_from'}
                                        onChange={event=>{
                                            console.log(event)
                                        }}
                                        type="text" class="form-control"
                                        placeholder="From Where..."
                                        style={{fontSize: '15px', border: this.state.curFocusedIndex == 0 ? 'solid 3px #ff654d' : ''}}
                                        onFocus={()=>this.setState({ curFocusedIndex : 0 })}
                                        />
                                </div>
                            </div>
                            <div class="row form-group" style={{marginBottom:'0px'}}>
                                <div class="col-md-12 " >
                                    <input
                                    ref={ref=>this.input2Ref = ref}
                                        id={'where_to'}
                                        type="text"
                                        onChange={event=>{
                                            console.log(event)
                                        }}
                                        class="form-control"
                                        placeholder="Where To..."
                                        onFocus={()=>this.setState({ curFocusedIndex : 1 })}
                                        style={{fontSize: '15px', border: this.state.curFocusedIndex == 1 ? 'solid 3px #ff654d' : ''}}
                                        />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                                <button
                                    className={this.state.curMode === 0 ? warnClass : defClass}
                                    onClick={()=>{this.onSelMode(0)}}>
                                    &nbsp;<i className="fa fa-car fa-lg"></i>&nbsp;
                                </button>

                                <button
                                    className={this.state.curMode === 3 ? warnClass : defClass}
                                    onClick={()=>{this.onSelMode(3)}}
                                >
                                    &nbsp;<i className="fa fa-blind fa-lg"></i>&nbsp;
                                </button>
                            
                            </div>
                            <div  className="row">
                                <div className="col-md-5 text-right" >
                                    <span>{ this.props.duration ? 'Duration:' : ''}</span>
                                </div>
                                <div className="col-md-7 text-left" >
                                    <span>{ this.props.duration ? this.props.duration : ''}</span>
                                </div>
                            </div>
                            <div  className="row">
                                <div className="col-md-5 text-right" >
                                    <span>{ this.props.distance ? 'Distance: ' : ''}</span>
                                </div>
                                <div className="col-md-7 text-left" >
                                    <span>{ this.props.distance ? Constants.convMToKm(this.props.distance) + 'Km' : ''}</span>
                                </div>
                            </div>
                        {
                            this.state.feeData && <div>
                                <div  className="row">
                                    <div className="col-md-5 text-right" >                                
                                        <span>{ this.props.distance ? 'Estimated Price: '  : ''}</span>
                                    </div>
                                    <div className="col-md-7 text-left" >
                                        <span>{ this.props.distance ?  Constants.CURRENCY_CODE + ( Constants.convMToKm(this.props.distance) * parseFloat(this.state.feeData.price_km) + parseFloat(this.state.feeData.price) ).toFixed(2) : ''}</span>
                                    </div>
                                </div>
                                <div  className="row">
                                    <div className="col-md-5 text-right" >
                                        <span>Fee :</span>                                
                                    </div>
                                    <div className="col-md-7 text-left" >
                                        <span>{Constants.CURRENCY_CODE} {this.state.feeData.price}</span>                                
                                    </div>
                                </div>
                                <div  className="row">
                                    <div className="col-md-5 text-right" >
                                        <span>Price per Km :</span>                                
                                    </div>
                                    <div className="col-md-7 text-left" >
                                        <span>{Constants.CURRENCY_CODE} {this.state.feeData.price_km}</span>                                
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-md-12" >
                            <span>{ this.props.bikes ? 'There are '+ this.props.bikes.length +' riders nearby who can confirm your request.' : ''}</span>
                            {/* <span>{ this.state.numberOfNearByRiders > 0 ? 'There are '+ this.state.numberOfNearByRiders +' riders nearby who can confirm your request.' : ''}</span> */}
                        </div>
                        <div className="col-md-12">
                            <div className='clearfix'/>
                        </div>
                        <div className="col-md-12 overflow-auto-bike-items bc-w">
                            {this.renderBikeTable()}
                        </div>

                    </div>
                </Animated>

                {this.state.isDetailShow &&  this.state.selItem !== null && this.renderDetailView(this.state.selItem)}

            </div>
        );
    }

}

BikeMapModal.propTypes = {
    google : PropTypes.object.isRequired,
    bounds : PropTypes.object.isRequired,
    onLocation2Selected : PropTypes.func.isRequired,
    duration : PropTypes.string,
    durationSecs : PropTypes.number,
    distance: PropTypes.number,
    onToggleModal: PropTypes.func.isRequired,
    bikes:PropTypes.array,
    onSelectBike:PropTypes.func,
    selectedBike:PropTypes.object,
    onClickRequest: PropTypes.func,
    onClickPostNew : PropTypes.func.isRequired,

}

BikeMapModal.defaultProps = {
    duration: '',
    bikes:[]
}
export default BikeMapModal;

