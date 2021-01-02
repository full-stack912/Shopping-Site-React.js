import React  from 'react';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { Map, GoogleApiWrapper, Marker  } from 'google-maps-react';
//
// import Header from "../../header/header";
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import {Constants} from "../../rglobal/constants";
import {SubLoader} from "../../global/SubLoader";
import RestAPI from "../../global/RestAPI";

/**** https://www.npmjs.com/package/react-places-autocomplete ****/


class  ErrandOrderItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            isLoading : false,
        }
    }


    componentDidMount() {

    }
    onClick = ()=>{
        if(this.props.onClickItem){
            this.props.onClickItem(this.props.item);
        }
    }

    onCancelRequest = (item)=>{
        this.setState({ isLoading: true })
        RestAPI.cancelErrandReq(item.id).then(res=>{
            if( res.success == 1){
                if( this.props.onRemovedItem){
                    this.props.onRemovedItem(item);
                }

            }else{
                alert(res.msg)
            }
        }).catch(err=>{
            alert('Failed to cancel request please try again after a moment.')
        }).finally(()=>{
            this.setState({ isLoading : false})
        })
    }

    render(){
        const {key, item, onClickItem, isShowCustomer, isPast} = this.props;
        let isRider = global.curUser.isCarrier()
        let isCustomer = global.curUser.isCustomer();
        let avatar = require('../../assets/images/avatar_empty.png');
        let rider = item.rider;
        let customer = item.customer;

        let userName = '';
        let mainPhone = '';
        let email = '';
        let rating = 0;
        let reviewCount = 0;
        if( isCustomer && rider ){
            mainPhone = rider.phone_number;
            userName = Constants.ucFirst(rider.first_name) + ' ' + Constants.ucFirst(rider.last_name);
            email = rider.email;
            if( rider.photo){
                avatar = {uri:rider.photo};
            }
            rating = rider.review_avg || 0;
            reviewCount = rider.review_count;
        }
        if( isRider && customer ){
            mainPhone = customer.phone_number;
            userName = Constants.ucFirst(customer.first_name) + ' ' + Constants.ucFirst(customer.last_name);
            email = customer.email;
            if( customer.photo){
                avatar = {uri:customer.photo};
            }
            rating = customer.review_avg || 0;
            reviewCount = customer.review_count;
        }




        return (
            <>
                <div className="row mb-3 border-bottom" key={this.props.index} >
                    <div className='col-12 pb-2'>
                        <SubLoader width='w-100' isLoading={this.state.isLoading}/>
                    </div>
                    <div className="col-2 hidden-xs-down pr-0">

                        <div className='text-left font-10 text-less-dark'><span>#{item.id}</span></div>
                        <img src={avatar} className="w-50 rounded"/>
                    </div>
                    <div className="col-10 comment-detail text-left">
                        <div className="">
                            <span><h5>{userName}</h5></span>
                        </div>
                        <div className="rating ">
                            <StarRatings rating={rating} starRatedColor="#ff654d" numberOfStars={5} starDimension="15px" starSpacing="1px" />
                            <span className='pl-2'>{reviewCount} reviews</span>
                        </div>
                        <div className="">
                            <span><h5><span className="text-info">Phone: </span>{mainPhone}<span className="text-info ml-5">Email: </span>{email}</h5></span>
                        </div>

                        <div className="comment-post">
                            <div className={'row'}>
                                <div className={'col-sm-6'}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className={'text-primary font-13'}>Origin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className={'text-primary font-13'}><i className="fa fa-user fa-md  fa-info-circle"></i></td>
                                                <td className={'font-13'}>{Constants.ucFirst(item.sender_name)}</td>
                                            </tr>
                                            <tr>
                                                <td className={'text-primary font-13'}>
                                                    <a href={"tel://"+item.sender_phone} className="mr-3"><i className="fa fa-phone fa-md  fa-info-circle"></i></a>
                                                </td>
                                                <td className={'font-13'}>{item.sender_phone}</td>
                                            </tr>
                                            <tr>
                                                <td className={'text-primary font-13'}><i className="fa fa-map-marker fa-md  fa-info-circle"></i></td>
                                                <td className={'font-13'}>{item.address1}</td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>

                                <div className={'col-sm-6'}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className={'text-info font-13'}>Destination</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className={'text-info font-13'}><i className="fa fa-user fa-md  fa-info-circle"></i></td>
                                                <td className={'font-13'}>{Constants.ucFirst(item.receiver_name)}</td>
                                            </tr>
                                            <tr>
                                                <td className={'text-info font-13'}>
                                                    <a href={"tel://"+item.receiver_phone} className="mr-3"><i className="fa fa-phone fa-md  fa-info-circle"></i></a>
                                                </td>
                                                <td className={'font-13'}>{item.receiver_phone}</td>
                                            </tr>
                                            <tr>
                                                <td className={'text-info font-13'}><i className="fa fa-map-marker fa-md  fa-info-circle"></i></td>
                                                <td className={'font-13'}>{item.address2}</td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>
                            </div>

                            <div className={'row pt-1'}>
                                <div className={'col-sm-6'}>
                                    <span className={'text-primary'}>Parcel Description:</span>
                                    <p>{item.parcel_desc && item.parcel_desc!='null' ? item.parcel_desc : 'No Specify'}</p>
                                </div>
                                <div className={'col-sm-6'}>
                                    <span className={'text-info'}>Delivery Description:</span>
                                    <p>{item.delivery_desc && item.delivery_desc!='null' ? item.delivery_desc : 'No Specify'}</p>
                                </div>
                            </div>
                        </div>


                        {isShowCustomer && !isPast && <>
                            <button className="btn btn-outline btn-sm btn-success btn-pill btn-outline-1x m-1">Accept</button>
                            <button className="btn btn-outline btn-sm btn-primary btn-pill btn-outline-1x m-1">Cancel</button>
                        </>}

                        {isPast && <ul className="comment-action pt-1" >
                            <li>
                                <a href="#"
                                   data-toggle="modal"
                                   data-target="#reviewModal">
                                    <i className="icon-bubble"></i>&nbsp; Leave comment
                                </a>
                            </li>
                        </ul>}

                        <div className="comment-post text-right">
                            <span className="text-info">13 days ago</span>
                        </div>

                        <div style={{position:'absolute', right:'10px', top:'5px', color:'#ff654d', display: this.state.isLoading ? 'none' :'inline'}}>
                            <a href="#"
                               data-toggle="modal"
                               data-target="#detailModal"
                               className="mr-3" onClick={this.onClick}>
                                <i className="fa fa-search fa-lg  fa-info-circle"></i></a>
                            <a href={"tel://"+mainPhone} className="mr-3">
                                <i className="fa fa-phone fa-lg  fa-info-circle"></i></a>
                            {
                                (isPast || !isShowCustomer ) && item.status !== 'completed' && global.curUser.isCustomer()     ?
                                <a href="#" className="" data-toggle="modal" data-target={"#confirmModal"+this.props.id}>
                                    <i className="fa fa-trash fa-lg  fa-info-circle"></i>
                                </a> : null
                            }

                        </div>
                    </div>
                </div>

                <div id={"confirmModal"+this.props.id} className="modal fade"  data-backdrop="static" data-keyboard="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cancel Request</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row pb-3">
                                    <div className="col-md-12 text-center">
                                        <span><h5> Are you sure to { global.curUser.isCustomer() ? 'cancel' : 'reject'} this request?</h5></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <div className="d-flex flex-row justify-content-end">
                                            <button
                                                data-dismiss="modal"
                                                className="btn  btn-primary btn-main-fill-40  m-1">No
                                            </button>
                                            <button
                                                data-dismiss="modal"
                                                onClick={()=>{ this.onCancelRequest(item) }}
                                                className="btn  btn-danger btn-main-fill-40 m-1">Yes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }

}

ErrandOrderItem.propTypes = {
    key : PropTypes.string,
    id : PropTypes.string,
    index : PropTypes.number,
    data : PropTypes.object,
    // bounds : PropTypes.object.isRequired,
    onClickItem : PropTypes.func,
    // duration : PropTypes.string
}



//
ErrandOrderItem.defaultProps = {
    data: {

    },
}
export default ErrandOrderItem;
