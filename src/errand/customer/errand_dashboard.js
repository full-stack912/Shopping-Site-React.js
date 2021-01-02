import React from 'react';
import Header from "../../header/header";

import StarRatings from "react-star-ratings";
import ReactModal from 'react-modal';

import ErrandRequestDetail from './errand_detail'
import {GoogleApiWrapper} from "google-maps-react";
import {Constants, ZLog} from "../../rglobal/constants";
import ErrandOrderItem from "./errand_item";
import RestAPI from "../../global/RestAPI";
import $ from 'jquery';

import ErrandEmpty from "../../assets/components/ErrandEmpty";
import {SubLoader, SubPulseLoader} from "../../global/SubLoader";

class  ErrandDashboard extends React.Component{

    google = this.props.google
    bounds = new this.props.google.maps.LatLngBounds();

    state = {
        isDetailView : false,
        isLoading: false,
        rating :0,
        description: '',
        waitingList:[],
        upcomingList:[],
        pastList: [],
        currentLocation: null,
        page: 1,
        selErrandItem: null,
    }
    constructor(props){
        super(props)
    }


    componentDidMount() {
        this.getCurLocation()
        this.loadData();

    }

    getCurLocation(callback){
        ZLog('Begin Get Location')
        if (navigator && navigator.geolocation) {
            ZLog('Navigator is valid get location')
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
                }, ()=>{
                    if(callback){
                        callback( { lat: coords.latitude, lng: coords.longitude })
                    }
                })
            });

            navigator.geolocation.watchPosition(position => {
                ZLog('Watch position:', position);
                this.setState({
                    currentLocation: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                }, ()=>{
                    // if(callback){
                    //     callback( { lat: coords.latitude, lng: coords.longitude })
                    // }
                })
            })
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

    changeRating = ( newRating, name )=>{
        console.log('newRating: ', newRating)

        this.setState({
            rating: newRating
        });
    }

    onChangeDescription = (e)=>{

        this.setState({ description: e.target.value}, ()=>{
            console.log('description:', this.state.description)
        })

    }

    onSubmit = ()=>{

        console.log('description: ', this.state.description, this.state.rating)


    }


    showDetailView = (itemErrand)=>{
        this.setState({
            isDetailView: true,
            selErrandItem : itemErrand,
        })
    }



    render(){
        const { waitingList, upcomingList, pastList } = this.state
        return (
            <div>
                <Header
                    isErrand={true}
                    backgroundColor={'#fff'}
                />
                <div className={"page-ttl-errand "}>
                    <div className={"layer-stretch"}>
                        <div className={"page-ttl-container"}>
                            <h1>Errand <span className={"text-primary"}>Orders</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Errand Orders</span></p>
                        </div>
                    </div>
                </div>

                <div class="layer-stretch">
                    <div class="layer-wrapper">
                        <div className="row" >
                            <div className="col-md-2">

                            </div>
                            <div className="col-md-8">
                                <div className="panel panel-default">
                                    <SubLoader width={"100%"} isLoading={this.state.isLoading}/>
                                    <div className="panel-wrapper pr-2 pl-2 pb-3">
                                        <div style={{position:'absolute', right:35, top:15}}>
                                            {
                                                this.state.isLoading ?  null :
                                                <a href={"#"} onClick={()=>{
                                                    this.loadData()

                                                    ZLog('confirm modal',$('#confirmModal'))
                                                }}>
                                                    <i className={"fa fa-redo  fa-lg"}></i>
                                                </a>
                                            }


                                        </div>
                                        <ul className="nav nav-tabs nav-tabs-line nav-tabs-line-primary">
                                            <li className="nav-item">
                                                <a className="nav-link active show" href="#waiting" data-toggle="tab">Waiting Payment</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link " href="#upcoming" data-toggle="tab">Upcoming</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#past" data-toggle="tab">Past</a>
                                            </li>

                                        </ul>
                                        <div className="tab-content pl-3 pr-3">
                                            <div role="tabpanel" className="tab-pane active show" id="waiting">
                                                {
                                                    waitingList.map((item, index)=>{
                                                        return <ErrandOrderItem
                                                                   key={'waiting'+index}
                                                                   id={'waiting'+index}
                                                                   index={index}
                                                                   item={item}
                                                                   isPast={false}
                                                                   isShowCustomer = {false}
                                                                   onRemovedItem={itemErrand=>{
                                                                       if( itemErrand ){
                                                                           let list = this.state.waitingList;
                                                                           let idx = list.findIndex(one=> one.id === itemErrand.id);
                                                                           list.splice(idx, 1);
                                                                           this.setState({ waitingList: list });
                                                                       }
                                                                   }}
                                                                   onClickItem={itemErrand=>{
                                                                        this.showDetailView(itemErrand);
                                                                   }}
                                                                />
                                                    })
                                                }
                                                {
                                                    waitingList.length == 0 &&  <ErrandEmpty/>
                                                }
                                            </div>
                                            <div role="tabpanel" className="tab-pane" id="upcoming">
                                                {
                                                    upcomingList.map((item, index)=>{
                                                        return <ErrandOrderItem
                                                            key={'upcoming'+index}
                                                            id={'upcoming'+index}
                                                            index={index}
                                                            item={item}
                                                            isPast={false}
                                                            isShowCustomer = {false}
                                                            onRemovedItem={itemErrand=>{
                                                                if( itemErrand ){
                                                                    let list = this.state.upcomingList;
                                                                    let idx = list.findIndex(one=> one.id === itemErrand.id);
                                                                    list.splice(idx, 1);
                                                                    this.setState({ upcomingList: list });
                                                                }
                                                            }}
                                                            onClickItem={itemErrand=>{
                                                            this.showDetailView(itemErrand);
                                                        }} />
                                                    })
                                                }
                                                {
                                                    upcomingList.length == 0 &&  <ErrandEmpty/>
                                                }
                                            </div>
                                            <div role="tabpanel" className="tab-pane" id="past">
                                                {
                                                    pastList.map((item, index)=>{
                                                        return <ErrandOrderItem key={'past'+index} id={'past'+index} index={index} item={item} isPast={true} isShowCustomer = {false} onClickItem={itemErrand=>{
                                                            this.showDetailView(itemErrand);
                                                        }} />
                                                    })
                                                }
                                                {
                                                    pastList.length == 0 &&  <ErrandEmpty/>
                                                    }
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
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
                                <h5 className="modal-title">Leave Review for {'Driver XX'}</h5>
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
                                                      id="review_description" onChange={e=>this.onChangeDescription(e)}></textarea>

                                        </div>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button
                                            onClick={this.onSubmit}
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


// ErrandDashboard.propTypes = {
    // onClickHome : PropTypes.func,
    // onClickRegister : PropTypes.func,
// }

// export default ErrandDashboard;

export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(ErrandDashboard);

