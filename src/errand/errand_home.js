import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Header from "../header/header";

import Footer from "../footer/footer";
import {Animated} from "react-animated-css";
import SMSComp from "../home/user/sms";
import Login from "../home/user/login";
import RestAPI from "../global/RestAPI";

class ErrandHome extends React.Component{

    constructor(props){
        super(props)

        this.state = {

        }
    }


    componentDidMount() {


    }

    onLoggedIn = ()=>{

    }
    render(){
        return (
            <Router>
                <div>
                    <Header
                        // onLogin={this.onClickLogin}
                        // onRegister={this.onClickRegister}
                        // onLogOut={()=>{ }}
                        isErrand={true}
                        backgroundColor={'#fff'}
                    />
                    <div >
                        <Animated animationIn="fadeIn" animationOut="fadeOut"  animationInDuration={500} animationOutDuration={500} isVisible={this.state.isShowHome}>
                            <div id="slider">
                                <div className="flexslider slider-wrapper" style={{paddingTop:'100px'}}>
                                    <ul className="slides">
                                        <li>
                                            <div className="slider-backgroung-image"
                                                 style={{backgroundImage: "url('./assets/js/apez/uploads/errand_big.jpg')"}}>
                                                <div className="layer-stretch">
                                                    <div className="slider-info">
                                                        <h1>Ask to deliver,our riders will reach you!</h1>
                                                        <p className="animated fadeInDown">We are available at Zendas for any errands, Please request, We will service for you kindly.</p>
                                                        <div className="slider-button">
                                                            <a
                                                                href="/errand_request"
                                                                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill">
                                                                Request Now!
                                                            </a>
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
                                        <div className="layer-ttl"><h4>Best Errand <span
                                            className="text-primary">Services</span></h4></div>
                                        <p className="layer-sub-ttl">All services will be created here, and supported by us.</p>
                                        <div className="row pt-4">
                                            <div className="row">
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="service-card-3">
                                                        <div className="service-icon-step clip-path-begin bg-info">
                                                            {/*<i className="fas fa-taxi text-white bg-warning" size="40"></i>*/}
                                                            <strong>1</strong>
                                                        </div>

                                                        <div className="service-heading ">Post Request</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="service-card-3">
                                                        <div className="service-icon-step clip-path-mid bg-primary">
                                                            {/*<i className="fas fa-shopping-cart text-white bg-danger"></i>*/}
                                                            <strong>2</strong>
                                                        </div>
                                                        <div className="service-heading">Choose Deliverer</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="service-card-3">
                                                        <div className="service-icon-step clip-path-mid bg-primary">

                                                            {/*<i className="fas fa-shipping-fast text-white bg-dark-second"></i>*/}
                                                            <strong>3</strong>
                                                        </div>
                                                        <div className="service-heading">Tracking</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="service-card-3">
                                                        <div className="service-icon-step clip-path-end bg-success">

                                                            {/*<i className="fas fa-shipping-fast text-white bg-dark-second"></i>*/}
                                                            <strong>Finalize</strong>
                                                        </div>
                                                        <div className="service-heading">Finish Request</div>
                                                        <div className="service-body">
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt</p>

                                                            <div className="clearfix"><br/></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                                <div className="col-md-12">
                                                <a
                                                    href="/errand_request"
                                                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill">
                                                    Request Now!
                                                </a>
                                                </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="portfolio">
                                <div className="layer-stretch">
                                    <div className="layer-wrapper pb-20">
                                        <div className="layer-ttl"><h4>Our <span className="text-primary">Deliverers</span>
                                        </h4></div>

                                        <div className="portfolio-header text-center pt-4">
                                            {/*<button className="portfolio-filter active" data-filter="all">All</button>*/}
                                            {/*<button className="portfolio-filter" data-filter="taxi">Taxi Drivers</button>*/}
                                            {/*<button className="portfolio-filter" data-filter="ecommerce">Ecommerce</button>*/}
                                            {/*<button className="portfolio-filter" data-filter="riders">Riders</button>*/}

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

                    <Footer></Footer>
                </div>
            </Router>

        );
    }

}

ErrandHome.propTypes = {
    initPath: PropTypes.string.isRequired,
}

export default ErrandHome;
