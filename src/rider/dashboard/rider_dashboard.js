import React from 'react';
import {  Link } from "react-router-dom";
import PropTypes from 'prop-types';
// import Loader from 'react-loader-spinner'

/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/

// import { Animate } from 'react-move'
// import { easeExpOut } from 'd3-ease'

import Header from "../../header/header";
// import Footer from "../../footer/footer";
// import {Animated} from "react-animated-css";
import ReactNotification from 'react-notifications-component';

// import {
//     BrowserView,
//     MobileView,
//     isBrowser,
//     isMobile
// } from "react-device-detect";



// import BikeTrips from "../../bike/bike_dashboard_pages/bike_trips";
// import ZWalletPage from "../../bike/bike_dashboard_pages/zwallet_page";
import RiderMembership from "./rider_membership";
import RiderProfile from "./rider_profile";
// import BikeMapModal from "../../bike/bike_map_modal";
import RiderRequest from "./rider_request";
import RestAPI from "../../global/RestAPI";
import { Constants } from '../../rglobal/constants';

class  RiderDashboard extends React.Component{



    constructor(props){
        super(props)
        this.state = {
            isShowModal:true,
            isLoading : false,
            lat:null,
            lon:null,
            address:null,
        };
    }

    oldLat = null;
    oldLng = null;


    componentDidMount() {
        this.locationUpdateLoop = this.locationUpdateLoop.bind(this);
        this.getLocation()
        this.locationUpdateLoop()

        // if(global.curUser.memberShip == null){
        //     console.log(window.location.pathname)
        //
        //     global.showNotification('Undefined Membership', 'Please select membership to complete your profile.', 'warning',()=>{
        //         if(window.location.pathname != '/rider_membership'){
        //             window.location.href = '/rider_membership'
        //         }
        //     })
        // }
    }
    

    locationUpdateLoop=()=>{
        setTimeout(()=>{

            let isShare = global.curUser.pickup_available;
            if(isShare == 1){
                
                let mustUpdate = false;                
                if( this.oldLat == null || this.oldLng == null ){
                    this.oldLat = this.state.lat;
                    this.oldLng = this.state.lon;                     
                    mustUpdate = true;
                    
                }else{
                    let dist = Constants.distance(this.state.lat, this.state.lon, this.oldLat, this.oldLng, 'K')
                    console.log('Change location Distance (km) :', dist)
                    if( Math.abs(dist) < 20 ){
                        mustUpdate = false;
                    }else{
                        mustUpdate = true;
                    }
                }
                if( mustUpdate ){
                    RestAPI.geoCodingFromLocationIQ(this.state.lat, this.state.lon, (resAdd,errAdd)=>{
                        let address = "";
                        if(errAdd != null){
    
                        }else{
                            address = resAdd.display_name
                        }
                        // console.log(resAdd.display_name)
                        RestAPI.updateStaffLocation(global.curUser.staff_id, this.state.lat,this.state.lon, address, (res, err)=>{
                            this.locationUpdateLoop()
                        })
                    })
                }else{
                    this.locationUpdateLoop()
                }
                
            
            }else{
                console.log('Location share is stopped, by pickup check. every 5secs lat:'+this.state.lat+' , lon:'+this.state.lon)
                this.locationUpdateLoop()
            }
        }, 5000)
    }

    getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(position => {
                let location = { lat: position.coords.latitude, lon: position.coords.longitude };
                this.setState({
                    lat: location.lat,
                    lon: location.lon
                })
            })
        } else {
            alert("Sorry, geolocation is not available on your device. You need that to use this app");
        }
    }

    render(){
        const {subPath} = this.props
        const isRequest =  subPath === 'request';
        const isMembership =  subPath === 'membership';
        // const isWallet =  subPath === 'wallet';
        const isProfile =  subPath === 'profile';

        return (
            <div>
                <Header isBike={true} backgroundColor={'#fff'}/>
                <div className="page-ttl">
                    <div className="layer-stretch">
                        <div className="page-ttl-container mt-4 mb-4 ">
                            <h1>Rider <span className="text-primary">Dashboard</span></h1>
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
                                                        <Link className={isProfile ? 'nav-link active show': 'nav-link'} to="/rider_profile"><span className='font-16'><i className="icon-user mr-2"></i>Profile</span></Link>
                                                    </li>
                                                    <li className="nav-item w-75 text-left">
                                                        {/*<a className="nav-link active show" href="#home15" data-toggle="tab">Home</a>*/}
                                                        <Link className={isRequest ? 'nav-link active show': 'nav-link'} to={'/rider_requests'}><span className='font-16'><i className="icon-home mr-2"></i>Requests</span></Link>
                                                    </li>
                                                    {/*<li className="nav-item w-75 text-left">*/}
                                                    {/*    /!*<a className="nav-link" href="#profile15" data-toggle="tab">Profile</a>*!/*/}
                                                    {/*    <Link className={isWallet ? 'nav-link active show': 'nav-link'} to={'/rider_wallet'}><span className='font-16'><i className="icon-wallet mr-2"></i>ZWallet</span></Link>*/}
                                                    {/*</li>*/}


                                                    <li className="nav-item w-75 text-left">
                                                        <Link className={isMembership ? 'nav-link active show': 'nav-link'} to="/rider_membership"><span className='font-16'><i className="icon-user mr-2"></i>Membership</span></Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-8">

                                    <div className="row">
                                        <div className='col-md-12'>
                                        <div className='' style={{display: isRequest ? 'inline' : 'none' }}>
                                            <RiderRequest/>
                                        </div>
                                        {/*<div className='' style={{display: isWallet ? 'inline' : 'none' }}>*/}
                                        {/*    <ZWalletPage/>*/}
                                        {/*</div>*/}

                                        <div className='' style={{display: isProfile ? 'inline' : 'none' }}>
                                            <RiderProfile onChangeProfile={()=>{}}/>
                                        </div>
                                        <div className='' style={{display: isMembership ? 'inline' : 'none' }}>
                                            <RiderMembership isRider={true}/>
                                        </div>
                                        </div>

                                    </div>
                                </div>
                                {/*{!isMobile && <div className="col-lg-3"></div>}*/}
                            </div>
                        </div>
                    </div>
                </div>
                <ReactNotification/>
                {/*<Footer />*/}
            </div>
        );
    }

}

RiderDashboard.propTypes = {
    subPath:PropTypes.string,
}

RiderDashboard.defaultProps = {
    duration: '',
    bikes:[]
}

export default RiderDashboard;
