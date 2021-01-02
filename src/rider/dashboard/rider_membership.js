import React from 'react';
import {Animated} from "react-animated-css";
import PropTypes from 'prop-types';

import {BikeProfile, UserProfile, } from "../../data/user_profile";
import Header from "../../header/header";
import {Constants} from "../../rglobal/constants";
import RestAPI from "../../global/RestAPI";
import {PulseLoader} from "react-spinners";

const Step_ProfileRegister = 1;
const Step_Plan = 2;
const Step_Finalize = 3;

const Plan_Beginner  = 100;
const Plan_Professional  = 101;
const Plan_Ultimate  = 102;

class  RiderMembership extends React.Component{

    constructor(props){
        super(props)
        this.state={
            membershipList:[],
            isLoading:false,
        };
    }


    componentDidMount() {

        this.membershipList = [];
        this.setState({isLoading:true})
        RestAPI.getAllMemberships((res, err)=>{
            this.setState({isLoading:false})
            if(err !== null){

                alert('Failed to get memberships. refresh and try again.')
                return
            }
            if(res.success === 1){
                this.setState({membershipList:res.data})
            }else{
                alert('Failed to get memberships. Try again after secs.')
            }
        })
    }

    renderMembershipView = ()=>{
        // console.log('Membership', global.curUser.memberShip)
        // return
        if(this.state.membershipList.length <= 0){
            return null
        }

        // return null
        return this.state.membershipList.map((item, i) =>{
            return (
                <div className="col-md-4" key={i}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pricing01">
                                <div className="" style={Constants.membershipColorList[i]}>
                                    <div className="pricing-title">
                                        {/*<i className="icon-screen-desktop"></i>*/}
                                        <h2>{item.title}</h2>
                                        <small>{item.sub_title}</small>
                                    </div>
                                    <div className="pricing-box">
                                        <span className="sup">{Constants.CURRENCY_CODE}</span><span className="price">{item.price}</span><span
                                        className="unit">Per Month</span>
                                    </div>
                                </div>
                                <div className="pricing-body">
                                    <ul>
                                        <li>
                                            {this.props.isRider ? 'Max Trip Distance' : 'Max Delivery Distance '}
                                             {item.max_trip_distance <= 0 ? 'Unlimited' : item.max_trip_distance+' miles'}
                                        </li>
                                        <li>
                                            {this.props.isRider ? 'Passengers In ' : 'Origin location is far away '}
                                            {item.passengers_distance <= 0 ? 'Unlimited' : item.passengers_distance+'miles'}</li>
                                        <li>{Constants.ucFirst(item.location_share_option) } Location Share</li>
                                    </ul>
                                </div>
                                <div className="pricing-footer">

                                    {global.curUser.memberShip != null ? (global.curUser.memberShip.id !== item.id ?
                                    <button className="btn btn-primary btn-pill" onClick={()=>{
                                        this.onSelectPlan(item)
                                    }}>Select</button> :
                                        <button className="btn btn-outline-success disabled btn-pill">Current Plan</button>) :
                                        <button className="btn btn-primary btn-pill" onClick={()=>{
                                            this.onSelectPlan(item)
                                        }}>Select</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    onSelectPlan = (plan)=>{
        this.setState({isLoading:true})
        RestAPI.setMembership(plan.id, global.curUser.staff_id, (res, err)=>{
            this.setState({isLoading:false})
            if(err !== null){
                alert('Failed to set membership, please try again.')
                return
            }

            if(res.success === 1){
                global.curUser.memberShip = plan;
                global.setUser(global.curUser)
                this.setState({
                    selPlan: plan,
                    // registerStep: Step_Finalize
                })
                if(this.props.onSelectPlan){
                    this.props.onSelectPlan()
                }
            }else{
                alert('Failed to set membership, try again.')
            }

            // console.log(global.curUser)
        })

    }
    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="panel panel-default">
                            <div className="panel-head">
                                <div className="panel-title">Membership</div>

                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    { this.state.isLoading ?
                                        <PulseLoader
                                            css=" display: block;margin: 0 auto;border-color: red;"
                                            sizeUnit={"px"}
                                            size={15}
                                            color={Constants.orangeColor}
                                            loading={this.state.isPickupLoading}
                                        />
                                        : this.renderMembershipView()}

                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        );
    }

}
RiderMembership.propTypes = {
    onSelectPlan : PropTypes.func,
    isRider: PropTypes.bool
}

export default RiderMembership;
