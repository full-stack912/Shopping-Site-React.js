import React from 'react';
// import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import StarRatings from 'react-star-ratings';
// import Loader from 'react-loader-spinner'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/



import {Constants, ZLog} from "../../../rglobal/constants";
import ErrandOrderItem from "../../customer/errand_item";
import ErrandRequestDetail from "../../customer/errand_detail";
import RestAPI from "../../../global/RestAPI";
import {BarLoader} from "react-spinners";
import {SubLoader, SubPulseLoader} from "../../../global/SubLoader";
import $ from "jquery";
import ErrandEmpty from "../../../assets/components/ErrandEmpty";


class  CarrierRequest extends React.Component{

    google = this.props.google
    bounds = new this.props.google.maps.LatLngBounds();

    mapRef = null;
    watchID = null;
    map = null;
    directionsService = null;
    directionsDisplay = null;


    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            selErrandItem: null,
            upcomingList:[],
            pastList:[],
            waitingList:[],
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

    componentDidMount() {

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
            }, err=>{
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
            })

            // this.watchID = navigator.geolocation.watchPosition(position =>{
            //     // const lastPosition = JSON.stringify(position);
            //
            //     ZLog('Watch location in Carrier Request', position);
            //     const coords = position.coords;
            //
            //     this.setState({
            //         currentLocation: {
            //             lat: coords.latitude,
            //             lng: coords.longitude
            //         },
            //     });
            // })
        }

        this.loadData();

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

    loadData(){
        this.setState({isLoading : true })
        RestAPI.getErrandList(this.state.page).then(res=>{
            if( res.success == 1){
                this.setState({
                    upcomingList:  res.data.upcoming.data,
                    pastList: res.data.completed.data,
                    waitingList: res.data.waiting.data,
                })
                ZLog('waiting', res.data.waiting.data)
            }else{
                alert(res.msg)
            }
        }).catch(err=>{
            ZLog('getErrandList', err)
            alert('Failed to get data. please try again.')
        }).finally(()=>{this.setState({isLoading : false })})
    }

    showDetailView = (item)=>{
        this.setState({
            selErrandItem : item
        })
    }

    changeRating = ( newRating, name )=>{
        this.setState({
            rating: newRating
        });
    }


    render(){
        return (
            <div>

                <div className="layer-stretch" style={{marginTop:-25}}>
                    <div className="layer-wrapper">
                        <div className="row" style={{display: this.state.isDetailView ? 'none':''}}>

                            <div className="col-md-12">

                                <div className="panel panel-default">
                                    <SubLoader width={"100%"} isLoading={this.state.isLoading}/>
                                    <div className="panel-wrapper pr-2 pl-2 pb-3">

                                        <div className="tab-content pl-3 pr-3 mt-0">
                                            <div style={{position:'absolute', right:35, top:15}}>
                                                {
                                                    this.state.isLoading ?  null :
                                                        <a href={"#"} onClick={()=>{ this.loadData()}}>
                                                            <i className={"fa fa-redo  fa-lg"}></i>
                                                        </a>
                                                }



                                            </div>


                                            <ul className="nav nav-tabs nav-tabs-line nav-tabs-line-primary">
                                                <li className="nav-item">
                                                    <a className="nav-link active show" href="#waiting" data-toggle="tab">Waiting Payment</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="#home14" data-toggle="tab">Upcoming</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="#profile14" data-toggle="tab">Past</a>
                                                </li>

                                            </ul>
                                            <div role="tabpanel" className="tab-pane p-3 active show" id="waiting">

                                                {
                                                    this.state.waitingList.map( (item, index) =>{
                                                        return (
                                                            <ErrandOrderItem
                                                                key={'waiting_'+index}
                                                                id={'waiting_'+index}
                                                                index={index}
                                                                item={item}
                                                                isPast={false}
                                                                isShowCustomer = {false}

                                                                onClickItem={itemErrand=>{
                                                                    this.showDetailView(itemErrand);
                                                                }}/>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.waitingList.length == 0 && <ErrandEmpty/>
                                                }

                                            </div>
                                            <div role="tabpanel" className="tab-pane p-3" id="home14">

                                                {
                                                    this.state.upcomingList.map( (item, index) =>{
                                                        return (
                                                            <ErrandOrderItem
                                                                key={'upcoming_'+index}
                                                                id={'upcoming_'+index}
                                                                index={index}
                                                                item={item}
                                                                isPast={false}
                                                                isShowCustomer = {false}
                                                                onClickItem={itemErrand=>{
                                                                    this.showDetailView(itemErrand);
                                                                }}/>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.upcomingList.length == 0 && <ErrandEmpty/>
                                                }

                                            </div>
                                            <div role="tabpanel" className="tab-pane p-3" id="profile14">

                                                {
                                                    this.state.pastList.map( (item, index) =>{
                                                        return (
                                                            <ErrandOrderItem
                                                                key={'past_'+index}
                                                                id={'past_'+index}
                                                                index={index}
                                                                item={item}
                                                                isPast={false}
                                                                isShowCustomer = {false}
                                                                onClickItem={itemErrand=>{
                                                                    this.showDetailView(itemErrand);
                                                                }}/>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.pastList.length == 0 && <ErrandEmpty/>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Detail Modal View */}


                <div id="detailModal" className="modal fade w-100">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Details</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12" style={{marginTop:'-40px'}}>
                                        {
                                            this.state.selErrandItem &&
                                            <ErrandRequestDetail
                                                // bounds = {this.state.mapDetailBounds}
                                                google={this.google}
                                                isShowCustomer={false}
                                                errandItem = {this.state.selErrandItem}
                                                currentLocation={this.state.currentLocation}
                                                selCarrier={this.state.selErrandItem.carrier}
                                                selPickupAddr={this.state.selErrandItem.address1}
                                                selDestAddr={this.state.selErrandItem.address2}
                                                selPickLocation={{lat:this.state.selErrandItem.lat1, lng:this.state.selErrandItem.lng1}}
                                                selDestLocation={{lat: this.state.selErrandItem.lat2, lng: this.state.selErrandItem.lng2}}
                                                selSenderName={this.state.selErrandItem.sender_name}
                                                selSenderPhone={this.state.selErrandItem.sender_phone}
                                                selRcverName={this.state.selErrandItem.receiver_name}
                                                selRcverPhone={this.state.selErrandItem.receiver_phone}
                                                selParcelDesc={this.state.selErrandItem.parcel_desc}
                                                selDeliveryDesc={this.state.selErrandItem.delivery_desc}
                                            />
                                        }

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button
                                            className="btn btn-primary btn-main-fill-60 btn-pill m-1" data-dismiss="modal" >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/*End Detail Modal View*/}

                {/* Review Modal */}
                <div id="reviewModal" className="modal fade">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Leave Review</h5>
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
                                                      id="contact-message"></textarea>

                                        </div>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button
                                            className="btn btn-outline btn-primary btn-main-fill-60 btn-pill m-1">Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of Review Modal*/}

            </div>
        );
    }

}

export function showRequestEmpty(){

    return (
        <div >
            <h4>Looks like you haven't picked up a request yet.<small></small></h4>
            <div>
                <img src={require('../../../assets/images/zenda_bike_emo.png')} width={200}/>
            </div>
            <br/><br/>
            {/*<h5>Get a pick up in minutes <small></small></h5>*/}
            <p className="mb-4">Check if you have turn on your pickup availability.</p>
            {/*<Link className="btn btn-primary btn-pill  " to={'/bike'}>Request a Ride</Link>*/}
        </div>
    );
}

// export default RiderRequest;
export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(CarrierRequest);