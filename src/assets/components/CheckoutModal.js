import React, {useState} from 'react';

import {Constants, ZLog} from "../../rglobal/constants";

import {Animated} from "react-animated-css";
import RestAPI from "../../global/RestAPI";
import {SubPulseLoader} from "../../global/SubLoader";

const STEP_REQINF = 1;
const STEP_CHOOSERIDER = 2;
const STEP_CONFIRM = 3;
const STEP_CHECKOUT = 4;
const DefaultAvatar = require('../../assets/images/avatar_empty.png')

const CheckoutModal = (props) => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPwd, setLoginPwd] = useState('');

    const {
        selCarrier,
        selPickLocation,
        selDestLocation,
        onClose,
        onLogin,
        onClickRegister,
        onClickPrev,
        onClickPaymentMethod,
        onNext,
        isLoginMode,
        isPaymentStep,
        checkOutTimeOut,
        isLoading,
        // selPayment
    } = props;

    let [ selPayment , setSelPayment ] = useState(Constants.PaymentMethod.MTN);
    let [ phone, setPhone ] = useState('');
    let [ desc, setDesc ] = useState('');
    // let [ isLoading, setIsLoading ] = useState(false);


    if(selCarrier == null || selPickLocation == null || selDestLocation == null){
        return null
    }

    let distance = Constants.distance(selPickLocation.lat, selPickLocation.lng, selDestLocation.lat, selDestLocation.lng);
    let price = selCarrier.price_per_mile * distance;

    price = Math.round(Math.max(price , selCarrier.min_price)*100)/100;



    const payBtnStyle = (isActive)=>{
        return {
            cursor:'pointer',
            borderBottom: isActive ? 'solid 3px green' : '', paddingBottom:5,
            opacity: isActive ? 1 : 0.5
        }
    };

    const onClickPayOption = (option)=>{
        setSelPayment(option);
        if( onClickPaymentMethod ){
            onClickPaymentMethod(option);
        }
    };

    const validationCheck = ()=>{
        for ( let i =0; i< phone.length ; i++){
            if(isNaN(parseInt(phone[i]))){
                alert('Invalid phone number.')
                return false;
            }
        }

        if( phone.substr(0,2) != '02' ){
            alert('Invalid phone number. It must begin with "02"');
            return false;
        }
        if(phone.length != 10 ){
            alert('Invalid phone number. Length must be 10 digits.');
            return false;
        }

        if( desc.length == 0 ){
            alert('Please input description to describe checkout.');
            return false;
        }
        return true;
    }


    return (
        <div id="checkoutModal" className="modal fade">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Errand Request</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={()=>{
                                    if(onClose){
                                        onClose()
                                    }
                                }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={isPaymentStep === 1}>

                        <div className="modal-body" style={{display:isPaymentStep == 1?'inline':'none'}}>
                            <div className="row mr-1 ml-1 justify-content-center">
                                <div
                                    style={payBtnStyle(selPayment==Constants.PaymentMethod.Airtel)}
                                    className="m-2"
                                    onClick={()=>onClickPayOption(Constants.PaymentMethod.Airtel)}>
                                    <img src={Constants.PayLogo.AIR} alt="AIRTEL" style={{height:50}}/>
                                </div>
                                <div
                                    style={payBtnStyle(selPayment==Constants.PaymentMethod.MTN)}
                                    className="m-2"
                                    onClick={()=>onClickPayOption(Constants.PaymentMethod.MTN)}>
                                    <img src={Constants.PayLogo.MTN} alt="MTN" style={{height:50}}/>
                                </div>
                                <div
                                    style={payBtnStyle(selPayment==Constants.PaymentMethod.TIGO)}
                                    className="m-2"
                                    onClick={()=>onClickPayOption(Constants.PaymentMethod.TIGO)}>
                                    <img src={Constants.PayLogo.TIG} alt="TIGO" style={{height:50}}/>
                                </div>
                                <div
                                    style={payBtnStyle(selPayment==Constants.PaymentMethod.VODA)}
                                    className="m-2"
                                    onClick={()=>onClickPayOption(Constants.PaymentMethod.VODA)}>
                                    <img src={Constants.PayLogo.VOD} alt="VODAFONE" style={{height:50}}/>
                                </div>

                            </div>

                            <div className="row mr-3">
                                <div className="col text-right">
                                    <h4> {Constants.CURRENCY_CODE} {price.toFixed(2)}</h4>
                                </div>
                            </div>
                            {/*<div className={"row"}>*/}
                            <div className={'col-12 text-left'}>
                                <label form={'#phone_number'} >Phone Number</label>
                                <input className="mdl-textfield__input" type="text" id="phone_number"
                                       autoComplete={'off'}
                                       value={phone}
                                       onChange={event=>{
                                           let val = event.target.value;
                                           let newVal = "";
                                           for(let i = 0; i<val.length; i++){
                                               let letter = val.substr(i,1);
                                               if( !isNaN(parseInt(letter)) ){
                                                   newVal += letter
                                               }
                                           }
                                           setPhone(newVal);
                                       }}/>
                                <div>
                                    <span style={{fontSize:12, color:'#55f'}}>( Phone number should be 10 digits in format : 02xxxxxxxx)</span>
                                </div>

                            </div>

                            <div className={'col-12 mt-2 text-left'}>
                                <label form={'#desc_input'} >Description</label>
                                <textarea className="form-control" rows="5" id="desc_input" value={desc}
                                          onChange={event=>{
                                              setDesc(event.target.value)
                                          }}>
                                </textarea>
                            </div>

                        </div>
                    </Animated>
                    <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={isPaymentStep === 2}>
                        <div className="modal-body" style={{display:isPaymentStep === 2?'inline':'none'}}>
                            <div className="row mr-1 ml-1">
                                <div className="col-md">
                                    <div style={{display: global.curUser === null ? 'inherit':'none'}}>
                                        <h4>Lets Continue with Login!</h4>
                                        <p className="mb-4">
                                            To continue, please try to login with your account or create account.
                                        </p>

                                        <div className="layer-stretch" style={{display : isLoginMode ? 'inherit' : 'none'}}>
                                            <div className="layer-wrapper">
                                                <div className="row pt-4">

                                                    <div className="col">
                                                        <div
                                                            className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                            <label className="font-13" htmlFor="email">Email Address</label>
                                                            <input
                                                                className="mdl-textfield__input"
                                                                type="email"
                                                                id="email"
                                                                value={loginEmail}
                                                                onChange={e=>setLoginEmail(e.target.value)}/>
                                                        </div>
                                                        <div
                                                            className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                                            <label className="font-13"
                                                                   htmlFor="password">Password</label>
                                                            <input className="mdl-textfield__input"
                                                                   type="password" id="password" value={loginPwd} onChange={e=>setLoginPwd(e.target.value)}/>

                                                        </div>

                                                        <div className="pt-4 text-center">
                                                            <button
                                                                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                                onClick={()=>{
                                                                    if(onLogin)onLogin(loginEmail, loginPwd)
                                                                }}>Sign In
                                                            </button>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                            <div className="login-link">
                                                <span className="paragraph-small">Don't you have an account?</span>
                                                <a href={'/register'} className="" >Register as New User</a>
                                            </div>
                                        </div>

                                    </div>

                                    <div style={{ display:global.curUser !== null ? 'inherit' : 'none'}}>
                                        <div className="">
                                            <i className="icon-wallet panel-head-icon"></i>
                                            <span className="panel-title-text">
                                                <h5 style={{marginTop:'8px'}}>Payment {selPayment === Constants.PaymentMethod.ZWallet ? 'with ZWallet' : 'from Credit Card'} </h5>
                                            </span>
                                        </div>
                                        <div className="text-left mt-1 ml-4">
                                            <p style={{fontSize:'18px'}}>Amount: {Constants.CURRENCY_CODE} {price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Animated>
                    <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={isPaymentStep === 3}>
                        <div className="modal-body" style={{display:isPaymentStep === 3?'inline':'none'}}>
                            <div className="row mr-1 ml-1">
                                <div className="col-md">
                                    <div>
                                        <h4>Thanks for your checkout!</h4>
                                        <p className="mb-4">`
                                            Rider will reach out you soon.
                                        </p>
                                        <p className="font-14 text-muted">
                                            Redirect To Homepage in <span className="text-info">{checkOutTimeOut}</span>
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </Animated>
                    <div className="modal-footer"
                         style={{
                             justifyContent:'center',
                             display: global.curUser === null && isPaymentStep === 2 || isPaymentStep === 3 ? 'none':'inherit'
                         }}>

                        <div className="row w-100">
                            { isLoading && <SubPulseLoader isLoading={isLoading}/>}
                            {
                                !isLoading && <>
                                    <div className="col-md-6 text-left">
                                        <button className="btn btn-default btn-pill"
                                                onClick={()=>{
                                                    let paymentStep = isPaymentStep  - 1;
                                                    paymentStep = paymentStep <= 1 ? 1 : paymentStep;
                                                    if(onClickPrev)onClickPrev(paymentStep)
                                                    // this.setState({isPaymentStep: paymentStep});
                                                }}
                                        >Prev</button>
                                    </div>
                                    <div className="col-md-6 text-right">

                                        <button
                                            onClick={()=>{

                                                if(!validationCheck()){
                                                    return
                                                }

                                                if(onNext){
                                                    // onNext(isPaymentStep === 2 && global.curUser !== null && selPayment === Constants.PaymentMethod.ZWallet)
                                                    onNext(price, phone, desc, selPayment);
                                                }
                                            }}
                                            style={{display:isPaymentStep === 2 && global.curUser !== null  ? 'none':''}}
                                            className="btn btn-primary btn-pill"
                                        >Post Request
                                        </button>


                                    </div>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutModal