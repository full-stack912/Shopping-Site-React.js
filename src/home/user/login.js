import React from 'react';
import Header from "../../header/header";
import PropTypes from 'prop-types';
import {BikeProfile, UserProfile} from "../../data/user_profile";
import RestApi from "../../global/RestAPI";
import {SubLoader, SubPulseLoader} from "../../global/SubLoader";

class  Login extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            email:'',
            pwd:'',
            isLoading:false,
        }
    }


    componentDidMount() {
    }

    onLogin = ()=>{
        this.setState({isLoading:true})
        RestApi.login(this.state.email, this.state.pwd, (res, err)=>{
            this.setState({isLoading:false})
            if(err!== null){
                alert('Failed to login. '+err)
                return
            }
            console.log('logged in res==>', res)
            if(res.success === 1){
                let user = res.data.user

                if(user.role_id == UserProfile.ROLE_CUSTOMER){
                    let newUser = new UserProfile({
                        userName: user.first_name + ' ' + user.last_name,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        email: user.email,
                        gender: user.gender,
                        phone: user.phone_number,
                        token: res.data.token,
                        // dob: new Date('1990-03-15'),
                        avatar: user.avatar,
                        role: user.role_id,
                        user_id: user.id,
                        is_active: user.is_active
                    });
                    global.setUser(newUser);
                }else if(user.role_id == UserProfile.ROLE_RIDER){
                    let newUser = new UserProfile({
                        userName: user.first_name+' '+user.last_name,
                        email: user.email,
                        phone: user.phone_number,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        gender: user.gender,
                        token: res.data.token,
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


                    global.setUser(newUser);

                }

                this.props.onLoggedIn();
            }else{
                alert('Failed to login, please try with correct data.')
            }


        })

    }

    render(){
        return (
            <div>
                <div className="page-ttl">
                    <div className="layer-stretch">
                        <div className="page-ttl-container">
                            <h1>Log <span className="text-primary">In</span></h1>
                            <p><a href="#" onClick={this.props.onClickHome}>Home</a> &#8594; <span>Log in</span></p>
                        </div>
                    </div>
                </div>

                <div className="layer-stretch">
                    <div className="layer-wrapper">
                        <div className="row pt-4">
                            <div className="col-md-4"></div>
                            <div className="col-md-4 ">
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <div
                                            className="mdl-textfield text-left mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <label className="text-left" htmlFor="email">Email Address</label>
                                            <input className="mdl-textfield__input" type="email" id="email" value={this.state.email} onChange={email=>this.setState({email:email.target.value})}/>
                                            
                                        </div>
                                        <div
                                            className="mdl-textfield text-left mdl-js-textfield mdl-textfield--floating-label form-input">
                                            <label className="" htmlFor="password">Password</label>
                                            <input className="mdl-textfield__input" type="password" id="password" value={this.state.pwd} onChange={pwd=>this.setState({pwd:pwd.target.value})}/>
                                            
                                        </div>
                                        <div className="text-center">
                                            {!this.state.isLoading &&
                                            <button
                                                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                onClick={this.onLogin}>
                                                Sign In
                                            </button>}
                                            <SubPulseLoader isLoading={this.state.isLoading}/>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4"></div>
                        </div>
                    </div>
                    <div className="login-link">
                        <span className="paragraph-small">Don't you have an account?</span>
                        <a  className="" onClick={this.props.onClickRegister}>Register as New User</a>
                    </div>
                </div>

            </div>
        );
    }

}

Login.propTypes = {
    onClickHome : PropTypes.func.isRequired,
    onClickRegister : PropTypes.func.isRequired,
    onLoggedIn : PropTypes.func.isRequired,
}

export default Login;
