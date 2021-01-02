import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';

import {BikeProfile, UserProfile, } from "../../data/user_profile";
import Header from "../../header/header";
import {Constants, CustomSwitch, GenderList} from "../../rglobal/constants";
import ReactSwitch from "react-switch";
import RestAPI from "../../global/RestAPI";

import {BarLoader, PulseLoader, ScaleLoader, FadeLoader} from "react-spinners";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const Step_ProfileRegister = 1;
const Step_Plan = 2;
const Step_Finalize = 3;

const Plan_Beginner  = 100;
const Plan_Professional  = 101;
const Plan_Ultimate  = 102;

class  RiderProfile extends React.Component{


    constructor(props){
        super(props)

        this.state={
            isPickupLoading : false,
            pickupAvailable: global.curUser.pickup_available,
            editMode: false,
            isEditMode: false,
            avatar_photo_file:null,
            bike_photo_file:null,
            regionList:[],
            avatar_file: global.curUser.avatar,
            firstName: global.curUser.firstName,
            lastName: global.curUser.lastName,
            email: global.curUser.email,
            gender: global.curUser.gender,
            phone: global.curUser.phone,
            address:global.curUser.address,
            bike_photo: global.curUser.bikeProfile.photo,

            price_per_mile:global.curUser.bikeProfile.price_per_mile,
            min_price:global.curUser.bikeProfile.min_price,

            bikeName: global.curUser.bikeProfile.name,
            bikeLicense: global.curUser.bikeProfile.license,
            reg_number:global.curUser.bikeProfile.reg_number,
            insurance:global.curUser.bikeProfile.insurance,
            police:global.curUser.bikeProfile.policeReport


        };

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


    componentDidMount() {

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
                this.setState({address: addr1})
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


    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }

    validationCheck = (required)=>{
        let res = true;
        let msg = '';
        Object.keys(required).forEach(key =>{
            if( required[key] == null || !required[key] ){
                res = false;
                msg = key + ' is empty.';
            }
        })

        if( res == false  ){
            alert(msg);
        }
        return res;

    }

    onChangeProfile = ()=>{
        const {
            firstName, lastName,
            email, phone, gender,
            avatar_photo_file, address,
            bike_photo_file,
            bikeName, bikeLicense,
            reg_number, police, insurance
        } = this.state;

        const requiredFields = {
            'First Name':firstName, 'Last Name':lastName, 'Email':email, 'Phone':phone, 'Gender':gender,
            'Address':address,
            'Bike Name':bikeName, 'Bike License': bikeLicense, 'Registration Number':reg_number
        };

        if( !this.validationCheck(requiredFields)){
            return;
        }

        const newUser = new UserProfile({
            token:global.curUser.token,
            userName: firstName+' '+lastName,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            // dob: new Date('1990-03-15'),
            avatar: avatar_photo_file,
            address: address,
            role: UserProfile.ROLE_RIDER,
            bikeProfile : new BikeProfile({
                photo : bike_photo_file,
                name : bikeName,
                license : bikeLicense,
                reg_number : reg_number,
                policeReport : police,
                insurance : insurance,
                // price_per_mile: this.state.price_per_mile,
                // min_price: this.state.min_price,
            }),
        });

        console.log('newUserProfile', newUser)

        RestAPI.updateProfile(newUser, (res, err)=>{
            if(err !== null){
                alert('Failed to update profile, try again.')
                return
            }
            if(res.success === 1){
                let user = res.user;
                console.log(res.data);
                newUser.user_id = user.id;
                newUser.is_active = user.is_active;
                newUser.staff_id = user.staff.id;
                newUser.avatar = user.avatar;
                newUser.gender = user.gender;
                newUser.bikeProfile.photo = user.staff.photo;
                newUser.memberShip = user.staff.membership;
                newUser.pickup_available= user.staff.pickup_available

                global.setUser(newUser);
                this.setState({ isEditMode : false })
                // window.location.reload()
            }else{
                alert('Failed to update profile, please try again with correct data.')
                return
            }
        })

        if(this.props.onChangeProfile){
            this.props.onChangeProfile();
        }

    };

    onChoosePhoto = (event)=>{
        // console.log('file selected: > ', event.target.files[0])
        if(window.URL!= null){
            this.setState({
                avatar_file: window.URL.createObjectURL(event.target.files[0]),
                avatar_photo_file: event.target.files[0]
            })
        }else{
            // this.setState({
            //     avatar_file: window.URL.createObjectURL(event.target.files[0]),
            //     avatar_photo_file: event.target.files[0]
            // })
        }

    }

    onChooseBikePhoto = (event)=>{
        // console.log('file selected: > ', event.target.files[0])
        this.setState({
            bike_photo: window.URL.createObjectURL(event.target.files[0]),
            bike_photo_file:event.target.files[0]
        })
    }

    onChangePickup=(pickupAvailable)=>{
        this.setState({isPickupLoading:true})
        let isPickup = pickupAvailable === true ? 1:0;
        RestAPI.updatePickupAvailable(global.curUser.staff_id, isPickup, (res, err)=>{

            this.setState({isPickupLoading:false})
            if(err!== null){
                alert('Failed to update pickup. please try again.')
                this.setState({pickupAvailable: !pickupAvailable})
                return
            }
            if(res.success === 1){

                global.curUser.pickup_available = res.data.pickup_available;
                global.setUser(global.curUser)
                console.log('pickup was updated as '+ res.data.pickup_available)
            }
        })

    }

    render(){

        return (
            <div>
                {/* rider profile like with User  */}
                {/*<div className="layer-stretch">*/}
                    {/*<div className="layer-wrapper">*/}
                        <div className="row">

                            <div className="col-lg-12">
                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Rider Profile &nbsp;&nbsp;
                                            <a href={"#"} onClick={()=>{
                                                this.setState({isEditMode : !this.state.isEditMode})
                                            }}>
                                            <i className={this.state.isEditMode ?"fa fa-times" :  "fa fa-pencil-alt "}></i>
                                            </a>
                                        </div>
                                        <div style={{position:'absolute', right:'30px', top:'25px'}}>
                                            <div className="row mr-3">
                                                <span className="text-info mr-2 mt-1">PickUp Available</span>
                                                {!this.state.isPickupLoading ? <>
                                                    <ReactSwitch onChange={pickupAvailable=>{
                                                        this.setState({pickupAvailable: pickupAvailable});
                                                        this.onChangePickup(pickupAvailable)
                                                    }} checked={this.state.pickupAvailable == 1} />
                                                </>:
                                                    <div className="pt-2">
                                                    <PulseLoader
                                                        css=" display: block;margin: 0 auto;border-color: red;"
                                                        sizeUnit={"px"}
                                                        size={10}
                                                        color={Constants.orangeColor}
                                                        loading={this.state.isPickupLoading}
                                                    /></div>
                                                    }



                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-wrapper">

                                        <div className="panel-body">
                                            {/* Rider profile photo */}
                                            <div className='row'>
                                                <div className='col text-center'>

                                                    <div className='col text-center'>
                                                        {this.state.isEditMode ? (
                                                            <>
                                                            <img className='fixed_avatar' src={this.state.avatar_file || require("../../assets/images/avatar_empty.png")  } alt=""/>
                                                            <div className='form-group'>
                                                                <div className='file-field'>
                                                                    <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose Your Avatar</span>
                                                                    <input  type='file' onChange={this.onChoosePhoto} accept=".jpg,.png,.jpeg"  />
                                                                </div>
                                                            </div>
                                                            </>
                                                        ) : (
                                                            <img className='fixed_avatar' src={this.state.avatar_file || require("../../assets/images/avatar_empty.png")} alt=""/>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                            {/* End of rider profile photo */}
                                            <table className="table table-striped table-hover mt-lg-2">
                                                <tbody>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>
                                                        {!this.state.isEditMode && global.curUser.userName}
                                                        {this.state.isEditMode && (
                                                        <div className={'row'}>
                                                            <div className={'col-6'}>
                                                                <input className="form-control" placeholder={"First Name"} type="text" id="firstName" value={this.state.firstName} onChange={event=>this.setState({firstName: event.target.value})}/>
                                                            </div>
                                                            <div className={'col-6'}>
                                                                <input className="form-control" type="text" id="lastName" placeholder={"Last Name"} value={this.state.lastName } onChange={event=>this.setState({lastName: event.target.value})}/>
                                                            </div>
                                                        </div>)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Email</td>
                                                    <td>
                                                        {!this.state.isEditMode && global.curUser.email}
                                                        {this.state.isEditMode && <input className="form-control" placeholder={""} type="text" id="email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Gender</td>
                                                    <td>
                                                        {!this.state.isEditMode && Constants.ucFirst(global.curUser.gender)}
                                                        {
                                                            this.state.isEditMode &&
                                                            <select className='form-control' name={'gender'} defaultValue={this.state.gender} onChange={e=>this.setState({gender: e.target.value})}>
                                                                {
                                                                    GenderList.map((item, index)=>{
                                                                        // return this.state.gender == item ? <option value={item} selected>{Constants.ucFirst(item)}</option>
                                                                        //     :
                                                                           return  <option key={'gender_sel_'+index} value={item} >{Constants.ucFirst(item)}</option>
                                                                    })
                                                                }
                                                            </select>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Phone {this.state.isEditMode ? '(ex : +233232243344)' : ''}</td>
                                                    <td>
                                                        {!this.state.isEditMode && global.curUser.phone}
                                                        {this.state.isEditMode &&
                                                        <input
                                                            className="form-control"
                                                            placeholder={""}
                                                            type="text"
                                                            id="phone"
                                                            value={this.state.phone }
                                                            onChange={event=>this.setState({phone: event.target.value})}/>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Address</td>
                                                    <td>
                                                        {!this.state.isEditMode && global.curUser.address}
                                                        <input
                                                            id={'address'}
                                                            onChange={event => {
                                                            console.log(event)
                                                                this.setState({address: event.target.value})
                                                             }}
                                                            type="text"
                                                            className={this.state.isEditMode ?  "form-control" : "form-control d-none"}
                                                            placeholder="Address..."
                                                            value={this.state.address}
                                                            style={{fontSize: '15px'}}/>
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td>Price Per Km</td>
                                                    <td>
                                                        GHS {!this.state.isEditMode && this.state.price_per_mile}
                                                        {this.state.isEditMode && <input className="form-control" disabled={'disabled'} placeholder={""} type="text" id="price_per_mile" value={this.state.price_per_mile } onChange={event=>this.setState({price_per_mile: event.target.value})}/>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Min Price</td>
                                                    <td>
                                                        GHS {!this.state.isEditMode && this.state.min_price}
                                                        {this.state.isEditMode && <input className="form-control" disabled={'disabled'} placeholder={""} type="text" id="min_price" value={this.state.min_price } onChange={event=>this.setState({min_price: event.target.value})}/>}
                                                    </td>
                                                </tr> */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="panel panel-default">
                                    <div className="panel-head">
                                        <div className="panel-title">Bike Information</div>
                                    </div>
                                    <div className="panel-wrapper">
                                        <div className="panel-body">
                                            {/* Bike photo */}
                                            <div className='row'>
                                                {!this.state.isEditMode ?
                                                    <div className='col text-center'>
                                                        <img className='bike_img' src={this.state.bike_photo || require("../../assets/images/empty.jpg")} alt=""/>
                                                    </div> :
                                                    <div className='col text-center'>
                                                        <img className='bike_img' src={this.state.bike_photo || require("../../assets/images/empty.jpg")} alt=""/>
                                                        <div className='form-group'>
                                                            <div className='file-field'>
                                                                <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose Bike Image</span>
                                                                <input  type='file' onChange={this.onChooseBikePhoto} accept=".jpg,.png,.jpeg"  />
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            {/* End of Bike photo */}
                                            <table className="table table-striped table-hover">
                                                <tbody>
                                                <tr>
                                                    <td>Name</td>
                                                    <td> {!this.state.isEditMode && this.state.bikeName}
                                                        {this.state.isEditMode && (
                                                            <input className="form-control" type="text" id="bikeName" value={this.state.bikeName} onChange={event=>this.setState({bikeName: event.target.value})}/>
                                                        )}

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td> License</td>
                                                    <td> {!this.state.isEditMode && this.state.bikeLicense}
                                                        {this.state.isEditMode && (
                                                            <input className="form-control" type="text" id="bikeLicense" value={this.state.bikeLicense } onChange={event=>this.setState({bikeLicense: event.target.value})}/>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Reg.No</td>
                                                    <td> {!this.state.isEditMode && this.state.reg_number}
                                                        {this.state.isEditMode && (
                                                            <input className="form-control" type="text" id="bikeRegNumber" value={this.state.reg_number } onChange={event=>this.setState({reg_number: event.target.value})}/>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Insurance</td>
                                                    <td> <p>{!this.state.isEditMode && this.state.insurance } </p>
                                                        {this.state.isEditMode && (
                                                            <textarea className="form-control" rows="5" id="insure_inf" value={this.state.insurance} onChange={event=>this.setState({insurance: event.target.value})}></textarea>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Police Report </td>
                                                    <td> <p>{!this.state.isEditMode && this.state.police}</p>
                                                        {this.state.isEditMode && (
                                                            <textarea className="form-control" rows="5" id="police_rep"  value={this.state.police } onChange={event=>this.setState({police: event.target.value})}></textarea>
                                                        )}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>



                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="">
                            {this.state.isEditMode && (
                                <button
                                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                    onClick={this.onChangeProfile}>&nbsp;&nbsp;&nbsp; Save Profile &nbsp;&nbsp;&nbsp;</button>
                            )}

                        </div>
                    {/*</div>*/}
                {/*</div>*/}
                {/*  End of  rider profile like with User */}

            </div>
        );
    }

}
RiderProfile.propTypes = {
    onChangeProfile : PropTypes.func.isRequired,
}

export default GoogleApiWrapper({
    apiKey: Constants.GOOGLE_API_KEY
})(RiderProfile);
// export default RiderProfile;
