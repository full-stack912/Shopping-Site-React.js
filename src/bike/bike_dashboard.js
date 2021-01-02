import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";

import Loader from 'react-loader-spinner'

/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/

import { Animate } from 'react-move'
import { easeExpOut } from 'd3-ease'

import Header from "../header/header";
import Footer from "../footer/footer";

import {Animated} from "react-animated-css";
import BikeMapModal from "./bike_map_modal";

import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import BikeTrips from "./bike_dashboard_pages/bike_trips";
import ZWalletPage from "./bike_dashboard_pages/zwallet_page";
import FreeRides from "./bike_dashboard_pages/free_rides_page";
import ProfileMain from "./bike_dashboard_pages/profile_main_part";
import ResultTripPay from "./bike_dashboard_pages/ResultTripPay";



class  BikeDashboard extends React.Component{

    state = {
        isShowModal:true,
        isLoading : false,
    };

    constructor(props){
        super(props)
    }

    componentDidMount() {

    }

    render(){
        const {subPath} = this.props
        const isTrips =  subPath === 'trips';
        const isWallet =  subPath === 'wallet';
        const isFreeRdies =  subPath === 'free_rides';
        const isProfile =  subPath === 'profile';
        const isTripPaySuccess =  subPath === 'bike_req_success';
        const isTripPayFailed =  subPath === 'bike_req_failed';

        return (
            <div>
                <Header isBike={true} backgroundColor={'#fff'}/>
                <div className="page-ttl">
                    <div className="layer-stretch">
                        <div className="page-ttl-container mt-4 mb-4 ">
                            <h1>My <span className="text-primary">Zendas</span></h1>
                        </div>
                    </div>

                </div>
                <div className="blog">

                    <div className="layer-stretch">
                        {/*<div className='text-center'>*/}

                        {/*</div>*/}
                        <div className="layer-wrapper pb-3">

                            <div className="row">
                                {/*{!isMobile && <div className="col-lg-3"></div>}*/}
                                <div className="col-lg-4">
                                    <div className="panel panel-default">
                                        <div className="panel-wrapper">
                                            <div className="panel-body">
                                                <ul className="nav nav-tabs  nav-tabs-line-danger justify-content-center pt-3">
                                                    <li className="nav-item w-75 text-left">
                                                        {/*<a className="nav-link active show" href="#home15" data-toggle="tab">Home</a>*/}
                                                        <Link className={isTrips ? 'nav-link active show': 'nav-link'} to={'/bike_trips'}>
                                                            <span className='font-16'><i className="icon-home mr-2"></i> My Trips</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item w-75 text-left">
                                                        {/*<a className="nav-link" href="#profile15" data-toggle="tab">Profile</a>*/}
                                                        <Link className={isWallet ? 'nav-link active show': 'nav-link'} to={'/bike_wallet'}><span className='font-16'><i className="icon-wallet mr-2"></i>ZWallet</span></Link>
                                                    </li>

                                                    <li className="nav-item w-75 text-left">
                                                        <Link className={isProfile ? 'nav-link active show': 'nav-link'} to="/bike_profile"><span className='font-16'><i className="icon-user mr-2"></i>Profile</span></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-8">

                                    <div className="row text-left pt-2">
                                        <div className='col-md-12'>
                                        <div className='' style={{display: isTrips ? 'inline' : 'none' }}>
                                            <BikeTrips/>
                                        </div>
                                        <div className='' style={{display: isWallet ? 'inline' : 'none' }}>
                                            <ZWalletPage/>
                                        </div>
                                        <div className='' style={{display: isProfile ? 'inline' : 'none' }}>
                                            <ProfileMain/>
                                        </div>
                                        <div className='' style={{display:( isTripPaySuccess || isTripPayFailed) ? 'inline' : 'none' }}>
                                            <ResultTripPay isSuccess={isTripPaySuccess && !isTripPayFailed}/>
                                        </div>
                                        </div>

                                    </div>
                                </div>
                                {/*{!isMobile && <div className="col-lg-3"></div>}*/}
                            </div>
                        </div>
                    </div>
                </div>

                {/*<Footer />*/}
            </div>
        );
    }

}


export default BikeDashboard;
