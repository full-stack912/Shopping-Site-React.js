import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";

import Loader from 'react-loader-spinner'

import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'

import Header from "../../header/header";

import Footer from "../../footer/footer";
import {Animated} from "react-animated-css";
import BikeMapModal from "../bike_map_modal";

import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import ReqItem from "../../data/req_item";
import {Constants} from "../../rglobal/constants";
import {DriverProfile, UserProfile} from "../../data/user_profile";


class  FreeRides extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
        };

    }

    componentDidMount() {

    }


    render(){


        return (
            <div className='align-content-center'>
                <div className="col-md-12">
                    <Animated animationIn="fadeInRight" animationOut="fadeOutRight"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                    <div className="panel panel-default">
                        <div className="panel-head">
                            <div className="panel-title">
                                {/*<i className="icon-wallet panel-head-icon"></i>*/}
                                <i className="icon-badge panel-head-icon mr-2"></i>
                                <span className="panel-title-text">Earn your rides by Invite!</span>
                            </div>
                        </div>
                        <div className="panel-wrapper">
                            <div className="panel-body">
                                <p className="">Invite will give your free rides!</p>
                                <p className=""><h5>Inviting upto 10 friends will give you <span className='text-info'> free rides for 10 km.</span></h5></p>
                                <p className=""><h5>Inviting upto 50 friends will give you <span className='text-info'>free rides for 100 km.</span></h5></p>


                                    <div className="row">
                                        <div className="col-md-12">
                                            <label className="" htmlFor="invite_code">Your Promo Code</label>
                                            <input className="form-control disabled mt-2" type="text" id="invite_code" value={'QW123XadfQWE'}/>
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <label className="" htmlFor="email">Email of Friend</label>
                                            <input className="form-control mt-2" type="text" id="email"/>
                                        </div>
                                    </div>

                            </div>

                        </div>
                        <div className="panel-footer">
                            <div className='text-center'>
                                <button className="btn btn-outline btn-primary btn-main-fill-60 btn-pill ">Send Invite</button>
                            </div>
                        </div>

                    </div>
                    </Animated>


                    <Animated animationIn="fadeInLeft" animationOut="fadeOutLeft"  animationInDuration={1000} animationOutDuration={1000} isVisible={true}>
                    <div className="panel panel-default">
                        <div className="panel-head">
                            <div className="panel-title">
                                <i className="icon-wallet panel-head-icon"></i>

                                <span className="panel-title-text">Current Earning</span>
                            </div>
                        </div>
                        <div className="panel-wrapper">
                            <div className="panel-body">
                                <div className="price"><h4>15 friends accepted your invite.</h4></div>
                                <div className="price"><h4>You have earned <strong className='text-primary'> FreeRides 10km</strong></h4></div>
                            </div>
                        </div>

                    </div>
                    </Animated>


                </div>

            </div>
        );
    }

}


export default FreeRides;
