import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';
import Login from "../home/user/login";
import {BikeProfile, UserProfile, } from "../data/user_profile";
import Header from "../header/header";
import {Constants, GenderList} from "../rglobal/constants";
import RestAPI from "../global/RestAPI";

import {PulseLoader} from "react-spinners";
import ReactNotification from 'react-notifications-component'
import firebase from "firebase";
import {initializedFirebaseApp} from "../init-fcm";
// import 'react-notifications-component/dist/theme.css'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {SubPulseLoader} from "../global/SubLoader";

const Step_ProfileRegister = 1;
const Step_Plan = 2;
const Step_Finalize = 3;

const Plan_Beginner  = 100;
const Plan_Professional  = 101;
const Plan_Ultimate  = 102;

const loaderCss = "display: block;margin: 0 auto;border-color: red;";

class  RiderRegister extends React.Component{

    state={
        registerStep: Step_ProfileRegister,
        selPlan: null,
        regionList:[],
        selRegion:null,
        membershipList : [],
        isSubmitLoading:false,
        isPhoneVerified:false,
        gender:GenderList[0]

    };


    
    componentDidMount() {
        // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
        //     {
        //         size:"normal"
        //         // other options
        //     });

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
        this.membershipList = [];
        RestAPI.getAllMemberships((res, err)=>{
            if(err !== null){
                alert('Failed to get memberships. refresh and try again.')
                return
            }
            if(res.success === 1){
                this.setState({membershipList:res.data})
            }else{
                alert('Failed to get memberships. Try again after secs.')
            }
        });

        RestAPI.getAllRegions((res, err)=>{
            if(err !== null){
                alert('Failed to get memberships. refresh and try again.')
                return
            }
            if(res.success === 1){
                this.setState({regionList:res.data})
            }else{
                alert('Failed to get memberships. Try again after secs.')
            }
        });


        console.log('show notification')
        this.bounds = new this.props.google.maps.LatLngBounds();
        Constants.GhanaBounds.forEach(x=>{
            this.bounds.extend(x)
        })

        let options = {
            bounds: this.bounds,
            types: ['establishment']
        };

        let input = document.getElementById('address');
        let address1 = new this.props.google.maps.places.SearchBox(input, {
            bounds: this.bounds
        });

        address1.addListener('places_changed', ()=>{
            let places = address1.getPlaces();
            console.log('Places from search box 1 for all data->', places)
            if(places.length > 0){
                console.log('places=>',places)
                let addr1 = places[0].formatted_address;
                let location1 = {
                    lat: places[0].geometry.location.lat(),
                    lng: places[0].geometry.location.lng(),
                }
                this.setState({
                    position1: {
                        addr: addr1,
                        location:location1
                    }
                })
                RestAPI.geoCodingFromLocationIQ(location1.lat, location1.lng, (resIQ, errIQ)=>{
                    console.log('resIQ',resIQ, 'errIQ',errIQ)
                    if(resIQ!=null){
                        if(resIQ.address != null){
                            this.setCurrentRegionFromAddr(resIQ.address.state)
                        }
                    }
                })

                // this.onLocationSelected()
                console.log('searchBox1', addr1, location1);
            }else{
                this.setState({
                    position1: null
                })
            }


        })

        // global.showNotification('titleasdk','bodyadc','default',()=>{})

    }

    setCurrentRegionFromAddr=(state)=>{
        this.state.regionList.forEach(x=>{
            if(x.region_name == state){
                this.setState({
                    selRegion: x,
                    price_per_mile: x.price,
                    min_price: x.price,
                })
            }
        })
        console.log('selRegion=>',this.state.selRegion)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    onSendSMS = ()=>{
        this.setState({isVerifyLoading: true})

        const phoneNumber = this.state.phone;
        const appVerifier = window.recaptchaVerifier;
        firebase
            .auth(initializedFirebaseApp)
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(confirmResult => {
                // success

                let verificationCode = window.prompt('Please enter the verification ' +
                    'code that was sent to your mobile device.');
                console.log(verificationCode)
                // this.phoneVerifyConfirmResult  = confirmResult
                // this.setState({
                //     isShowVerifyCode: true,
                // })
                confirmResult.confirm(verificationCode).then((res)=> {
                    // console.log('verify code check res', res)
                    this.setState({isVerifyLoading: false, isPhoneVerified:true})
                }).catch((err)=>{
                    this.setState({isVerifyLoading: false})
                    // console.log('verify code check err', err)
                })

            })
            .catch(error => {
                // error
                this.setState({isVerifyLoading: false})
                // console.log('errr', error)
                alert(error.message)
            });

    }
    onChoosePhoto = (event)=>{
        // console.log('file selected: > ', event.target.files[0])
        this.setState({
            avatar_file: window.URL.createObjectURL(event.target.files[0]),
            avatar_photo_file: event.target.files[0]

        })
    }
    onChooseBikePhoto = (event)=>{
        // console.log('file selected: > ', event.target.files[0])
        this.setState({
            bike_photo: window.URL.createObjectURL(event.target.files[0]),
            bike_photo_file:event.target.files[0]
        })
    }

    renderMembershipView = ()=>{

        return this.state.membershipList.map((item, i) =>{
            return (
                <div className="col-md-4" key={i}>
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="pricing01">
                                        <div className="" style={Constants.membershipColorList[i]}>
                                            <div className="pricing-title">
                                                {/*<i className="icon-screen-desktop"></i>*/}
                                                <h2>{item.name}</h2>
                                                <small>{item.sub_title}</small>
                                            </div>
                                            <div className="pricing-box">
                                                <span className="sup">{Constants.CURRENCY_CODE}</span><span className="price">{item.price}</span><span
                                                className="unit">Per Month</span>
                                            </div>
                                        </div>
                                        <div className="pricing-body">
                                            <ul>
                                                <li>Max Trip Distance {item.max_trip_distance === -1 ? 'Unlimited' : item.max_trip_distance+' miles'}</li>
                                                <li>Passengers In {item.passengers_distance === -1 ? 'Unlimited' : item.passengers_distance+'miles'}</li>
                                                <li> {Constants.ucFirst(item.location_share_option) } Location Share</li>
                                            </ul>
                                        </div>
                                        <div className="pricing-footer">
                                            <button className="btn btn-primary btn-pill" onClick={()=>{
                                                this.onSelectPlan(item)
                                            }}>
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    isValid=(required)=>{
        let {
            pwd, repwd,
            avatar_file,
            bike_photo,

        } = this.state
        if(pwd !==  repwd || pwd == null){
            alert('Password is not correct, please confirm password again.')
            return false
        }

        if(avatar_file == null){
            alert('Select avatar.')
            return false
        }


        if(bike_photo == null){
            alert('Select your bike photo correctly')
            return false
        }
        let res = true;
        let msg = '';
        Object.keys(required).forEach(key=>{
           let val = required[key]
            if(!val){
                res = false
                msg = key + ' is empty.';
            }
        });
        if( !res ){
            alert(msg)
        }
        return res;
    }

    onSubmit = ()=>{

        const {
            firstName, lastName, email, phone, gender, avatar_photo_file,
            address, bike_photo_file, bikeName, license, regNumber, police, insurance,
        } = this.state;

        let phoneNumber = phone;

        const required = {
            'First Name': firstName,
            'Last Name': lastName,
            'Email':email,
            'Phone': phoneNumber,
            'Gender':gender,
            'Address':address,
            'Bike Name':bikeName,
            'License':license,
            'Registration Number': regNumber,
        };

        if(!this.isValid(required)){
            return
        }

        const newUser = new UserProfile({
            userName: this.state.firstName+' '+this.state.lastName,
            email: this.state.email,
            phone: phoneNumber,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            gender: this.state.gender,
            token: '',
            // dob: new Date('1990-03-15'),
            avatar: this.state.avatar_photo_file,
            address: this.state.address,
            role: UserProfile.ROLE_RIDER,
            pickup_available:1,
            bikeProfile : new BikeProfile({
                photo : this.state.bike_photo_file,
                name : this.state.bikeName,
                license : this.state.license,
                reg_number : this.state.regNumber,
                policeReport : this.state.police,
                insurance : this.state.insurance,
                // min_price:this.state.min_price,
                // price_per_mile:this.state.price_per_mile,
            }),
        });

        console.log('new user profile:', newUser)
        this.setState({isSubmitLoading:true})
        RestAPI.signUpRider(newUser, this.state.pwd, 'temppushid', (res, err)=>{
            this.setState({isSubmitLoading:false})
            if(err !== null){
                console.log('err from reat api call for register', err);
                alert('Failed to register for Rider profile, please try again with correct data.')
                return
            }

            if(res.success === 1){
                let token = res.data.token
                let user = res.data.user
                newUser.user_id = user.id
                newUser.staff_id = user.staff.id
                newUser.token = token
                newUser.gender = user.gender
                newUser.avatar = user.avatar
                newUser.bikeProfile.photo = user.staff.bike_photo

                global.setUser(newUser);
                if(this.props.onSubmit){
                    this.props.onSubmit();
                }
                this.setState({
                    registerStep:Step_Finalize
                })

            }else{
                if(res.error != null){
                    alert(res.error)
                }else{
                    alert(res.msg)
                }
            }
        })
    };

    onSelectPlan = (plan)=>{
        RestAPI.setMembership(plan.id, global.curUser.staff_id, (res, err)=>{
            if(err !== null){
                alert('Failed to set membership, please try again.')
                return
            }
            if(res.success === 1){
                global.curUser.memberShip = plan;
                global.setUser(global.curUser)
                this.setState({
                    selPlan: plan,
                    registerStep: Step_Finalize
                })
            }else{
                alert('Failed to set membership, try again.')
            }
            console.log(global.curUser)
        })
    }

    render(){
        return (
            <div>
                <Header
                    onLogin={()=>{}}
                    onRegister={()=>{}}
                    onLogOut={()=>{ }}
                    backgroundColor={'#fff'}
                />
                <div className="page-ttl">
                    <div className="layer-stretch">
                        <div className="page-ttl-container">
                            <h1>Register as <span className="text-primary">Rider</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Rider Profile</span></p>
                        </div>
                    </div>
                </div>
                {/*  Register rider profile like with User  */}
                <div className="layer-stretch"  style={{display: this.state.registerStep === Step_ProfileRegister ? '' : 'none'}}>
                    <div className="layer-wrapper">
                        <div className="row pt-4">
                            {!this.state.isPhoneVerified ? <div className="col-lg-3"></div> : null}
                            <div className="col-lg-5">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Rider Profile</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            {/* Rider profile photo */}
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <img className='fixed_avatar' src={this.state.avatar_file ? this.state.avatar_file : require("../assets/images/avatar_empty.png")} alt=""/>
                                                    <div className='form-group'>
                                                        <div className='file-field'>
                                                            <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose Your Avatar</span>
                                                            <input  type='file' onChange={this.onChoosePhoto} accept=".jpg,.png,.jpeg" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* End of rider profile photo */}
                                            <div className={'row'}>
                                                <div className={'col'}>
                                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                        <label className="font-13 text-left" htmlFor="first_name">First Name</label>
                                                        <input className="mdl-textfield__input" type="text" id="first_name" value={this.state.firstName} onChange={event=>this.setState({firstName: event.target.value})}/>

                                                    </div>
                                                </div>
                                                <div className={'col'}>
                                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                        <label className="font-13 text-left" htmlFor="first_name">Last Name</label>
                                                        <input className="mdl-textfield__input" type="text" id="last_name" value={this.state.lastName} onChange={event=>this.setState({lastName: event.target.value})}/>
                                                        {/*<label className="mdl-textfield__label" htmlFor="last_name">Last Name</label>*/}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className={'row'}>
                                                <div className={'col'}>
                                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                        <label className="font-13 text-left" htmlFor="first_name">Email Address</label>
                                                        <input className="mdl-textfield__input" type="email" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})} />
                                                        {/*<label className="mdl-textfield__label" htmlFor="user_email">Email Address</label>*/}
                                                    </div>
                                                </div>
                                                <div className={'col'}>
                                                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                        <label className="font-13" htmlFor="gender">Gender</label>
                                                        <select className='mdl-textfield__input'
                                                                style={{height:'34px', borderBottom:'1px solid #888888'}}
                                                                name={'gender'} onChange={e=>this.setState({gender: e.target.value})}>
                                                            {
                                                                GenderList.map((item, index)=>{

                                                                    return this.state.gender == item ? <option value={item} selected>{Constants.ucFirst(item)}</option>
                                                                        : <option value={item} >{Constants.ucFirst(item)}</option>
                                                                })
                                                            }
                                                        </select>
                                                        {/*<input className="mdl-textfield__input" type="select" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>*/}

                                                    </div>
                                                </div>
                                            </div>




                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="gender">Phone Number (ex: +233242223344)</label>
                                                <input className="mdl-textfield__input" type="text" id="phone_number"
                                                       autoComplete={'off'}
                                                       value={this.state.phone}
                                                       onChange={event=>{
                                                           this.setState({phone: event.target.value})
                                                       }}/>
                                                {/* <div>
                                                    <span style={{fontSize:12, color:'#55f'}}></span>
                                                </div> */}
                                                {/*<label className="mdl-textfield__label" htmlFor="phone_number">Phone Number (+233) </label>*/}
                                                
                                            </div>
                                            <div className={this.state.isPhoneVerified ? '' : 'd-none'}>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    {/*<input className="mdl-textfield__input" type="text" id="address"*/}
                                                    {/*       autoComplete={'off'}*/}
                                                    {/*       value={this.state.address}*/}
                                                    {/*       onChange={event=>this.setState({address: event.target.value})}/>*/}
                                                    <label className="font-13" htmlFor="address">Address</label>
                                                    <input
                                                        id={'address'}
                                                        onChange={event => {
                                                            console.log(event)
                                                        }}
                                                        type="text" className="mdl-textfield__input"
                                                        placeholder="Address..."
                                                        style={{fontSize: '15px'}}/>

                                                </div>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="pwd">Password</label>
                                                    <input className="mdl-textfield__input" type="password" id="pwd" value={this.state.pwd} onChange={event=>this.setState({pwd: event.target.value})}/>

                                                </div>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="repwd">Confirm Password</label>
                                                    <input className="mdl-textfield__input" type="password" id="repwd" value={this.state.repwd} onChange={event=>this.setState({repwd: event.target.value})}/>

                                                </div>
                                            </div>
                                                <div id="recaptcha-container"/>
                                                <div style={{marginTop: 20, marginBottom: 20, paddingTop: 10,}} className={this.state.isPhoneVerified ? 'd-none':''}>
                                                    <input
                                                        className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                         type="button" onClick={this.onSendSMS}
                                                        value={'Phone Verify'}/>
                                                </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.state.isPhoneVerified ?
                                <div className="col-lg-7">
                                    <div className="panel panel-default">
                                        <div className="panel-head">
                                            <div className="panel-title">Bike Information</div>
                                        </div>
                                        <div className="panel-wrapper">

                                            <div className="panel-body">
                                                {/* Bike photo */}
                                                <div className='row'>
                                                    <div className='col text-center'>
                                                        <img className='bike_img' src={this.state.bike_photo ? this.state.bike_photo : require("../assets/images/empty.jpg")} alt=""/>
                                                        <div className='form-group'>
                                                            <div className='file-field'>
                                                                <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose Bike Image ( *.jpg | *.png )</span>
                                                                <input  type='file' onChange={this.onChooseBikePhoto} accept=".jpg,.png,.jpeg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* End of Bike photo */}
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="user_name">Bike Name</label>
                                                    <input className="mdl-textfield__input" type="text" id="bike_name" value={this.state.bikeName} onChange={event=>this.setState({bikeName: event.target.value})}/>

                                                </div>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="bike_license">License of Bike</label>
                                                    <input className="mdl-textfield__input" type="text" id="bike_license" value={this.state.license} onChange={event=>this.setState({license: event.target.value})}/>

                                                </div>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="bike_reg_number">Registration Number</label>
                                                    <input className="mdl-textfield__input" type="text" id="bike_reg_number" value={this.state.regNumber} onChange={event=>this.setState({regNumber: event.target.value})}/>

                                                </div>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="price_per_mile" >Price Per Mile(GHS)</label>
                                                    <input  className="mdl-textfield__input" type="number" step={0.01} id="price_per_mile" value={this.state.price_per_mile} disabled={'disabled'} onChange={event=>this.setState({price_per_mile: event.target.value})}/>

                                                </div>
                                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                    <label className="font-13" htmlFor="min_price">Min Price(GHS)</label>
                                                    <input  className="mdl-textfield__input" type="number" step={0.01} id="min_price" value={this.state.min_price} disabled={'disabled'} onChange={event=>this.setState({min_price: event.target.value})}/>

                                                </div>
                                                <div
                                                    className="form-group"
                                                    data-upgraded=",MaterialTextfield">
                                                    <div className="row w-100 pl-lg-3 mb-2">
                                                        <span className="text-dark text-left w-100">Insurance Information</span>
                                                    </div>

                                                    <textarea className="form-control" rows="5" id="insure_inf" value={this.state.insurance} onChange={event=>this.setState({insurance: event.target.value})}></textarea>

                                                </div>
                                                <div
                                                    className="form-group"
                                                    data-upgraded=",MaterialTextfield">
                                                    <div className="row w-100 pl-lg-3 mb-2">
                                                        <span className="text-dark text-left w-100">Police Report</span>
                                                    </div>

                                                    <textarea className="form-control" rows="5" id="police_rep"  value={this.state.police} onChange={event=>this.setState({police: event.target.value})}></textarea>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                            }
                        </div>
                        {this.state.isPhoneVerified ?
                        <div className="">
                            {this.state.isSubmitLoading ?
                            <SubPulseLoader isLoading={this.state.isSubmitLoading}/>
                                : <button
                                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                onClick={this.onSubmit}>
                                &nbsp;&nbsp;&nbsp; Submit &nbsp;&nbsp;&nbsp;
                            </button>}
                        </div> : null}
                    </div>
                </div>
                {/*  End of Register rider profile like with User */}
                {/* Member ship selector */}
                    <div className="layer-stretch"   style={{display: this.state.registerStep === Step_Plan ? '' : 'none'}}>
                        <div className="layer-wrapper">
                            <div className="layer-ttl"><h4>Choose Your <span className="text-primary">Plan</span></h4></div>

                            <div className="row">
                                {this.renderMembershipView()}
                            </div>

                        </div>
                    </div>
                {/*End of Membership plan*/}
                {/* Finalize Step */}
                    <div className="layer-stretch"   style={{display: this.state.registerStep === Step_Finalize ? '' : 'none'}}>
                        <div className="layer-wrapper">
                            <div className="panel panel-default">
                                <div className="panel-head">
                                    <div className="layer-ttl"><h4>Thanks for your request!</h4></div>
                                </div>
                                <div className="panel-body">
                                    <p>
                                    We will review your request and will send you answer soon.<br/>
                                    Please wait for a few hours!.<br/>
                                    We will send notification via email or push for mobile app.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

            {/*   End of Finalize */}
                <ReactNotification />
            </div>
        );
    }

}
RiderRegister.propTypes = {
    google : PropTypes.object.isRequired,
    onClickHome : PropTypes.func.isRequired,
    onSubmit : PropTypes.func.isRequired,

}
// export default BikeHome;
export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(RiderRegister);
// export default RiderRegister;
