import React from 'react';


class  Footer extends React.Component{

    constructor(props){
        super(props)

    }



    componentDidMount() {
    }

    onLogOut = ()=>{


    }


    render(){
        return (

            <footer id="footer">
                <div className="layer-stretch">

                    <div className="row layer-wrapper">
                        <div className="col-md-4 footer-block">
                            <div className="footer-ttl"><p>Contact Us</p></div>
                            <div className="footer-container footer-a">
                                <div className="tbl">
                                    <div className="tbl-row">
                                        <div className="tbl-cell"><i className="fa fa-map-marker"></i></div>
                                        <div className="tbl-cell">
                                            <p className="paragraph-medium paragraph-white">
                                                Your office, Building Name<br/>
                                                Street name, Area<br/>
                                                City, Country Pin Code
                                            </p>
                                        </div>
                                    </div>
                                    <div className="tbl-row">
                                        <div className="tbl-cell"><i className="fa fa-phone"></i></div>
                                        <div className="tbl-cell">
                                            <p className="paragraph-medium paragraph-white">11122333333</p>
                                        </div>
                                    </div>
                                    <div className="tbl-row">
                                        <div className="tbl-cell"><i className="fa fa-envelope"></i></div>
                                        <div className="tbl-cell">
                                            <p className="paragraph-medium paragraph-white">hello@yourdomain.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 footer-block">
                            <div className="footer-ttl"><p>Quick Links</p></div>
                            <div className="footer-container footer-b">
                                <div className="tbl">
                                    <div className="tbl-row">
                                        <ul className="tbl-cell">
                                            <li><a href="index_4.html">Zendas Taxi</a></li>
                                            <li><a href="about-1.html">Zendas Ecommerce</a></li>
                                            <li><a href="event-1.html">Zendas Errand</a></li>


                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 footer-block">
                            <div className="footer-ttl"><p>Newsletter</p></div>
                            <div className="footer-container">
                                <div className="footer-subscribe">
                                    <div
                                        className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">

                                        <input className="mdl-textfield__input" type="text"
                                               pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                                               placeholder="Your Email" id="subscribe-email"/>

                                    </div>
                                    <div className="footer-subscribe-button">
                                        <button
                                            className="mdl-button mdl-js-button mdl-js-ripple-effect button button-primary">Submit
                                        </button>
                                    </div>
                                </div>
                                <ul className="social-list social-list-colored footer-social">
                                    <li>
                                        <a href="#" target="_blank" id="footer-facebook" className="fab fa-facebook"></a>
                                        <span className="mdl-tooltip mdl-tooltip--top" data-mdl-for="footer-facebook">Facebook</span>
                                    </li>

                                    <li>
                                        <a href="#" target="_blank" id="footer-google" className="fab fa-google"></a>
                                        <span className="mdl-tooltip mdl-tooltip--top"
                                              data-mdl-for="footer-google">Google</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="copyright">
                    <div className="layer-stretch">
                        <div className="paragraph-medium paragraph-white">2019 © Zendas Dev ALL RIGHTS RESERVED.</div>
                    </div>
                </div>

            </footer>
        );
    }

}

export default Footer;
