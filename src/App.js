import React from 'react';
import { BrowserRouter , Route, Link, Switch, Redirect } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

import Header from "./header/header";
import Footer from "./footer/footer"
import Home from "./home/home";
import SMSComp from "./home/user/sms";
import BikeHome from "./bike/bike_home";
import BikeDashboard from "./bike/bike_dashboard";
import UpdateProfile from "./home/user/update_profile";
import RiderRegister from "./rider/rider_register";
import {UserProfile} from "./data/user_profile";
import RiderDashboard from "./rider/dashboard/rider_dashboard"
import ErrandHome from "./errand/errand_home";
import ErrandPostRequest from "./errand/customer/errand_post_rerquest";
import ErrandDashboard from "./errand/customer/errand_dashboard";
import CarrierRegister from "./errand/carrier/carrier_register";
import CarrierDashboard from "./errand/carrier/dashboard/carrier_dashboard";

import { messaging } from "./init-fcm";
import ReactNotification, {store} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

const registerPushListener = pushNotification =>
    navigator.serviceWorker.addEventListener("message", ({ data }) =>{
            console.log('data=>', data)
            let notifyData = data.data ? data.data : data["firebase-messaging-msg-data"].data;

            pushNotification({
                type:notifyData.type,
                title:notifyData.title,
                body:notifyData.message,
                link:notifyData.link,
                data:notifyData.data,
            })
        }
    );

class  App extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            token:null,
        }
        

        global.observe = {};

        global.observeUser = {};
        const localStoreUser = localStorage.getItem('cur_user') || null;

        global.curUser = localStoreUser ? new UserProfile(JSON.parse(localStoreUser)) : null;

        // this.showNotification = this.showNotification.bind(this);

        // global.methods = {showNotification : this.showNotification};

        global.showNotification = (title, body, type, onClick)=>{
            this.showNotification(title, body, type, onClick)
        }

        global.setUser = (newUser)=>{

            if(newUser === null){
                localStorage.removeItem('cur_user');
                global.curUser = null;
            }else{
                global.curUser = global.curUser === null ? {} : global.curUser;
                Object.assign(global.curUser, newUser);
                localStorage.setItem('cur_user', JSON.stringify(global.curUser));
            }

            if(Object.keys(global.observeUser).length > 0){
                Object.keys(global.observeUser).forEach(key=>{
                    global.observeUser[key]();
                })
            }

        }
    }

    routingRender = (route)=>{

        if(global.curUser && global.curUser.isRider() === true){
            switch(route){
                case 'rider_wallet':
                    return <RiderDashboard subPath={'wallet'}/>
                case 'rider_profile':
                    return <RiderDashboard subPath={'profile'}/>
                case 'rider_membership':
                    return <RiderDashboard subPath={'membership'}/>
                case 'rider_requests':
                    return <RiderDashboard subPath={'request'}/>

                case 'rider_dashboard':
                    return <RiderDashboard subPath={'profile'}/>

                case 'logout':
                    global.setUser(null);
                    return <Redirect to={'/'}/>

                case 'rider_register':

                    return <RiderRegister/>

                case 'update_profile':
                    return <UpdateProfile />


                default:
                    return <Redirect to={'/rider_dashboard'}/>
            }
        }if(global.curUser && global.curUser.isCarrier() === true){
            switch(route){
                case 'carrier_wallet':
                    return <CarrierDashboard subPath={'wallet'}/>
                case 'carrier_profile':
                    return <CarrierDashboard subPath={'profile'}/>
                case 'carrier_membership':
                    return <CarrierDashboard subPath={'membership'}/>
                case 'carrier_requests':
                    return <CarrierDashboard subPath={'request'}/>

                case 'carrier_dashboard':
                    return <CarrierDashboard subPath={'profile'}/>

                case 'logout':
                    global.setUser(null);
                    return <Redirect to={'/'}/>

                case 'carrier_register':

                    return <CarrierRegister/>

                case 'update_profile':
                    return <UpdateProfile />

                default:
                    return <Redirect to={'/carrier_dashboard'}/>
            }
        }else{
            // customer or guest mode
            switch(route){
                case '/':
                    return <Home initPath={"/"}></Home>
                // case 'rider_dashboard':
                //     return <RiderDashboard/>
                case 'bike':
                    return <BikeHome subPath={'/'}/>
                case 'bike_trips':
                    return <BikeDashboard subPath={'trips'} />
                case 'bike_trips_success':
                    return <BikeDashboard subPath={'bike_req_success'} />
                case 'bike_trips_failed':
                    return <BikeDashboard subPath={'bike_req_failed'} />
                case 'bike_wallet':
                    return <BikeDashboard subPath={'wallet'} />
                case 'bike_free_rides':
                    return <BikeDashboard subPath={'free_rides'} />
                case 'bike_profile':
                    return <BikeDashboard subPath={'profile'} />
                case 'login':
                    return <Home initPath={"login"}></Home>
                case 'logout':
                    global.setUser(null);
                    return <Redirect to={'/'}/>
                case 'register':
                    return <Home initPath={"register"}></Home>

                case 'rider_register':
                    return <RiderRegister></RiderRegister>
                case 'update_profile':
                    return <UpdateProfile />
                case 'errand':
                    return <ErrandHome subPath={'/'}/>
                case 'errand_request':
                    return <ErrandPostRequest />

                case 'errand_requests':
                    return <ErrandDashboard />

                case 'carrier_register':
                    return <CarrierRegister onClickHome={()=>{}} onSubmit={()=>{}}/>
                default:
                    return <Redirect to={"/"}></Redirect>

            }
        }


    }


    showNotification = (title, body, type, onClick)=>{
        store.addNotification({
            title: title,
            message: body,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "bounceIn"],
            animationOut: ["animated", "bounceOut"],
            dismiss: {
                duration: 15000,
                onScreen: true,
                pauseOnHover:true,
            },
            onRemoval: (id, removedBy) => {
                // removedBy : 'click', timeout
                console.log(id, removedBy)
                if(removedBy == 'click'){
                    // alert('click action' + notifyData.link)
                    onClick();
                }

            }
        });
    }

    componentDidMount() {
        this.setState({token:global.token})
        messaging
            .requestPermission()
            .then(async function() {
                const token = await messaging.getToken();
                // setToken(token);
                // this.setState({token:token})
                console.log('pushtoken->', token)
                global.pushToken = token
            })
            .catch(function(err) {
                console.log("Unable to get permission to notify.", err);
            });

        registerPushListener((notifyData)=>{
            let pushData = JSON.parse ( notifyData.data )
            console.log('In App ComponentDidMount Message=>', pushData )
            if ( pushData.push_type === 'accepted' ) {
                if( global.observe && global.observe.receiveAccept ){
                    global.observe.receiveAccept( true )
                }
            }
            // this.setState({token:global.token})
            let body = notifyData.body;
            // type: success danger info default warning

            store.addNotification({
                title: notifyData.title,
                message: body,
                type: notifyData.type,
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "bounceIn"],
                animationOut: ["animated", "bounceOut"],
                dismiss: {
                    duration: 15000,
                    onScreen: true,
                    pauseOnHover:true,
                },
                onRemoval: (id, removedBy) => {
                    // removedBy : 'click', timeout
                    console.log(id, removedBy)
                    if(removedBy == 'click'){
                        // alert('click action' + notifyData.link)
                        if(notifyData.link != null){
                            window.location.href = notifyData.link;
                        }
                    }

                }
            });
        });
    }

    render(){
        return (
            <BrowserRouter>
                <div className="App">
                    <Switch>

                        <Route exact path="/rider_wallet" render={()=>{
                            return this.routingRender('rider_wallet')
                        }} />
                        <Route exact path="/rider_profile" render={()=>{
                            return this.routingRender('rider_profile')
                        }} />
                        <Route exact path="/rider_membership" render={()=>{
                            return this.routingRender('rider_membership')
                        }} />
                        <Route exact path="/rider_requests" render={()=>{
                            return this.routingRender('rider_requests')
                        }} />
                        <Route exact path="/rider_dashboard" render={()=>{
                            return this.routingRender('rider_dashboard')
                        }} />

                        <Route exact path="/" render={()=>{
                            return this.routingRender('/')

                        }} />

                        <Route exact path="/rider_dashboard" render={()=>{
                            return this.routingRender('rider_dashboard')

                        }} />

                        <Route exact path="/bike" render={()=>{

                            return this.routingRender('bike')
                        }} />
                        <Route exact path="/bike_trips" render={()=>{
                            // return <BikeHome subPath={'/'}/>

                            return this.routingRender('bike_trips')

                        }} />
                        <Route exact path="/bike_trips_success" render={()=>{
                            // return <BikeHome subPath={'/'}/>

                            return this.routingRender('bike_trips_success')

                        }} />
                        <Route exact path="/bike_trips_failed" render={()=>{
                            // return <BikeHome subPath={'/'}/>

                            return this.routingRender('bike_trips_failed')

                        }} />

                        <Route exact path="/bike_wallet" render={()=>{
                            // return <BikeHome subPath={'/'}/>
                            return this.routingRender('bike_wallet')

                        }} />
                        <Route exact path="/bike_free_rides" render={()=>{
                            // return <BikeHome subPath={'/'}/>
                            return this.routingRender('bike_free_rides')
                        }} />
                        <Route exact path="/bike_profile" render={()=>{
                            // return <BikeHome subPath={'/'}/>
                            return this.routingRender('bike_profile')
                        }} />
                        {/*<Route exact path="/bike/:path" component={BikeSubPaths} />*/}

                        <Route exact path="/login" render={()=>{
                            return this.routingRender('login')
                        }} />
                        <Route exact path="/logout" render={()=>{
                            return this.routingRender('logout')
                        }} />
                        <Route exact path="/register" render={()=>{
                            return this.routingRender('register')
                        }} />

                        <Route exact path="/rider_register" render={()=>{
                            return this.routingRender('rider_register')
                        }} />

                        <Route exact path="/update_profile" render={()=>{
                            return this.routingRender('update_profile')
                        }} />

                        {/* Begin Errand */}

                        <Route exact path="/errand" render={()=>{

                            return this.routingRender('errand')
                        }} />
                        <Route exact path="/errand_request" render={()=>{

                            return this.routingRender('errand_request')
                        }} />

                        <Route exact path="/errand_requests" render={()=>{

                            return this.routingRender('errand_requests')
                        }} />

                        <Route exact path="/carrier_register" render={()=>{

                            return this.routingRender('carrier_register')
                        }} />


                        <Route exact path="/carrier_dashboard" render={()=>{
                            return this.routingRender('carrier_dashboard')

                        }} />
                        <Route exact path="/carrier_wallet" render={()=>{
                            return this.routingRender('carrier_wallet')
                        }} />
                        <Route exact path="/carrier_profile" render={()=>{
                            return this.routingRender('carrier_profile')
                        }} />
                        <Route exact path="/carrier_membership" render={()=>{
                            return this.routingRender('carrier_membership')
                        }} />
                        <Route exact path="/carrier_requests" render={()=>{
                            return this.routingRender('carrier_requests')
                        }} />
                        {/* End Errand */}

                        <Route render={()=>{
                            return <Redirect to={"/"}/>
                        }}/>

                    </Switch>
                    <ReactNotification />
                </div>
            </BrowserRouter>
        );
    }

}


export default App;
