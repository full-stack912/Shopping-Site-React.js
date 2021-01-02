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


class  ProfileMain extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            isLoading: false,
            avatar: global.curUser.avatar,
            userName: global.curUser.firstName+' '+global.curUser.lastName,
            first_name: global.curUser.firstName,
            last_name: global.curUser.lastName,
            email: global.curUser.email,
            phone: global.curUser.phone,
            is_active: global.curUser.is_active,
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
                                <div className='col-md-2'>
                                    <div className="team-img">
                                        <img src={this.state.avatar || require("../../assets/images/avatar_empty.png")} alt=""/>
                                    </div>
                                </div>
                                <div className='col-md-10'>
                                    <div className="team-details text-left">
                                        <h3>{this.state.userName}</h3>
                                        <p>Customer</p>
                                        <p>{ this.state.is_active==1 ? 'Actived':'Blocked'}</p>
                                    </div>

                                    <div className="team-content">

                                        <div className='row'>
                                            <div className='col-md-3 text-left'>
                                                Email :
                                            </div>
                                            <div className='col-md-9 text-left'>
                                                <strong>{this.state.email}</strong>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-3 text-left'>
                                                Phone :
                                            </div>
                                            <div className='col-md-9 text-left'>
                                                <strong>{this.state.phone}</strong>
                                            </div>
                                        </div>
                                        {/*<div className='row'>*/}
                                        {/*    <div className='col-md-4 text-right'>*/}
                                        {/*        Birthday:*/}
                                        {/*    </div>*/}
                                        {/*    <div className='col-md-8 text-left'>*/}
                                        {/*        <strong>{Constants.formatDate4Y2M2D(global.curUser.dob)}</strong>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="team-link mt-3">
                                        <a href="/update_profile" className="link-icon"><span>Update Profile</span><i className="ti-angle-double-right"></i></a>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    </Animated>
                </div>
            </div>
        );
    }

}

export default ProfileMain;
