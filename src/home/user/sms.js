import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';
import Login from "./login";
import ProfileRegister from "./profile_register";
import firebase from "firebase";
import {initializedFirebaseApp} from "../../init-fcm";
import { Constants } from '../../rglobal/constants';

class  SMSComp extends React.Component{

    phoneVerifyConfirmResult = null;
    constructor(props){
        super(props)

        this.state={
            isShowVerifyCode: false,
            isShowProfile: false,
            phone:'',
        }
    }



    componentDidMount() {

        // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
        //     {
        //         size:"normal"
        //         // other options
        //     });

        // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': function(response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              console.log("reCAPTCHA solved, allow signInWithPhoneNumber.", response)
            },
            'expired-callback': function() {
              // Response expired. Ask user to solve reCAPTCHA again.              
              console.log("expired-callback")
              alert('Expired Callback')
            }
          });

        setTimeout(()=>{
            this.setState({phone:''})
        }, 500)

    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }

    onSubmit = ()=>{

        if(this.phoneVerifyConfirmResult != null){

            this.phoneVerifyConfirmResult.confirm(this.state.code).then((res)=> {
                console.log('verify code check res', res)
                this.setState({
                    isShowVerifyCode: false,
                    isShowProfile: true
                })
            }).catch((err)=> {
                console.log('verify code check err', err)
                alert('Code verification is failed.')
            })
        }else{
            alert('Confirm object is null.')
        }
    }

    onClick=() =>{
        // let phoneNumber = '';
        
        // for( let i=0; i< this.state.phone.length ; i++){
        //     let char = this.state.phone.substr(i,1)
        //     if( !isNaN(parseInt(char))){
        //         phoneNumber += char;
        //     }
        // }
        // phoneNumber = Constants.COUNTRY_CODE + phoneNumber;
        
        
        
        const appVerifier = window.recaptchaVerifier;
        console.log( this.state.phone, appVerifier);
        // alert(phoneNumber)
        // return ;
        firebase
            .auth(initializedFirebaseApp)
            .signInWithPhoneNumber(this.state.phone, appVerifier)
            .then(confirmResult => {
                // success

                // let verificationCode = window.prompt('Please enter the verification ' +
                //     'code that was sent to your mobile device.');
                // console.log(verificationCode)
                console.log( confirmResult );
                alert('SMS code has been sent, please confirm code.')

                this.phoneVerifyConfirmResult  = confirmResult
                this.setState({
                    isShowVerifyCode: true,
                })

            
                // confirmResult.confirm(verificationCode).then(function (res) {
                //     console.log('verify code check res', res)
                // }).catch(function (err) {
                //     console.log('verify code check err', err)
                // })

            })
            .catch(error => {
                // error
                console.log('errr', error)
                alert('Oops, it shows some error:  '+ error.message)
            
            });
    }
    
    onVerify = ()=>{
        const appVerifier = window.recaptchaVerifier;
        appVerifier.verify()
    }
    
    render(){
        return (
            <div>
            <div style={{display: this.state.isShowProfile ? 'none' : 'inline'}}>
                <div className="page-ttl">
                    <div className="layer-stretch">
                        <div className="page-ttl-container">
                            <h1>Register <span className="text-primary"></span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Phone Verification</span></p>
                        </div>
                    </div>
                </div>
                <div className="layer-stretch">
                    <div className="layer-wrapper">
                        
                        <div className="row pt-4">
                            <div className="col"></div>    
                            <div className="col" >
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                <label className="" htmlFor="phone_number">Phone Number (ex: +233242223344)</label>
                                    <div className={'d-flex flex-row'}>
                                        {/*<span className={'mr-2 pt-1'} style={{color:Constants.COLORS.gray}}>{Constants.COUNTRY_CODE}</span>*/}
                                        
                                        <input className="mdl-textfield__input" type="text" id="phone_number"
                                            autoComplete={'off'}
                                            // value={this.state.phone}
                                            onChange={event=>{
                                                    // let val = event.target.value;
                                                    // let newVal = val;
                                                    // for(let i = 0; i<val.length; i++){
                                                    //     let letter = val.substr(i,1);
                                                    //     if( !isNaN(parseInt(letter)) ){
                                                    //         newVal += letter
                                                    //     }
                                                    // }
                                                this.setState({phone: event.target.value})
                                           }}/>
                                    </div>
                                    
                                    {/* <div>
                                        <span style={{fontSize:12, color:'#55f'}}>( Phone number should be in format : +02xxxxxx)</span>
                                    </div> */}
                                </div>
                                
                                <div id="recaptcha-container"/>

                                
                                <div style={{marginTop:20, marginBottom:20, paddingTop:10,}}>
                                    <input
                                        className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                        id={"verify_button"} type="button" onClick={this.onClick} value={'Phone Verify'} />
                                </div>                           


                                <div style={{display: this.state.isShowVerifyCode ? 'inline' : 'none'}}>
                                <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isShowVerifyCode}>

                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                        <input className="mdl-textfield__input" type="number" id="code" value={this.state.code} onChange={e=>this.setState({code:e.target.value})}/>
                                        <label className="mdl-textfield__label" htmlFor="code">Verify Code</label>
                                    </div>
                                    <div >
                                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill" onClick={this.onSubmit}>
                                            &nbsp;&nbsp;&nbsp; Submit &nbsp;&nbsp;&nbsp;
                                        </button>
                                    </div>

                                </Animated>
                                </div>

                            </div>
                            <div className="col"></div>    
                        </div>
                    
                    </div>

                </div>
            </div>

            <div style={{display: this.state.isShowProfile ? 'inline' : 'none'}}>
                <ProfileRegister
                    phone = {this.state.phone}
                    onClickHome={this.props.onClickHome}
                    onSubmit={this.props.onClickHome}
                />
            </div>
        </div>
        );
    }

}
SMSComp.propTypes = {
    onClickHome : PropTypes.func.isRequired,
}

export default SMSComp;
