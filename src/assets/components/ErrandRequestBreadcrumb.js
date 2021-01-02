import React from 'react';
import {
    isBrowser,
    isMobile
} from "react-device-detect";

const STEP_REQINF = 1;
const STEP_CHOOSERIDER = 2;
const STEP_CONFIRM = 3;
const STEP_CHECKOUT = 4;
// const DefaultAvatar = require('../../assets/images/avatar_empty.png')


const ErrandRequestBreadcrumb = props =>{
    const {stepOfRequest} = props

    const getBGColorArrowDiv = (index)=>{
        if(index < stepOfRequest){
            return {backgroundColor:'#28a745'}
        }else if(index === stepOfRequest){
            return {backgroundColor:'#17a2b8'}
        }else{
            return {backgroundColor:'#343a40'}
        }
    }

    return (
        <>
            {isBrowser && <div className="row">
                <div className="col-md-6 col-lg-3">
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-begin " style={getBGColorArrowDiv(STEP_REQINF)}>
                            <strong>Request Information</strong>
                        </div>

                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-mid " style={getBGColorArrowDiv(STEP_CHOOSERIDER)}>
                            <strong>Pickup Riders</strong>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-mid " style={getBGColorArrowDiv(STEP_CONFIRM)}>
                            <strong>Confirm Request</strong>
                        </div>

                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-end" style={getBGColorArrowDiv(STEP_CHECKOUT)}>
                            <strong>CheckOut</strong>
                        </div>

                    </div>
                </div>
            </div>}
            {isMobile && <div className="row">
                <div className="col-md-6 col-lg-3" style={{display: this.state.stepOfRequest === STEP_REQINF ? "" : "none"}}>
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-begin " style={getBGColorArrowDiv(STEP_REQINF)}>
                            <strong>Request Information</strong>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3"  style={{display: this.state.stepOfRequest === STEP_CHOOSERIDER ? "" : "none"}}>
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-mid " style={getBGColorArrowDiv(STEP_CHOOSERIDER)}>
                            <strong>Pickup Riders</strong>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3"  style={{display: this.state.stepOfRequest === STEP_CONFIRM ? "" : "none"}}>
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-mid " style={getBGColorArrowDiv(STEP_CONFIRM)}>
                            <strong>Confirm Request</strong>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3"  style={{display: this.state.stepOfRequest >= STEP_CHECKOUT ? "" : "none"}}>
                    <div className="service-card-3" style={{backgroundColor:'#0000'}}>
                        <div className="service-icon-step clip-path-end " style={getBGColorArrowDiv(STEP_CHECKOUT)}>
                            <strong>CheckOut</strong>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default ErrandRequestBreadcrumb;