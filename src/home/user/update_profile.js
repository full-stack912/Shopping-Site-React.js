import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';
import Login from "./login";
import {UserProfile} from "../../data/user_profile";
import Header from "../../header/header";
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import {Constants, GenderList} from "../../rglobal/constants";
import RestAPI from "../../global/RestAPI";
import {PulseLoader} from "react-spinners";



class  UpdateProfile extends React.Component{

    constructor(props){
        super(props)
        console.log('curUser : ', global.curUser);

        this.state={
            isLoading: false,
            isShowVerifyCode: false,
            avatar: global.curUser.avatar,
            avatar_file:null,
            userName : global.curUser.userName,
            first_name: global.curUser.firstName,
            last_name: global.curUser.lastName,
            email : global.curUser.email,
            phone:  global.curUser.phone,
            gender: global.curUser.gender ||  GenderList[0]
            // dob: global.curUser.dob,
        }
        this.onChoosePhoto = this.onChoosePhoto.bind(this)
    }


    componentDidMount() {

    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }

    onSubmit = ()=>{
        const newUser = new UserProfile({
            user_id: global.curUser.user_id,
            userName: this.state.first_name+' '+this.state.last_name,
            firstName : this.state.first_name,
            lastName: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
            token: global.curUser.token,
            role: global.curUser.role,
            // dob: this.state.dob,
            avatar: this.state.avatar_file,
            gender: this.state.gender

        });

        this.setState({isLoading:true})
        RestAPI.updateProfile(newUser, (res, err)=>{
            this.setState({isLoading:false})
            if(err !== null){
                alert('Failed to update profile, try again.')
                return
            }
            if(res.success === 1){
                let user = res.user;
                console.log(res.data);
                newUser.user_id = user.id;
                newUser.avatar = user.avatar;
                newUser.gender = user.gender;

                global.setUser(newUser);

                window.location.href='/bike_profile';
            }else{
                alert('Failed to update profile, please try again with correct data.')
                return
            }


        })

        global.setUser(newUser);

        if(this.props.onSubmit){
            this.props.onSubmit();
        }

    };

    onChoosePhoto = (event)=>{
        this.setState({
            avatar: window.URL.createObjectURL(event.target.files[0]),
            avatar_file: event.target.files[0]

        })
    }
    render(){
        return (
            <div>
                <Header
                    onLogin={()=>{}}
                    onRegister={()=>{}}
                    onLogOut={()=>{}}
                />

                <div class="page-ttl">
                    <div class="layer-stretch">
                        <div class="page-ttl-container">
                            <h1>Update <span class="text-primary">Profile</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Update Profile</span></p>
                        </div>
                    </div>
                </div>
                <div className='row'>
                {!isMobile && <div className="col-lg-3"></div>}
                <div className="col-lg-6">
                    <div className="layer-stretch">
                    <div className="layer-wrapper">
                        <div className='row'>
                            <div className='col text-center'>
                                <img className='fixed_avatar' src={this.state.avatar ? this.state.avatar : require("../../assets/images/avatar_empty.png")} alt=""/>
                                <div className='form-group'>
                                    <div className='file-field'>
                                        <span className='btn btn-outline btn-primary btn-pill btn-sm btn-outline-1x m-1'>Choose file</span>
                                        <input  type='file' onChange={this.onChoosePhoto} accept=".jpg,.png,.jpeg"  />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row pt-4">
                            <div class="col">
                                <div className={'row'}>
                                    <div className='col'>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <input className="mdl-textfield__input" type="text" id="first_name" value={this.state.first_name} onChange={event=>this.setState({first_name: event.target.value})}/>
                                            <label className="mdl-textfield__label" htmlFor="first_name">First Name</label>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <input className="mdl-textfield__input" type="text" id="last_name" value={this.state.last_name} onChange={event=>this.setState({last_name: event.target.value})}/>
                                            <label className="mdl-textfield__label" htmlFor="last_name">Last Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className='col'>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <input className="mdl-textfield__input" type="email" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>
                                            <label className="mdl-textfield__label" htmlFor="user_email">Email Address</label>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <select className='mdl-textfield__input' style={{height:'34px', borderBottom:'#194b7d 1px solid '}} name={'gender'} onChange={e=>this.setState({gender: e.target.value})}>
                                                {
                                                    GenderList.map((item, index)=>{

                                                        return this.state.gender == item ? <option value={item} selected>{Constants.ucFirst(item)}</option>
                                                            : <option value={item} >{Constants.ucFirst(item)}</option>
                                                    })
                                                }
                                            </select>
                                            {/*<input className="mdl-textfield__input" type="select" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>*/}
                                            <label className="mdl-textfield__label" htmlFor="user_email">Gender</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                    <input className="mdl-textfield__input" type="text" id="phone" value={this.state.phone} onChange={event=>this.setState({phone: event.target.value})}/>
                                    <label className="mdl-textfield__label" htmlFor="phone">Phone Number</label>
                                </div>

                                <div className="">
                                    {this.state.isLoading ?
                                        <PulseLoader
                                            css=" display: block;margin: 0 auto;border-color: red;"
                                            sizeUnit={"px"}
                                            size={15}
                                            color={Constants.orangeColor}
                                            loading={this.state.isPickupLoading}
                                        />:
                                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill" onClick={this.onSubmit}>&nbsp;&nbsp;&nbsp; Submit &nbsp;&nbsp;&nbsp;</button>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                {!isMobile && <div className="col-lg-3"></div>}
                </div>
            </div>
        );
    }

}
// UpdateProfile.propTypes = {
//     onClickHome : PropTypes.func.isRequired,
//     onSubmit : PropTypes.func.isRequired,
//
// }

export default UpdateProfile;
