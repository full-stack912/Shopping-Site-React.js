import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';
import Login from "../../home/user/login";
import {BikeProfile, UserProfile, Carrier} from "../../data/user_profile";
import Header from "../../header/header";
import {Constants, CustomSwitch, GenderList} from "../../rglobal/constants";
import ReactSwitch from "react-switch";
import RestAPI from "../../global/RestAPI";
import {SubPulseLoader} from "../../global/SubLoader";
import RiderMembership from "../../rider/dashboard/rider_membership";
const Step_ProfileRegister = 1;
const Step_Plan = 2;
const Step_Finalize = 3;

const Plan_Beginner  = 100;
const Plan_Professional  = 101;
const Plan_Ultimate  = 102;

class  CarrierRegister extends React.Component{


    state={
        registerStep: Step_ProfileRegister,
        selPlan: null,
        shipAccording : 1,
        pickup_available:true,
        isLoading:false,
        gender:GenderList[0]
    };

    constructor(props){
        super(props)

    }

    componentDidMount() {
        RestAPI.getShopCarrierData(5, (res, err)=>{
            console.log(res, err)
        })
    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }
    onChoosePhoto = (event)=>{
        // console.log('file selected: > ', event.target.files[0])
        this.setState({
            avatar_file: window.URL.createObjectURL(event.target.files[0]),
            carrier_avatar: event.target.files[0]
        })
    }
    onChooseBikePhoto = (event)=>{
        // console.log('file selected: > ', event.target.files[0])
        this.setState({
            bike_photo: window.URL.createObjectURL(event.target.files[0])
        })
    }

    chkUserData = ()=>{
        let carrierData = {

            first_name: this.state.firstName, last_name: this.state.lastName,
            email: this.state.email, phone_number: this.state.phone,
            password: this.state.pwd, address: this.state.address,
            avatar: this.state.carrier_avatar , push_user_id: global.pushToken, is_free:0,
            min_price:null, price_per_mile:null, lat:null, lon:null
        }
        if(this.state.pwd !== this.state.repwd || this.state.pwd == null){
            alert('Confirm password is not correct. please confirm again')
            return false
        }
        if(carrierData.avatar == null){
            alert('Please choose your picture')
            return false
        }
        if(carrierData.first_name == null){
            alert('Please input first name.')
            return false
        }
        if(carrierData.last_name == null){
            alert('Please input last name')
            return false
        }
        if(carrierData.email == null){
            alert('Please input email')
            return false
        }

        if(carrierData.address == null){
            alert('Please input address')
            return false
        }
        if(carrierData.phone_number == null){
            alert('Please input phone number')
            return false
        }

        return true
    }
    chkValid=()=>{
        let carrierData = {
            max_width:this.state.max_width , max_height : this.state.max_height,
            max_depth : this.state.max_depth, max_weight:this.state.max_weight ,
            grade: this.state.grade, delay: this.state.delay,
            first_name: this.state.firstName, last_name: this.state.lastName,
            email: this.state.email, phone_number: this.state.phone,
            password: this.state.pwd, address: this.state.address,
            avatar: this.state.carrier_avatar , push_user_id: global.pushToken, is_free:0,
            min_price:null, price_per_mile:null, lat:null, lon:null
        }


        if(carrierData.max_width == null){
            alert('Max Width is not defined. please check again')
            return false
        }
        if(carrierData.max_height == null){
            alert('Max Height is not defined. please check again')
            return false
        }
        if(carrierData.max_depth == null){
            alert('Max Depth is not defined. please check again')
            return false
        }
        if(carrierData.max_weight == null){
            alert('Max Weight is not defined. please check again')
            return false
        }
        if(carrierData.grade == null){
            alert('Grade is not defined. please check again')
            return false
        }
        if(carrierData.delay == null){
            alert('Delay is not defined. please check again')
            return false
        }

        return this.chkUserData()

    }

    onSubmit = ()=>{

        if(!this.chkValid()){
            return
        }

        let carrierData = {
             max_width:this.state.max_width , max_height : this.state.max_height,
            max_depth : this.state.max_depth, max_weight:this.state.max_weight ,
            grade: this.state.grade, delay: this.state.delay,
            first_name: this.state.firstName, last_name: this.state.lastName,
            email: this.state.email,gender: this.state.gender, phone_number: this.state.phone,
            password: this.state.pwd, address: this.state.address,
            avatar: this.state.carrier_avatar , push_user_id: global.pushToken, is_free:0,
            min_price:this.state.min_price, price_per_mile:this.price_per_mile,
            pickup_available:this.state.pickup_available ? 1:0
        }

        this.setState({isLoading:true})
        RestAPI.registerCarrier(carrierData, (res, err)=>{
            this.setState({isLoading:false})
            if(err != null){
                console.log(err, res)
                alert('Failed to register carrier, please try again.')
                return
            }
            if(res.success == 1){
                let user = res.data.user
                console.log('after carrier register:', user)
                let newCarrier = new UserProfile({
                    userName: user.first_name+' '+user.last_name,
                    email: user.email,
                    gender: user.gender,
                    phone: user.phone_number,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    token: res.data.token,
                    // dob: new Date('1990-03-15'),
                    avatar: user.avatar,
                    address: user.staff.address,
                    role: user.role_id,
                    user_id: user.id,
                    staff_id: user.staff.id,
                    pickup_available: user.staff.pickup_available,
                    memberShip: user.staff.membership,
                    bikeProfile : null,
                    carrierProfile:{
                        carrier_id:user.staff.carrier_id,
                        is_free:user.staff.is_free,
                        max_width:user.staff.max_width,
                        max_height:user.staff.max_height,
                        max_depth:user.staff.max_depth,
                        max_weight:user.staff.max_weight,
                        grade:user.staff.grade,
                        delay:user.staff.delay,
                        min_price:user.staff.min_price,
                        price_per_mile:user.staff.price_per_mile,
                    }
                });
                global.setUser(newCarrier);

                this.setState({
                    registerStep:Step_Plan
                })

            }else{
                alert('Failed to register carrier profile, please check data and try again.')
                return
            }
        })
        if(this.props.onSubmit){
            this.props.onSubmit();
        }
    };

    onSelectPlan = (plan)=>{

        this.setState({
            selPlan: plan,
            registerStep: Step_Finalize
        })
    }

    render(){
        return (
            <div>
                <Header
                    isErrand={true}
                    backgroundColor={'#fff'}
                />
                <div class="page-ttl-errand ">
                    <div class="layer-stretch">
                        <div class="page-ttl-container">
                            <h1>Register as <span class="text-primary">Carrier</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Register as Carrier</span></p>
                        </div>
                    </div>
                </div>

                {/*  Register rider profile like with User  */}
                <div className="layer-stretch"  style={{display: this.state.registerStep === Step_ProfileRegister ? '' : 'none'}}>
                    <div className="layer-wrapper">
                        <div className="row pt-4">
                            <div className="col-lg-5">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Carrier Profile</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            {/* Rider profile photo */}
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <img className='fixed_avatar' src={this.state.avatar_file ? this.state.avatar_file : require("../../assets/images/avatar_empty.png")} alt=""/>
                                                    <div className='form-group'>
                                                        <div className='file-field'>
                                                            <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose file</span>
                                                            <input  type='file' onChange={this.onChoosePhoto} accept=".jpg,.png,.jpeg" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* End of rider profile photo */}
                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="first_name">First Name</label>
                                                <input className="mdl-textfield__input" type="text" id="first_name" value={this.state.firstName} onChange={event=>this.setState({firstName: event.target.value})}/>

                                            </div>
                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="last_name">Last Name</label>
                                                <input className="mdl-textfield__input" type="text" id="last_name" value={this.state.lastName} onChange={event=>this.setState({lastName: event.target.value})}/>

                                            </div>
                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left" >
                                                <label className="font-13" htmlFor="user_email">Email Address</label>
                                                <input className="mdl-textfield__input" type="email" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})} />

                                            </div>

                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="gender">Gender</label>
                                                <select className='mdl-textfield__input' name={'gender'} onChange={e=>this.setState({gender: e.target.value})}>
                                                    {
                                                        GenderList.map((item, index)=>{

                                                            return this.state.gender == item ? <option value={item} selected>{Constants.ucFirst(item)}</option>
                                                                : <option value={item} >{Constants.ucFirst(item)}</option>
                                                        })
                                                    }
                                                </select>
                                                {/*<input className="mdl-textfield__input" type="select" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>*/}

                                            </div>

                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="phone">Phone (ex: +233242223344)</label>
                                                <input className="mdl-textfield__input" type="number" id="user_email" value={this.state.phone} onChange={event=>this.setState({phone: event.target.value})} />

                                            </div>
                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="pwd">Password</label>
                                                <input className="mdl-textfield__input" type="password" id="pwd" value={this.state.pwd} onChange={event=>this.setState({pwd: event.target.value})}/>

                                            </div>
                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="repwd">Confirm Password</label>
                                                <input className="mdl-textfield__input" type="password" id="repwd" value={this.state.repwd} onChange={event=>this.setState({repwd: event.target.value})}/>

                                            </div>
                                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                                <label className="font-13" htmlFor="address">Address</label>
                                                <input className="mdl-textfield__input" type="text" id="address" value={this.state.address} onChange={event=>this.setState({address: event.target.value})}/>

                                            </div>
                                            {/*<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">*/}
                                            {/*    <input className="mdl-textfield__input" type="date" id="dob" placeholder='' value={this.state.dob} onChange={event=>this.setState({dob: event.target.value})} />*/}
                                            {/*    <label className="mdl-textfield__label" htmlFor="dob">Date of birthday</label>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-7">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Shipping Details</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            <div className="panel" id="fieldset_form_1">
                                                <div className="form-wrapper">
                                                    {/*<div className="row">*/}
                                                    {/*    <div className="col-md-3  text-left">*/}
                                                    {/*    <label className="text-info">*/}
                                                    {/*        Billing*/}
                                                    {/*    </label>*/}
                                                    {/*    </div>*/}
                                                    {/*    <div className="col-md-9 text-left">*/}
                                                    {/*        <div className="">*/}
                                                    {/*            <label>*/}
                                                    {/*                <input*/}
                                                    {/*                    type="radio"*/}
                                                    {/*                    className=""*/}
                                                    {/*                    name="shipping_method"*/}
                                                    {/*                    id="billing_price"*/}
                                                    {/*                    onChange={event=>{*/}
                                                    {/*                        this.setState({*/}
                                                    {/*                            shipAccording: event.target.value*/}
                                                    {/*                        })*/}
                                                    {/*                    }}*/}
                                                    {/*                    checked={this.state.shipAccording == 2}*/}
                                                    {/*                    value="2"/>*/}
                                                    {/*                According to total price.*/}
                                                    {/*            </label>*/}
                                                    {/*        </div>*/}
                                                    {/*        <div className="">*/}
                                                    {/*            <label>*/}
                                                    {/*                <input*/}
                                                    {/*                    type="radio"*/}
                                                    {/*                    name="shipping_method"*/}
                                                    {/*                    id="billing_weight"*/}
                                                    {/*                    value="1"*/}
                                                    {/*                    onChange={event=>{*/}
                                                    {/*                        this.setState({*/}
                                                    {/*                            shipAccording: event.target.value*/}
                                                    {/*                        })*/}
                                                    {/*                    }}*/}
                                                    {/*                    checked={this.state.shipAccording == 1}*/}
                                                    {/*                    />*/}
                                                    {/*                According to total weight.*/}
                                                    {/*            </label>*/}
                                                    {/*        </div>*/}
                                                    {/*    </div>*/}
                                                    {/*</div>*/}

                                                    {/*<div className="row">*/}

                                                    {/*    <div id="zone_ranges" className="col-md-12" style={{overflow:"auto"}}>*/}
                                                    {/*        /!*<h4>Ranges</h4>*!/*/}
                                                    {/*        <table id="zones_table" className="table table-no-bordered"*/}
                                                    {/*               style={{maxWidth:"100%"}}>*/}
                                                    {/*            <tbody>*/}
                                                    {/*            <tr className="range_inf">*/}
                                                    {/*                <td className="text-left">Will be applied when the*/}
                                                    {/*                    price is*/}
                                                    {/*                </td>*/}
                                                    {/*                <td className="border_left border_bottom range_sign">&gt;=</td>*/}
                                                    {/*                <td className="border_bottom">*/}
                                                    {/*                    <div className="input-group fixed-width-md">*/}
                                                    {/*                        {this.state.shipAccording == 1 && <span>kg:&nbsp;</span>}*/}
                                                    {/*                        {this.state.shipAccording == 2 && <span>€:&nbsp;</span>}*/}
                                                    {/*                        <input className="form-control"*/}
                                                    {/*                               name="range_inf[1]"*/}
                                                    {/*                               type="number"*/}
                                                    {/*                               step={1.0}*/}
                                                    {/*                               min={0}*/}
                                                    {/*                               placeholder={0}*/}
                                                    {/*                               />*/}
                                                    {/*                    </div>*/}
                                                    {/*                </td>*/}
                                                    {/*            </tr>*/}
                                                    {/*            <tr className="range_sup">*/}
                                                    {/*                <td className="text-left">Will be applied when the*/}
                                                    {/*                    price is*/}
                                                    {/*                </td>*/}
                                                    {/*                <td className="border_left range_sign">&lt;</td>*/}
                                                    {/*                <td className="range_data">*/}
                                                    {/*                    <div className="input-group fixed-width-md">*/}
                                                    {/*                        {this.state.shipAccording == 1 && <span>kg:&nbsp;</span>}*/}
                                                    {/*                        {this.state.shipAccording == 2 && <span>€:&nbsp;</span>}*/}

                                                    {/*                        <input className="form-control w-50"*/}
                                                    {/*                               name="range_sup[1]" type="number"*/}
                                                    {/*                               placeholder={'100'}*/}
                                                    {/*                               step={1}*/}
                                                    {/*                               autoComplete="off"/>*/}
                                                    {/*                    </div>*/}
                                                    {/*                </td>*/}
                                                    {/*            </tr>*/}

                                                    {/*            </tbody>*/}
                                                    {/*        </table>*/}
                                                    {/*    </div>*/}

                                                    {/*</div>*/}
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <table className="table table-no-bordered">
                                                                <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Grade(1~10)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="grade" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.grade}
                                                                               onChange={event=>this.setState({grade: event.target.value})}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Delay(description)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="delay" type="text"
                                                                               placeholder={'Input your generic delay'}
                                                                               value={this.state.delay}
                                                                               onChange={event=>this.setState({delay: event.target.value})}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>

                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package width (cm)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="max_width" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.max_width}
                                                                               onChange={event=>this.setState({max_width: event.target.value})}
                                                                               />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package height (cm)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="max_height" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.max_height}
                                                                               onChange={event=>this.setState({max_height: event.target.value})}
                                                                               />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package depth (cm)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="max_depth" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.max_depth}
                                                                               onChange={event=>this.setState({max_depth: event.target.value})}
                                                                               />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package weight (kg)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="max_weight" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.max_weight}
                                                                               onChange={event=>this.setState({max_weight: event.target.value})}
                                                                               />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Min Price
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="min_price" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.min_price}
                                                                               onChange={event=>this.setState({min_price: event.target.value})}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Price per Mile
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <input className="form-control"
                                                                               name="price_per_mile" type="number"
                                                                               placeholder={0}
                                                                               value={this.state.price_per_mile}
                                                                               onChange={event=>this.setState({price_per_mile: event.target.value})}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Available
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        <ReactSwitch onChange={pickup_available=>this.setState({pickup_available})} checked={this.state.pickup_available} />

                                                                    </td>
                                                                </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>



                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            {this.state.isLoading ? <SubPulseLoader isLoading={this.state.isLoading}/> :
                                <button
                                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                    onClick={this.onSubmit}>&nbsp;&nbsp;&nbsp; Submit &nbsp;&nbsp;&nbsp;</button>
                            }


                        </div>
                    </div>
                </div>
                {/*  End of Register rider profile like with User */}

                {/* Member ship selector */}
                {
                    this.state.registerStep === Step_Plan ?
                    <div className="layer-stretch"   style={{display: this.state.registerStep === Step_Plan ? '' : 'none'}}>
                        <RiderMembership isRider={false} onSelectPlan={()=>{
                            this.setState({registerStep: Step_Finalize})
                        }}/>
                    </div>
                    :
                    null
                }

                {/*End of Membership plan*/}
                {/* Finalize Step */}
                    <div className="layer-stretch"   style={{display: this.state.registerStep === Step_Finalize ? '' : 'none'}}>
                        <div className="layer-wrapper">

                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="layer-ttl"><h4>Welcome to become a Carrier!</h4></div>
                                    </div>
                                    <div className="panel-body">
                                        <p>
                                        You will get notification when user pickup you for any order.
                                        Please keep online and get chance to service for customers.
                                        </p>
                                    </div>
                                </div>


                        </div>
                    </div>

            {/*   End of Finalize */}

            </div>
        );
    }

}
CarrierRegister.propTypes = {
    onClickHome : PropTypes.func.isRequired,
    onSubmit : PropTypes.func.isRequired,
}

export default CarrierRegister;
