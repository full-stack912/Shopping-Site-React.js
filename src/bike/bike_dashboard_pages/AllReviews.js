import React from 'react';
// import { BrowserRouter as Router, Route, Link , Switch, Redirect} from "react-router-dom";
// import StarRatings from 'react-star-ratings';
// import Loader from 'react-loader-spinner'
import { SubLoader } from "../../global/SubLoader"
/*** refer this link for google maps  ->  https://www.npmjs.com/package/google-maps-react ****/

/****  refer of autocomplete https://developers.google.com/maps/documentation/javascript/places-autocomplete?utm_source=google&utm_medium=cpc&utm_campaign=FY18-Q2-global-demandgen-paidsearchonnetworkhouseads-cs-maps_contactsal_saf&utm_content=text-ad-none-none-DEV_c-CRE_374137922342-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+~+Places+%7C+BMM+%7C+Address+Autocomplete-KWID_43700046143621531-aud-563211326104:kwd-312924430504-userloc_2344&utm_term=KW_%2Baddress%20%2Bautocomplete-ST_%2Baddress+%2Bautocomplete&gclid=CjwKCAjwkqPrBRA3EiwAKdtwk8RPeEog73rdiOd0R8Uk-OKgmIJW3_vCHCJiaOqlgUinYdxLwh47qxoC4DwQAvD_BwE *****/
import PropTypes from 'prop-types';
// import { Animate } from 'react-move'
// import { easeExpOut } from 'd3-ease'
//
// import Header from "../../header/header";
//
// import Footer from "../../footer/footer";
// import {Animated} from "react-animated-css";
// import BikeMapModal from "../bike_map_modal";
//
// import {
//     BrowserView,
//     MobileView,
//     isBrowser,
//     isMobile
// } from "react-device-detect";
// import ReqItem from "../../data/req_item";
import {Constants} from "../../rglobal/constants";
// import {DriverProfile, UserProfile} from "../../data/user_profile";
import RestAPI from "../../global/RestAPI";
// import Login from "../../home/user/login";


class  AllReviews extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            isLoading: true,
            curPageNo : 0,
            reviewList : [],
            isShowEmpty : true,
        };

    }

    componentDidMount() {

        this.loadingReviews()
    }
    loadingReviews =()=>{

        this.setState({isLoading: true})
        RestAPI.getAllReviews(this.props.user_id, this.state.curPageNo, 10, (res, err)=>{
            this.setState({isLoading: false})
            if(err !== null){
                alert('Failed to load data, try again.')
                return
            }
            if(res.success === 1){
                let isShowEmpty = (res.data.reviews.length) <= 0

                this.setState({
                    reviewList: res.data.reviews,
                    isShowEmpty: isShowEmpty
                })

            }else{
                alert('Some issues are there, please try to load again.')
                return
            }
        })

    }

    render5Stars = (point)=>{
        if(point <= 0) {
            return (
                <div>
                    <i className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                    <i className="fa fa-star" style={{color:'#b9b9b9'}}></i>
                </div>
            )
        }

        let starList = [];
        [1,2,3,4,5].forEach((value, index1) => {
            if(point >= value){
                starList.push(<i className="fa fa-star" style={{color:'#ff654d'}}></i>)
            }else{
                starList.push(<i className="fa fa-star" style={{color:'#b9b9b9'}}></i>)
            }
        })

        return (
            <div>
                {starList}
            </div>
        )

    }

    reviewItem= (data, index) => {

        let senderAvatar = require('../../assets/images/empty_bike.png')
        let senderName = "";

        if(data.sender ){

            senderAvatar = data.sender.avatar
            senderName = Constants.ucFirst(data.sender.first_name)+' '+Constants.ucFirst(data.sender.last_name)
        }
        let reviewMark = 0;
        reviewMark = data.mark

        return (
            <li key={index}>
                <div className="row">
                    <div className="col-1 hidden-xs-down pr-0">
                        <img src={senderAvatar} alt="" className="fixed_avatar-50"/>
                    </div>

                    <div className="col-11 comment-detail text-left">
                        <div className="comment-meta d-flex flex-row justify-content-between">
                            <span>{senderName}</span>
                            <span className="text-right">{data.updated_human_diff}</span>
                        </div>
                        <div className="comment-post">
                            <div className="rating pt-1 d-flex flex-row align-items-center justify-content-start mb-2">
                                <div className="d-flex flex-row justify-content-start align-items-center" style={{width:80}}>
                                    {this.render5Stars(reviewMark)}
                                </div>
                            </div>
                            <div>
                                <i className="far fa-comment-alt fa-lg text-primary"></i>&nbsp;{data.comment}
                                <br/>
                            </div>
                        </div>

                    </div>
                </div>
            </li>
        );
    }

    showReviewList = (dataList)=>{
        // let list = [];
        console.log(dataList)
        let list = dataList.map((item, index)=>{
            return this.reviewItem(item, index)
            // list.push()
        });
        return list
    }

    render(){

        let riderName = Constants.ucFirst(this.props.rider.first_name) +' '+Constants.ucFirst(this.props.rider.last_name)

        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-wrapper">
                        <SubLoader isLoading={this.state.isLoading}/>
                        {!this.state.isLoading &&<>
                        <div className="panel-head">
                            <div className="d-flex flex-row justify-content-start align-items-center">

                                <div className="d-flex flex-row justify-content-between align-items-startr">
                                    <button
                                        className=""
                                        onClick={()=>{
                                            this.props.onClose()
                                        }}
                                    >
                                        <i className="fas fa-arrow-left fa-lg "></i>
                                    </button>
                                    <h4 className="ml-2 pt-2">All Reviews</h4>
                                </div>

                            </div>

                        </div>
                        <div className="panel-body">
                                <div className="panel-wrapper">

                                    <div className="ml-2 d-flex flex-row justify-content-start align-items-center">
                                        <img src={this.props.rider.avatar || require('../../assets/images/avatar_empty.png')}
                                             className="fixed_avatar-50 mr-2"/>
                                        <div >
                                        <span>
                                            <h4 className="mb-0">{riderName}</h4>
                                        </span>
                                            <div className="comment-post d-flex flex-row justify-content-between align-items-center">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="rating pt-1 d-flex flex-row align-items-center justify-content-start" style={{width:80}}>
                                                            {this.render5Stars(this.props.rider.reviews_mark)}
                                                        </div>
                                                    </div>
                                                    <div className="col" title="See All">
                                                        ({this.props.rider.reviews_count}reviews)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pl-5 pt-3">
                                        <ul className='comment-list'>
                                            {this.showReviewList(this.state.reviewList)}
                                        </ul>
                                    </div>

                                    {this.state.reviewList.length <= 0 && showReviewEmpty()}

                                </div>
                        </div>
                            </>}
                    </div>
                </div>
            </div>
        );
    }

}

AllReviews.propTypes = {
    user_id : PropTypes.number.isRequired,
    rider: PropTypes.object.isRequired,
    onClose : PropTypes.func.isRequired,
}

export function showReviewEmpty(){

    return (
        <div >
            <h4 className="text-center">Nothing reviews.</h4>
            <div className="text-center">
                <img src={require('../../assets/images/zenda_bike_emo.png')} width={200}/>
            </div>

        </div>
    );
}




export default AllReviews;
