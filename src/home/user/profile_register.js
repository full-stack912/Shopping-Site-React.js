import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';
import Login from "./login";
import {UserProfile} from "../../data/user_profile";
import {Constants, GenderList} from "../../rglobal/constants";
import RestAPI from "../../global/RestAPI";



class  ProfileRegister extends React.Component{

    constructor(props){
        super(props)

        this.state={
            isShowVerifyCode: false,
            first_name:'',
            last_name : '',
            email : '',
            pwd : '',
            c_pwd : '',
            gender:GenderList[0]

        }

    }


    componentDidMount() {

        setTimeout(()=>{
            this.setState({
                pwd:'',
                email : '',
            })
        },100)
    }

    onSendSMS = ()=>{
        this.setState({
            isShowVerifyCode: true,
        })
    }

    onSubmit = ()=>{
        const {phone} = this.props
        const {email, pwd, c_pwd, first_name, last_name, gender} = this.state;

        if(pwd !== c_pwd){
            alert('Input password correctly')
            return
        }

        if(first_name == ''){
            alert('Input first name')
            return
        }

        if(last_name == ''){
            alert('Input last name')
            return
        }

        RestAPI.signUp(email, pwd, gender, first_name, last_name, phone, global.pushToken, (res, err)=>{
            if(err !== null){
                alert('Failed to register.')
                return
            }
            if(res.success === 1){
                let user = res.data.user
                let token = res.data.token

                const newUser = new UserProfile({
                    userName: user.first_name + ' ' + user.last_name,
                    firstName:user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    phone: user.phone_number,
                    token: token,
                    // dob: new Date('1990-03-15'),
                    avatar: user.avatar,
                    role: user.role_id,
                    user_id: user.id,
                    gender: user.gender,
                });

                global.setUser(newUser);
                this.props.onSubmit();
            }else{
                alert('Failed to register, please try again.')
            }
        })

    };

    render(){
        return (
            <div>
                <div className="page-ttl">
                    <div className="layer-stretch">
                        <div className="page-ttl-container">
                            <h1>Profile <span className="text-primary">Register</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Profile</span></p>
                        </div>
                    </div>
                </div>
                <div className="layer-stretch">
                    <div className="layer-wrapper">
                        <div className="row pt-4">

                            <div className="col" style={{maxWidth:500}}>
                                <div className={'row'}>
                                    <div className={'col-6'}>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                        <label className="" htmlFor="first_name">First Name</label>
                                            <input className="mdl-textfield__input"
                                                   type="text"
                                                   autoComplete={'off'}
                                                   id="first_name"
                                                   value={this.state.first_name}
                                                   onChange={event=>this.setState({first_name:event.target.value})}
                                            />
                                            
                                        </div>
                                    </div>
                                    <div className={'col-6'}>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                        <label className="" htmlFor="user_name">Last Name</label>
                                            <input className="mdl-textfield__input"
                                                   type="text" id="user_name"
                                                   autoComplete={'off'}
                                                   value={this.state.last_name}
                                                   onChange={event=>this.setState({last_name:event.target.value})}/>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className={'row'}>
                                    <div className={'col-md-6'}>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                            <label className="" htmlFor="user_email">Email Address</label>
                                            <input className="mdl-textfield__input"
                                                   type="email"
                                                   id="user_email"
                                                   autoComplete={'off'}
                                                   value={this.state.email}
                                                   onChange={event=>this.setState({email:event.target.value})}
                                            />

                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <select className='mdl-textfield__input' name={'gender'} onChange={e=>this.setState({gender: e.target.value})}>
                                                {
                                                    GenderList.map((item, index)=>{

                                                        return this.state.gender == item ? <option value={item} selected>{Constants.ucFirst(item)}</option>
                                                            : <option value={item} >{Constants.ucFirst(item)}</option>
                                                    })
                                                }
                                            </select>
                                            {/*<input className="mdl-textfield__input" type="select" id="user_email" value={this.state.email} onChange={event=>this.setState({email: event.target.value})}/>*/}
                                            <label className="mdl-textfield__label" htmlFor="gender">Gender</label>
                                        </div>
                                    </div>
                                </div>


                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                <label className="" htmlFor="pwd">Password</label>
                                    <input className="mdl-textfield__input"
                                           type="password"
                                           ref={ref=>{this.inpPwd = ref}}
                                           id="pwd"
                                           autoComplete={'off'}
                                           value={this.state.pwd}
                                           onChange={event=>this.setState({pwd:event.target.value})}
                                    />
                                    
                                </div>
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input text-left">
                                <label className="" htmlFor="repwd">Confirm Password</label>
                                    <input className="mdl-textfield__input"
                                           type="password"
                                           id="repwd"
                                           autoComplete={'off'}
                                           value={this.state.c_pwd}
                                           onChange={event=>this.setState({c_pwd:event.target.value})}
                                    />
                                    
                                </div>

                                {/*<div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">*/}
                                {/*    <input className="mdl-textfield__input" */}
                                {/*           type="date" */}
                                {/*           id="dob" placeholder=''/>*/}
                                {/*    <label className="mdl-textfield__label" htmlFor="dob">Date of birthday</label>*/}
                                {/*</div>*/}
                                <div >
                                    <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                            onClick={this.onSubmit}>&nbsp;&nbsp;&nbsp; Submit &nbsp;&nbsp;&nbsp;</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <script>

                </script>
            </div>
        );
    }

}
ProfileRegister.propTypes = {
    onClickHome : PropTypes.func.isRequired,
    onSubmit : PropTypes.func.isRequired,

}

export default ProfileRegister;

