import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            curUser : global.curUser,
        }
    }

    componentDidMount() {
        this.setUser = this.setUser.bind(this)
        global.observeUser.forHeader = this.setUser;
    }

    componentWillUnmount() {
        global.observeUser.forHeader = null;
    }

    setUser = ()=>{
        this.setState({
            curUser: global.curUser,
        })
    }

    onLogin = ()=> {
        if(this.props.onLogin){
            this.props.onLogin();
            console.log('loging clicked will call props')
        }else{
            console.log('loging clicked will not call props')
        }
    }

    onRegister = ()=>{
        if(this.props.onRegister){
            this.props.onRegister();
        }
    }

    viewCustomerMenu = ()=>{
        return (
            <ul className="menu" style={{display:  global.curUser.isCustomer() ? '':'none'}}>

                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/bike'}> Zendas Bike</a>
                </li>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'http://shop.zendasgh.com/'} target={'_blank'}> Zendas Shop</a>
                </li>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/errand'}> Zendas Errand</a>
                </li>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect">
                        <i className="fa fa-user-circle fa-3x fa-header" style={{color:'#ff654d', width:'20px', height:'20px', fontSize:'18px'}}></i>
                        {this.state.curUser.userName || ''}</a>
                    <ul className="menu-megamenu menu-megamenu-small" style={{width: '150px'}}>
                        <li className="row">
                            <div className="col">
                                <ul>

                                    {this.props.isBike === true ? <li><a href="/bike_trips">My Trips</a></li> : null}
                                    {this.props.isErrand === true ? <li><a href="/errand_requests">My Errands</a></li> : null}
                                    <li><a href="/bike_wallet">ZWallet</a></li>
                                    {/*{this.props.isBike === true ? <li><a href="/bike_free_rides">Free rides</a></li> : null}*/}
                                    <li><a href="/bike_profile">Profile</a></li>

                                </ul>
                            </div>
                        </li>
                    </ul>
                </li>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/logout'}>
                        {/*<i className="fa fa-sign-out-alt fa-1x"></i>*/}
                        Logout</a>
                </li>
                <li className="mobile-menu-close"><i className="fa fa-times"></i></li>
            </ul>
        )
    }

    viewCarrierMenu = ()=>{
        return (
            <ul className="menu">
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/carrier_dashboard'}>Dashboard</a>
                </li>

                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect">
                        <i className="fa fa-user-circle fa-3x fa-header" style={{color:'#ff654d', width:'20px', height:'20px', fontSize:'18px'}}></i>
                        {this.state.curUser.userName || ''}</a>
                    <ul className="menu-megamenu menu-megamenu-small" style={{width: '150px'}}>
                        <li className="row">
                            <div className="col">
                                <ul>
                                    {/*{this.props.isBike === true ? <li><a href="/bike_trips">My Trips</a></li> : null}*/}
                                    {/*<li><a href="/rider_wallet">ZWallet</a></li>*/}
                                    {/*{this.props.isBike === true ? <li><a href="/bike_free_rides">Free rides</a></li> : null}*/}
                                    <li><a href="/carrier_profile">Profile</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </li>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/logout'}>
                        {/*<i className="fa fa-sign-out-alt fa-1x"></i>*/}
                        Logout</a>
                </li>
                <li className="mobile-menu-close"><i className="fa fa-times"></i></li>
            </ul>
        )
    }

    viewRiderMenu = ()=>{
        return (
            <ul className="menu" style={{display: global.curUser.isRider() ? '':'none'}}>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/rider_dashboard'}>Dashboard</a>
                </li>

                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect">
                        <i className="fa fa-user-circle fa-3x fa-header" style={{color:'#ff654d', width:'20px', height:'20px', fontSize:'18px'}}></i>
                        {this.state.curUser.userName || ''}</a>
                    <ul className="menu-megamenu menu-megamenu-small" style={{width: '150px'}}>
                        <li className="row">
                            <div className="col">
                                <ul>
                                    {/*{this.props.isBike === true ? <li><a href="/bike_trips">My Trips</a></li> : null}*/}
                                    {/*<li><a href="/rider_wallet">ZWallet</a></li>*/}
                                    {/*{this.props.isBike === true ? <li><a href="/bike_free_rides">Free rides</a></li> : null}*/}
                                    <li><a href="/rider_profile">Profile</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </li>
                <li className="menu-megamenu-li" >
                    <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/logout'}>
                        {/*<i className="fa fa-sign-out-alt fa-1x"></i>*/}
                        Logout</a>
                </li>
                <li className="mobile-menu-close"><i className="fa fa-times"></i></li>
            </ul>
        )
    }

    renderHeaderMainPart = ()=>{

        return <div className="layer-stretch hdr">
            <div className="tbl animated fadeInDown">
                <div className="tbl-row">
                    <div className="tbl-cell hdr-logo">
                        <a href="/">
                            <img src={require("../assets/apez/images/logo.png")} alt=""/>
                        </a>
                    </div>
                    <div className="tbl-cell hdr-menu">
                        {/*NormalMenu*/}
                        {global.curUser === null ?
                        <ul className="menu" >
                            <li className="menu-megamenu-li" style={{display:this.props.isBike ? '':'none'}}>
                                <a
                                    href="/rider_register"
                                    className="btn btn-outline btn-primary btn-main-fill-60  m-1" >JOIN AS RIDER
                                </a>
                            </li>
                            <li className="menu-megamenu-li" style={{display:this.props.isErrand ? '':'none'}}>
                                <a
                                    href="/carrier_register"
                                    className="btn btn-outline btn-primary btn-main-fill-60  m-1" >JOIN AS CARRIER
                                </a>
                            </li>
                            <li className="menu-megamenu-li" >
                                {/*<a className="mdl-button mdl-js-button mdl-js-ripple-effect" onClick={this.onLogin} >Login </a>*/}
                                <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/login'} >Login </a>
                            </li>
                            <li className="menu-megamenu-li" >
                                {/*<a className="mdl-button mdl-js-button mdl-js-ripple-effect" onClick={this.onRegister} >Register </a>*/}
                                <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href={'/register'} >Register </a>
                            </li>
                            <li className="mobile-menu-close"><i className="fa fa-times"></i></li>
                        </ul> : null}
                        {/*End NormalMenu*/}

                        {/*Customer Menu*/}
                        {global.curUser && global.curUser.isCustomer() && this.viewCustomerMenu()}

                        {/*End of Customer Menu*/}

                        {/* Rider Menu */}
                        { global.curUser && global.curUser.isRider() && this.viewRiderMenu()}

                        {/*end of rider menu*/}

                        {/* Carrier Menu */}
                        { global.curUser && global.curUser.isCarrier() && this.viewCarrierMenu()}
                        {/*Carrier Menu */}

                        <div id="menu-bar"><a><i className="fa fa-bars"></i></a></div>
                    </div>
                </div>
            </div>
            <div className="search-bar animated zoomIn">
                <div className="search-content">
                    <div className="search-input">
                        <input type="text" placeholder="Enter your text ...."/>
                        <button className="search-btn"><i className="icon-magnifier"></i></button>
                    </div>
                </div>
                <div className="search-close"><i className="icon-close"></i></div>
            </div>
        </div>
    }

    render(){

        return (
            <div>
                { this.props.backgroundColor ?
                    <header id="header_fixed" className='header_fixed header-dark-map' style={{backgroundColor:this.props.backgroundColor}} >
                        {this.renderHeaderMainPart()}
                    </header> :
                    <header id="header" className='header-dark-map'  >
                        {this.renderHeaderMainPart()}
                    </header>
                }
            </div>



        );
    }

}

Header.propTypes = {
    onLogin : PropTypes.func,
    onRegister : PropTypes.func,
    onLogOut : PropTypes.func,
    backgroundColor: PropTypes.string,
    isBike: PropTypes.bool,
    isErrand: PropTypes.bool
}
export default Header;
