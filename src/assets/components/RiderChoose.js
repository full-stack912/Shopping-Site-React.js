import React from 'react';

import {Constants} from "../../rglobal/constants";
import StarRatings from "react-star-ratings";

// const STEP_REQINF = 1;
const STEP_CHOOSERIDER = 2;
// const STEP_CONFIRM = 3;
// const STEP_CHECKOUT = 4;
const DefaultAvatar = require('../../assets/images/avatar_empty.png')


const RiderChoose = props =>{

    const {onClick, stepOfRequest, carriers, selectedItem, selPickLocation, selDestLocation} = props
    if(selPickLocation == null || selDestLocation == null){
        return null
    }

    return (
        <div className="row pt-4" style={{display: stepOfRequest === STEP_CHOOSERIDER ? '' : 'none'}}>
            {
                carriers.map((item, index)=>{
                    let isSelected = selectedItem != null && selectedItem.carrier_id === item.carrier_id

                    let distance = Constants.distance(selPickLocation.lat, selPickLocation.lng,  selDestLocation.lat, selDestLocation.lng)

                    let price = item.price_per_mile * distance;
                    console.log('Distance and price per mile, price',distance, item.price_per_mile, price)
                    price = Math.round(Math.max(price , item.min_price)*100)/100

                    return <div key={index} className="col-sm-3 col-md-3 col-lg-3">
                        <div className="team-block-05">
                            <div className="team-img">
                                <img src={item.user.avatar ? item.user.avatar: DefaultAvatar} alt=""/>
                            </div>
                            <div className="team-container">
                                <div className="team-details">
                                    <h3><a className={isSelected ? "text-warning":"text-white"}>{Constants.ucFirst(item.user.first_name)} {Constants.ucFirst(item.user.last_name)}</a></h3>
                                    <p>{item.name} member</p>
                                    <div className="mt-1">
                                        <StarRatings
                                            rating={4}
                                            starRatedColor="#ff654d"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="20px"
                                            starSpacing="1px"
                                        />
                                    </div>
                                </div>
                                <div  style={{position:'absolute', top:'20px', right:'10px', color:'#fff' }}>
                                    <a href="tel://{item.user.phone_number}" className="mr-2 "><i className={isSelected ? "fa fa-phone fa-lg text-warning" : "fa fa-phone fa-lg"}></i></a>
                                </div>
                                <div className="content">
                                    <div><i className="fa fa-map-marker fa-sm"></i>:&nbsp;{item.address}</div>
                                    {/*<div>Grade:&nbsp;{item.grade}</div>*/}
                                    <div>Price:&nbsp;{Constants.CURRENCY_CODE}{price}</div>
                                    <div>Delay:&nbsp;{item.delay}</div>
                                    <div>Distance:&nbsp;{item.distance} {item.unit}</div>
                                </div>

                                <div
                                    // className="team-social"
                                    style={{position:'absolute', top:'40px', right:'10px', color:'#fff' }}>
                                    <button
                                        className="btn btn-outline btn-sm btn-success btn-pill btn-outline-1x m-1"
                                        onClick={()=>{
                                            if(onClick){
                                                onClick(item)
                                            }
                                        }}

                                    >{isSelected ? 'Current':'Select'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default RiderChoose;