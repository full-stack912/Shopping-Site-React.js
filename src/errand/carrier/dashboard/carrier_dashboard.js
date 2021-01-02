import React from 'react';
import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner'

/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/

// import { Animate } from 'react-move'
// import { easeExpOut } from 'd3-ease'

import Header from "../../../header/header";
// import Footer from "../../../footer/footer";
// import {Animated} from "react-animated-css";


// import {
//     BrowserView,
//     MobileView,
//     isBrowser,
//     isMobile
// } from "react-device-detect";


// import ZWalletPage from "../../../bike/bike_dashboard_pages/zwallet_page";
// import CarrierMembership from "./carrier_membership";
import CarrierProfile from "./carrier_profile";

import CarrierRequest from "./carrier_request";
// import CarrierRegister from "../carrier_register";
import RiderMembership from "../../../rider/dashboard/rider_membership";

class  CarrierDashboard extends React.Component{

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
        const {subPath} = this.props;
        const isRequest =  subPath === 'request';
        const isMembership =  subPath === 'membership';

        const isProfile =  subPath === 'profile';

        return (
            <div>
                <Header isErrand={true} backgroundColor={'#fff'}/>
                <div className="page-ttl-errand">
                    <div className="layer-stretch">
                        <div className="page-ttl-container mt-4 mb-4 ">
                            <h1>Carrier <span className="text-primary">Dashboard</span></h1>
                        </div>
                    </div>
                </div>
                <div className="blog">

                    <div className="layer-stretch">

                        <div className="layer-wrapper pb-3">

                            <div className="row">
                                <div className="col-12 pb-0">
                                    <div className="panel panel-default pb-0" style={{backgroundColor:'#fff0'}}>
                                        <div className="panel-wrapper pb-0">
                                            <div className="panel-body pt-0 pb-0">
                                                <ul className="nav nav-tabs nav-tabs-line nav-tabs-line-primary" style={{backgroundColor: '#0000'}}>
                                                    <li className="nav-item text-left" style={{backgroundColor:'#0000'}}>
                                                        <Link className={isProfile ? 'nav-link active show': 'nav-link'} to="/carrier_profile" style={{backgroundColor: '#0000'}}><span className='font-16'><i className="icon-user mr-2"></i>Profile</span></Link>
                                                    </li>
                                                    <li className="nav-item text-left" style={{backgroundColor: '#0000'}}>
                                                        <Link className={isRequest ? 'nav-link active show': 'nav-link'} to={'/carrier_requests'} style={{backgroundColor: '#0000'}}><span className='font-16'><i className="icon-home mr-2"></i>Dashboards</span></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-12 pt-0">

                                    <div className="row">
                                        <div className='col-md-12'>

                                        <div className='' style={{display: isRequest ? 'inline' : 'none' }}>
                                            <CarrierRequest/>
                                        </div>

                                        <div className='' style={{display: isProfile ? 'inline' : 'none' }}>
                                            <CarrierProfile onChangeProfile={()=>{}}/>
                                        </div>

                                        <div className='' style={{display: isMembership ? 'inline' : 'none' }}>
                                            {/*<CarrierMembership/>*/}
                                            <RiderMembership isRider={false}/>
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

CarrierDashboard.propTypes = {
    subPath:PropTypes.string,
}

CarrierDashboard.defaultProps = {
    duration: '',
    bikes:[]
}

export default CarrierDashboard;
