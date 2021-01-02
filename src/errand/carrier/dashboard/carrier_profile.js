import React from 'react';
// import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';

import {BikeProfile, UserProfile, } from "../../../data/user_profile";
// import Header from "../../../header/header";
import {Constants, CustomSwitch, GenderList} from "../../../rglobal/constants";
import ReactSwitch from "react-switch";
import RestAPI from "../../../global/RestAPI";
import {SubPulseLoader} from "../../../global/SubLoader";

const Step_ProfileRegister = 1;
const Step_Plan = 2;
const Step_Finalize = 3;

const Plan_Beginner  = 100;
const Plan_Professional  = 101;
const Plan_Ultimate  = 102;

class  CarrierProfile extends React.Component{

    constructor(props){
        super(props)
        const {carrierProfile} = global.curUser;
        const curUser = global.curUser
        console.log('construct->curUser', curUser)
        this.state={
            avatar_file:curUser.avatar,
            pickup_available:curUser.pickup_available == 1,
            isPickupLoading:false,
            first_name:curUser.firstName,
            last_name:curUser.lastName,
            email:curUser.email,
            gender:curUser.gender,
            phone_number:curUser.phone,
            address:curUser.address,

            max_width:carrierProfile.max_width,
            max_height:carrierProfile.max_height,
            max_depth:carrierProfile.max_depth,
            max_weight:carrierProfile.max_weight,
            grade:carrierProfile.grade,
            delay:carrierProfile.delay,
            min_price:carrierProfile.min_price,
            price_per_mile:carrierProfile.price_per_mile,

            isSubmitting:false,
            isEditMode:false,
        };

    }


    componentDidMount() {
    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }

    onChangePickup=(pickupAvailable)=>{
        this.setState({isPickupLoading:true})
        // alert(pickupAvailable)
        let isPickup = pickupAvailable === true ? 1:0;
        RestAPI.updatePickupAvailable(global.curUser.staff_id, isPickup, (res, err)=>{

            this.setState({isPickupLoading:false})
            if(err!== null){
                alert('Failed to update pickup. please try again.')

                return
            }
            if(res.success === 1){
                this.setState({pickup_available: res.data.pickup_available == 1 })
                global.curUser.pickup_available = res.data.pickup_available;
                console.log('pickup was updated as '+ res.data.pickup_available)
            }
        })

    }

    onChangeProfile = ()=>{

        const {
            max_width,
            max_height,
            max_depth,
            max_weight,
            grade,
            delay,
            first_name,
            last_name,
            gender,
            email,
            phone_number,
            address,
            min_price,
            price_per_mile,
            avatar_photo_file,
        } = this.state;
        let carrierData = {
            is_free:0,
            max_width:max_width,
            max_height:max_height,
            max_depth:max_depth,
            max_weight:max_weight,
            grade:grade,
            delay:delay,
            first_name:first_name,
            last_name:last_name,
            email:email,
            gender:gender,
            phone_number:phone_number,
            address:address,
            min_price:min_price,
            price_per_mile:price_per_mile,
            avatar : avatar_photo_file
        };
        this.setState({isSubmitting:true});
        RestAPI.updateCarrierProfile(carrierData, (res, err)=>{
            this.setState({isSubmitting:false});
            if(err != null){
                alert('Failed to change profile, please try again');
                return
            }
            if(res.success == 1){
                this.setState({isEditMode:false})
                let user = res.user

                let updatedUser = new UserProfile({
                    userName: user.first_name+' '+user.last_name,
                    email: user.email,
                    phone: user.phone_number,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    gender: user.gender,
                    token: global.curUser.token,
                    // dob: new Date('1990-03-15'),
                    avatar: user.avatar,
                    address: user.staff.address,
                    role: user.role_id,
                    user_id: user.id,
                    staff_id: user.staff.id,
                    pickup_available: user.staff.pickup_available,
                    memberShip: user.staff.membership,
                    bikeProfile : new BikeProfile({
                        photo : user.staff.bike_photo,
                        name : user.staff.bike_name,
                        license : user.staff.bike_license,
                        reg_number : user.staff.bike_reg_number,
                        policeReport : user.staff.bike_report,
                        insurance : user.staff.bike_insurance,
                        price_per_mile : user.staff.price_per_mile,
                        min_price: user.staff.min_price,
                    }),
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
                global.setUser(updatedUser);
                if(this.props.onChangeProfile){
                    this.props.onChangeProfile();
                }
            }else{
                alert('Failed to submit updated profile information.')
                return
            }
        })

    };
    onChoosePhoto = (event)=>{

        if(window.URL!= null){
            this.setState({
                avatar_file: window.URL.createObjectURL(event.target.files[0]),
                avatar_photo_file: event.target.files[0]
            })
        }else{

        }

    }

    render(){

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">
                                            Carrier Profile &nbsp;&nbsp;&nbsp;
                                            <a href={"#"} onClick={()=>{
                                                this.setState({isEditMode : !this.state.isEditMode})
                                            }}>
                                                <i className={this.state.isEditMode ?"fa fa-times" :  "fa fa-pencil-alt "}></i>
                                            </a>
                                        </div>
                                        <div style={{position:'absolute', right:'30px', top:'25px'}}>
                                            <div className="row mr-3">
                                                <span className="text-info mr-2 mt-1">Available</span>

                                                {this.state.isPickupLoading ?
                                                    <SubPulseLoader isLoading={this.state.isPickupLoading}/> :
                                                    <ReactSwitch onChange={pickup_available=>this.onChangePickup(pickup_available)} checked={this.state.pickup_available} />
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-wrapper">

                                        <div className="panel-body">

                                            <div className='row'>
                                                <div className='col text-center'>
                                                    {this.state.isEditMode ? (
                                                        <>
                                                            <img className='fixed_avatar' src={this.state.avatar_file ? this.state.avatar_file : require("../../../assets/images/avatar_empty.png")  } alt=""/>
                                                            <div className='form-group'>
                                                                <div className='file-field'>
                                                                    <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose Your Avatar</span>
                                                                    <input  type='file' onChange={this.onChoosePhoto} accept=".jpg,.png,.jpeg"  />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <img className='fixed_avatar' src={this.state.avatar_file ? this.state.avatar_file : require("../../../assets/images/avatar_empty.png")} alt=""/>
                                                    )}
                                                </div>
                                            </div>
                                            {/* End of rider profile photo */}
                                            <table className="table table-striped table-hover mt-lg-2">
                                                <tbody>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>
                                                        {!this.state.isEditMode && Constants.ucFirst(this.state.first_name) +' '+ Constants.ucFirst(this.state.last_name)  }
                                                        {this.state.isEditMode && (
                                                            <div className={'row'}>
                                                                <div className={'col-6'}>
                                                                    <input className="form-control" placeholder={"First Name"} type="text" id="firstName" value={this.state.first_name} onChange={event=>this.setState({first_name: event.target.value})}/>
                                                                </div>
                                                                <div className={'col-6'}>
                                                                    <input className="form-control" type="text" id="lastName" placeholder={"Last Name"} value={this.state.last_name } onChange={event=>this.setState({last_name: event.target.value})}/>
                                                                </div>
                                                            </div>)}
                                                            </td>
                                                </tr>
                                                <tr>
                                                    <td>Phone {this.state.isEditMode ? '( ex: +233242223344)' : ''}</td>
                                                    <td>
                                                        {!this.state.isEditMode && this.state.phone_number}
                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="text" id="phone" value={this.state.phone_number } onChange={event=>this.setState({phone_number: event.target.value})}/>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Email</td>
                                                    <td>
                                                        {!this.state.isEditMode && this.state.email}
                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="text" id="email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Gender</td>
                                                    <td>
                                                        {!this.state.isEditMode && Constants.ucFirst( this.state.gender)}
                                                        {
                                                            this.state.isEditMode &&
                                                            <select className='form-control' name={'gender'} onChange={e=>this.setState({gender: e.target.value})}>
                                                                {
                                                                    GenderList.map((item, index)=>{
                                                                        return this.state.gender == item ? <option value={item} selected>{Constants.ucFirst(item)}</option>
                                                                            : <option value={item} >{Constants.ucFirst(item)}</option>
                                                                    })
                                                                }
                                                            </select>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Address</td>
                                                    <td>
                                                        {!this.state.isEditMode && this.state.address}
                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="text" id="address" value={this.state.address} onChange={event=>this.setState({address: event.target.value})}/>}
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Shipping Information</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            <div className="panel" id="fieldset_form_1">
                                                <div className="form-wrapper">
                                                    {/*<div className="row">*/}
                                                    {/*    <div className="col-md-3  text-left">*/}
                                                    {/*        <label className="text-info">*/}
                                                    {/*            Billing*/}
                                                    {/*        </label>*/}
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
                                                    {/*                    checked={true}*/}
                                                    {/*                    disabled*/}
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
                                                    {/*                    disabled*/}
                                                    {/*                    checked={this.state.shipAccording == 1}*/}
                                                    {/*                />*/}
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
                                                    {/*                        {false && <span>kg:&nbsp;</span>}*/}
                                                    {/*                        {true && <span>€:&nbsp;</span>}*/}
                                                    {/*                        <span>0.0</span>*/}
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
                                                    {/*                        <span>100.00</span>*/}
                                                    {/*                    </div>*/}
                                                    {/*                </td>*/}
                                                    {/*            </tr>*/}

                                                    {/*            </tbody>*/}
                                                    {/*        </table>*/}
                                                    {/*    </div>*/}

                                                    {/*</div>*/}
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <table className="table table-no-bordered table-striped">
                                                                <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package width (cm)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.max_width}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="number" id="max_width" value={this.state.max_width } onChange={event=>this.setState({max_width: event.target.value})}/>}

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package height (cm)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.max_height}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="number" id="max_height" value={this.state.max_height } onChange={event=>this.setState({max_height: event.target.value})}/>}

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package depth (cm)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.max_depth}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="number" id="max_depth" value={this.state.max_depth } onChange={event=>this.setState({max_depth: event.target.value})}/>}

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Maximum package weight (kg)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.max_weight}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="number" id="max_weight" value={this.state.max_weight } onChange={event=>this.setState({max_weight: event.target.value})}/>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Min Price
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.min_price}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="number" id="min_price" value={this.state.min_price } onChange={event=>this.setState({min_price: event.target.value})}/>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Price per Mile
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.price_per_mile}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="number" id="price_per_mile" value={this.state.price_per_mile } onChange={event=>this.setState({price_per_mile: event.target.value})}/>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Grade(1~10)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.grade}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="text" id="grade" value={this.state.grade } onChange={event=>this.setState({grade: event.target.value})}/>}

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="text-info">
                                                                            Delay(description)
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {!this.state.isEditMode && this.state.delay}
                                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="text" id="delay" value={this.state.delay } onChange={event=>this.setState({delay: event.target.value})}/>}
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
                    </div>
                </div>
                <div className="">
                    {this.state.isEditMode &&  <SubPulseLoader isLoading = {this.state.isSubmitting}/>}
                    {this.state.isEditMode && !this.state.isSubmitting ?  <button
                            className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                            onClick={this.onChangeProfile}>&nbsp;&nbsp;&nbsp; Update Profile &nbsp;&nbsp;&nbsp;</button> : null}

                </div>

            </div>
        );
    }

}
CarrierProfile.propTypes = {
    onChangeProfile : PropTypes.func.isRequired,
}

export default CarrierProfile;
