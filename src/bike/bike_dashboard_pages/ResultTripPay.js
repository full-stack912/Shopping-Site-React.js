import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";

import Loader from 'react-loader-spinner'

import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'

import Header from "../../header/header";

import Footer from "../../footer/footer";
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';
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


class  ResultTripPay extends React.Component{

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
                    <div className="">
                        <div className="team-block-1">
                            <div className="row">
                                {this.props.isSuccess ? <div className="col-12">
                                    <i className="far fa-check-circle fa-5x text-success"/>
                                    <h3 className="text-success">You have paid successfully!</h3>
                                    <h4 >Rider will be pick up you soon.</h4>
                                    <hr/>
                                    <Link className="text-success" to={'/bike_trips'}><span className='font-16'>Go To My Trips</span></Link>
                                </div> : <div className="col-12">
                                    <i className="fas fa-exclamation-triangle text-danger fa-5x" ></i>
                                    <h3 className="text-danger">Failed to payment!</h3>
                                    <h4 >Please check your payment source, and try again.</h4>
                                    <hr/>
                                    <Link className="text-primary" to={'/bike'}><span className='font-16'>Go To Home</span></Link>
                                    </div>}

                            </div>
                        </div>
                    </div>
                    </Animated>
                </div>
            </div>
        );
    }
}
ResultTripPay.propTypes = {
    isSuccess : PropTypes.bool.isRequired,
}
export default ResultTripPay;
