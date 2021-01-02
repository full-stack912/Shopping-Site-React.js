import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Header from "../header/header";
import BtnMain from "../assets/components/btns";
import Footer from "../footer/footer";
import {Animated} from "react-animated-css";
import SMSComp from "./user/sms";
import Login from "./user/login";

class  Home extends React.Component{

    constructor(props){
        super(props)
        const initPath = this.props.initPath
        this.state = {
            isShowHome : initPath === "/",
            isShowSMS : initPath === 'register',
            isShowUserProfile : initPath === 'profile',
            isShowLogin : initPath === 'login'
        }
    }

    componentDidMount() {
    }

    onClickLogin= ()=>{
        this.setState({
            isShowHome : false,
            isShowSMS : false,
            isShowUserProfile : false,
            isShowLogin: true
        })
    }
    onClickRegister = ()=>{
        this.setState({
            isShowHome : false,
            isShowSMS : true,
            isShowUserProfile : false,
            isShowLogin: false
        })
    }
    gotoHome = ()=>{

        this.setState({
            isShowHome : true,
            isShowSMS : false,
            isShowUserProfile : false,
            isShowLogin: false
        })
    }

    onLoggedIn = ()=>{
        this.gotoHome()
    }
    render(){
        return (
            <Router>
                <div>
                    <Header
                        isBike={false}
                        isErrand={false}
                        onLogin={this.onClickLogin}
                        onRegister={this.onClickRegister}
                        onLogOut={()=>{ }}
                        backgroundColor={'#fff'}
                    />

                    <div style={{display: this.state.isShowHome ? 'inline' : 'none'}}>
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isShowHome}>
                            <div id="slider">
                                <div className="flexslider slider-wrapper" style={{paddingTop:'100px'}}>
                                    <ul className="slides">
                                        <li>
                                            <div className="slider-backgroung-image"
                                                 style={{backgroundImage: "url('./assets/js/apez/uploads/slider-1.jpg')"}}>
                                                <div className="layer-stretch">
                                                    <div className="slider-info">
                                                        <h1>Reach out soon when you pickup rider.</h1>
                                                        <p className="animated fadeInDown">We have created 80+ Pages, 300+
                                                            Components or Shortcodes, Popup for this template and more in
                                                            future. #twitterhash, @facebooktag</p>
                                                            <BtnMain title={'Pickup Rider'} onClick={()=>{window.location.href = '/bike'}}/>
                                                        {/* <div className="slider-button">
                                                            <a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                               href={"/bike"}
                                                            >Pickup Rider</a>
                                                        </div> */}
                                                    </div>
                                                </div>

                                            </div>
                                        </li>
                                        <li>
                                            <div className="slider-backgroung-image"
                                                 style={{backgroundImage: "url('./assets/js/apez/uploads/slider-2.jpg')"}}>
                                                <div className="layer-stretch">
                                                    <div className="slider-info">
                                                        <h1>Enjoy online shopping</h1>
                                                        <p className="animated fadeInDown">We have created 55+ Pages, 200+
                                                            Components or Shortcodes, Popup for this template and more in
                                                            future. #twitterhash, @facebooktag</p>
                                                        <div className="slider-button">
                                                            <a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                               href={"http://shop.zendasgh.com/"}
                                                               target="_blank"
                                                            >Enjoy
                                                                Shopping!</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="slider-backgroung-image"
                                                 style={{backgroundImage: "url('./assets/js/apez/uploads/errand_big.jpg')"}}>
                                                <div className="layer-stretch">
                                                    <div className="slider-info">
                                                        <h1>Ask to deliver,our riders will reach you!</h1>
                                                        <p className="animated fadeInDown">We have created 55+ Pages, 200+
                                                            Components or Shortcodes, Popup for this template and more in
                                                            future. #twitterhash, @facebooktag</p>
                                                        <div className="slider-button">
                                                            <a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                                                               href={"/errand"}
                                                            >Make
                                                                a Booking</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="service">
                                <div className="layer-stretch">
                                    <div className="layer-wrapper pb-2">
                                        <div className="layer-ttl"><h4>Best & Universal <span
                                            className="text-primary">Services</span></h4></div>
                                        <p className="layer-sub-ttl">All services will be created here, and supported by us.</p>
                                        <div className="row pt-4">
                                            <div className="row">
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="service-card-3">
                                                        <div className="service-icon">
                                                            <i className="fas fa-taxi text-white bg-warning" size="40"></i>

                                                        </div>

                                                        <div className="service-heading">Zendas Bike</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>
                                                             <a
                                                                className="btn btn-primary btn-main-fill-60 btn-pill m-1" href={"/bike"}>&nbsp;&nbsp;&nbsp; Go
                                                                To &nbsp;&nbsp;&nbsp;</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="service-card-3">
                                                        <div className="service-icon"><i
                                                            className="fas fa-shopping-cart text-white bg-danger"></i></div>
                                                        <div className="service-heading">Zendas Ecommerce</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>
                                                            <a
                                                                className="btn btn-primary btn-main-fill-60 btn-pill m-1" href={"http://shop.zendasgh.com/"} target="_blank">&nbsp;&nbsp;&nbsp; Go
                                                                To &nbsp;&nbsp;&nbsp;</a>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="service-card-3">
                                                        <div className="service-icon">

                                                            <i className="fas fa-shipping-fast text-white bg-dark-second"></i>
                                                        </div>
                                                        <div className="service-heading">Zendas Errand</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>
                                                            <a
                                                                className="btn btn-primary btn-main-fill-60 btn-pill m-1" href={"/errand"}>&nbsp;&nbsp;&nbsp; Go
                                                                To &nbsp;&nbsp;&nbsp;</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="about">

                                <div className="layer-stretch">
                                    <div className="layer-wrapper">
                                        <div className="layer-ttl"><h4>About <span className="text-primary">Us</span></h4></div>
                                        <div className="layer-sub-ttl">We drive for you and sell, deliver all. You will do
                                            everything here.
                                        </div>
                                        <div className="row pt-4 pb-4">
                                            <div className="col-md-4">
                                                <p className="text-black">
                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum et saepe
                                                    quam eos, exercitationem cumque veniam quisquam voluptates quasi beatae, aut
                                                    nam delectus numquam est possimus reiciendis, nulla quis quod!
                                                </p>
                                            </div>
                                            <div className="col-md-4">
                                                <p className="text-black">
                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum et saepe
                                                    quam eos, exercitationem cumque veniam quisquam voluptates quasi beatae, aut
                                                    nam delectus numquam est possimus reiciendis, nulla quis quod!
                                                </p>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="skills mt-0">
                                                    <p className="font-14">Web Design<span
                                                        className="badge badge-primary badge-pill float-right">85%</span></p>
                                                    <div className="progress progress-xs">
                                                        <div className="progress-bar progress-bar-striped bg-primary"
                                                             role="progressbar" style={{width: '85%'}} aria-valuenow="85"
                                                             aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div className="skills mt-3">
                                                    <p className="font-14">Web Development<span
                                                        className="badge badge-success badge-pill float-right">90%</span></p>
                                                    <div className="progress progress-xs">
                                                        <div className="progress-bar progress-bar-striped bg-success"
                                                             role="progressbar" style={{width: '90%'}} aria-valuenow="90"
                                                             aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row number-counter-02">
                                            <div className="col">
                                                <div className="number-counter">
                                                    <i className="icon-badge"></i>
                                                    <div className="number"><span className="counter">1050</span></div>
                                                    <p className="">Total Requests</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="number-counter">
                                                    <i className="icon-cup"></i>
                                                    <div className="number"><span className="counter">4500</span></div>
                                                    <p className="">Total Riders</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="number-counter">
                                                    <i className="icon-ghost"></i>
                                                    <div className="number"><span className="counter">100</span>%</div>
                                                    <p className="">Customer Satisfaction</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="portfolio">
                                <div className="layer-stretch">
                                    <div className="layer-wrapper pb-20">
                                        <div className="layer-ttl"><h4>Our <span className="text-primary">Serice Staffs</span>
                                        </h4></div>

                                        <div className="portfolio-header text-center pt-4">
                                            <button className="portfolio-filter active" data-filter="all">All</button>
                                            <button className="portfolio-filter" data-filter="taxi">Taxi Drivers</button>
                                            <button className="portfolio-filter" data-filter="ecommerce">Ecommerce</button>
                                            <button className="portfolio-filter" data-filter="riders">Riders</button>

                                        </div>
                                        <div className="portfolio-wrapper">
                                            <ul className="row">
                                                <li className="col-sm-6 col-md-6 col-lg-4 portfolio-img filter taxi">
                                                    <div className="team-block">
                                                        <div className="team-img">
                                                            <img src={require("../assets/apez/uploads/team-1.jpg")} alt=""/>
                                                            <div className="team-description">
                                                                <div>
                                                                    <span>I am taxi rider</span>
                                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                                        Adipisci quos, consectetur quidem, delectus labore
                                                                        laboriosam est distinctio assumenda id a magnam
                                                                        excepturi...</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="team-details">
                                                            <h3>John Snow</h3>
                                                            <p>Taxi Driver</p>
                                                        </div>
                                                        <div className="team-social">
                                                            <ul>
                                                                <li><a href="#"><i className="icon-social-facebook"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-twitter"></i></a></li>
                                                                <li><a href="#"><i className="icon-social-dribbble"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-instagram"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-linkedin"></i></a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="col-sm-6 col-md-6 col-lg-4 portfolio-img filter ecommerce">
                                                    <div className="team-block">
                                                        <div className="team-img">
                                                            <img src={require("../assets/apez/uploads/team-2.jpg")} alt=""/>
                                                            <div className="team-description">
                                                                <div>
                                                                    <span>I am Cooker</span>
                                                                    <p>I am making foods for customers with quality and
                                                                        valuable...</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="team-details">
                                                            <h3>Elena Gmaz</h3>
                                                            <p>Cooker</p>
                                                        </div>
                                                        <div className="team-social">
                                                            <ul>
                                                                <li><a href="#"><i className="icon-social-facebook"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-twitter"></i></a></li>
                                                                <li><a href="#"><i className="icon-social-dribbble"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-instagram"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-linkedin"></i></a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="col-sm-6 col-md-6 col-lg-4 portfolio-img filter riders">
                                                    <div className="team-block">
                                                        <div className="team-img">
                                                            <img src={require("../assets/apez/uploads/team-3.jpg")} alt=""/>
                                                            <div className="team-description">
                                                                <div>
                                                                    <span>I am Seller</span>
                                                                    <p>Fashionable, Perfect, good products will be selled for
                                                                        you...</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="team-details">
                                                            <h3>Daniel Lewis</h3>
                                                            <p>Seller</p>
                                                        </div>
                                                        <div className="team-social">
                                                            <ul>
                                                                <li><a href="#"><i className="icon-social-facebook"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-twitter"></i></a></li>
                                                                <li><a href="#"><i className="icon-social-dribbble"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-instagram"></i></a>
                                                                </li>
                                                                <li><a href="#"><i className="icon-social-linkedin"></i></a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Animated>
                    </div>

                    <div style={{display: this.state.isShowSMS ? 'inline' : 'none'}}>
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isShowSMS}>
                            <SMSComp onClickHome={this.gotoHome}/>
                        </Animated>
                    </div>

                    <div style={{display: this.state.isShowLogin ? 'inline' : 'none'}}>
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isShowLogin}>
                            <Login
                                onClickHome={this.gotoHome}
                                onClickRegister={this.onClickRegister}
                                onLoggedIn={this.onLoggedIn}
                            />
                        </Animated>
                    </div>

                    <Footer></Footer>
                </div>
            </Router>

        );
    }

}

Home.propTypes = {
    initPath: PropTypes.string.isRequired,
}

export default Home;
