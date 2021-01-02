import React from 'react';
// import {Animated} from "react-animated-css";
// import PropTypes from 'prop-types';

import {BikeProfile, UserProfile} from "../../../data/user_profile";
// import Header from "../../../header/header";
import {Constants} from "../../../rglobal/constants";

const Step_ProfileRegister = 1;
const Step_Plan = 2;
const Step_Finalize = 3;

const Plan_Beginner  = 100;
const Plan_Professional  = 101;
const Plan_Ultimate  = 102;

class  CarrierMembership extends React.Component{

    state={

    };

    constructor(props){
        super(props)

    }


    componentDidMount() {
    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }

    onChangeProfile = ()=>{
      
        // global.setUser(newUser);
        if(this.props.onChangeProfile){
            this.props.onChangeProfile();
        }

    };

    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="panel panel-default">
                            <div className="panel-head">
                                <div className="panel-title">Membership</div>

                            </div>
                            <div className="panel-body">
                                <div className="row">
                                <div className="col-md-4">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="pricing01">
                                                <div className="" style={{}}>
                                                    <div className="pricing-title">
                                                        {/*<i className="icon-screen-desktop"></i>*/}
                                                        <h2>Beginner</h2>
                                                        <small>Recommended for Beginner</small>
                                                    </div>
                                                    <div className="pricing-box">
                                                        <span className="sup">{Constants.CURRENCY_CODE}</span><span className="price">5</span><span
                                                        className="unit">Per Month</span>
                                                    </div>
                                                </div>
                                                <div className="pricing-body">
                                                    <ul>
                                                        <li>Max Delivery Distance 100Km</li>
                                                        <li>Customers In 5 miles</li>
                                                        <li>Optional Location Share</li>
                                                    </ul>
                                                </div>
                                                <div className="pricing-footer">
                                                    <button className="btn btn-primary btn-pill" onClick={()=>{
                                                        // this.onSelectPlan(Plan_Beginner)
                                                    }}>Downgrade</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="row">

                                        <div className="col-md-12">
                                            <div className="pricing01">
                                                <div className="btn-outline-info" style={{ }}>
                                                    <div className="pricing-title">
                                                        {/*<i className="icon-screen-desktop"></i>*/}
                                                        <h2>Professional</h2>
                                                        <small>Current Plan</small>
                                                    </div>
                                                    <div className="pricing-box">
                                                        <span className="sup">{Constants.CURRENCY_CODE}</span><span className="price">10</span><span
                                                        className="unit">Per Month</span>
                                                    </div>
                                                </div>
                                                <div className="pricing-body">
                                                    <ul>
                                                        <li>Unlimited Delivery Distance </li>
                                                        <li>Customers In 20 miles</li>
                                                        <li>Realtime Location Share</li>
                                                    </ul>
                                                </div>
                                                <div className="pricing-footer">
                                                    <button className="btn btn-primary btn-pill disabled">Selected</button>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="row">

                                        <div className="col-md-12">
                                            <div className="pricing01">
                                                <div className="" style={{}}>
                                                    <div className="pricing-title">
                                                        {/*<i className="icon-screen-desktop"></i>*/}
                                                        <h2>Ultimate</h2>
                                                        <small>Recommended for Fulltime Riders</small>
                                                    </div>
                                                    <div className="pricing-box">
                                                        <span className="sup">{Constants.CURRENCY_CODE}</span><span className="price">20</span><span
                                                        className="unit">Per Month</span>
                                                    </div>
                                                </div>
                                                <div className="pricing-body">
                                                    <ul>
                                                        <li>Unlimited Delivery Distance</li>
                                                        <li>Customers In 50 miles</li>
                                                        <li>Realtime Location Share</li>
                                                    </ul>
                                                </div>
                                                <div className="pricing-footer">
                                                    <button className="btn btn-primary btn-pill"
                                                            onClick={()=>{}}
                                                    >Upgrade</button>
                                                </div>
                                            </div>
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
CarrierMembership.propTypes = {
    // onChangeProfile : PropTypes.func,
}

export default CarrierMembership;
