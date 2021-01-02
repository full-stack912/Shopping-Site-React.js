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


class  ZWalletPage extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            showEmpty: true,
            showDeposit: true,
            showBalance: true,
            balance: 0.0
        };
    
    }

    componentDidMount() {

    }


    render(){


        return (
            <div>
                <div className="col-md-12">
                    <Animated animationIn="fadeInRight" animationOut="fadeOutRight"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.showEmpty}>
                    <div className="panel panel-default">
                        <div className="panel-head">
                            <div className="panel-title">
                                <i className="icon-wallet panel-head-icon"></i>
                                <span className="panel-title-text">No Deposited</span>
                            </div>
                        </div>
                        <div className="panel-wrapper">
                            <div className="panel-body">
                                <p className="">You have not deposited your ZWallet.</p>
                                <p className=""><h5>All services will be paid by ZWallet here, you can enjoy everything without any additional payment way.</h5></p>
                                <button className="btn btn-outline btn-primary btn-main-fill-60 btn-pill m-1">Deposit</button>
                            </div>
                        </div>

                    </div>
                    </Animated>

                    <Animated animationIn="fadeInLeft" animationOut="fadeOutLeft"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.showBalance}>
                    <div className="panel panel-default">
                        <div className="panel-head">
                            <div className="panel-title">
                                <i className="icon-wallet panel-head-icon"></i>

                                <span className="panel-title-text">My ZWallet Balance</span>
                            </div>
                        </div>
                        <div className="panel-wrapper">
                            <div className="panel-body">
                                <div className="price"><h4>{Constants.CURRENCY_CODE} {this.state.balance.toFixed(2)} </h4></div>                            
                            </div>
                        </div>
                        <div className="panel-footer">
                            <button className="btn btn-primary btn-outline btn-main-fill-60 btn-pill m-1">Deposit More</button>
                        </div>
                    </div>
                    </Animated>

                    <Animated animationIn="fadeInRight" animationOut="fadeOutRight"  animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.showDeposit}>
                    <div className="panel panel-default">
                        <div className="panel-head">
                            <div className="panel-title">
                                <i className="icon-wallet panel-head-icon"></i>

                                <span className="panel-title-text">Deposit to ZWallet</span>
                            </div>
                        </div>
                        <div className="panel-wrapper">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="" htmlFor="card_number">Card Number</label>
                                        <input className="form-control" type="number" id="card_number"/>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="yymm">YY/MM</label>
                                        <input className="form-control" type="number" id="yymm"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="cvc">CVC</label>
                                        <input className="form-control" type="number" id="cvc"/>
                                    </div>

                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel-footer">
                            <div className="text-center">
                                <button className="btn btn-primary btn-outline btn-main-fill-60 btn-pill">Deposit <strong>{Constants.CURRENCY_CODE} 150</strong></button>
                            </div>
                        </div>
                    </div>
                    </Animated>


                </div>

            </div>
        );
    }

}


export default ZWalletPage;
