import React  from 'react';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { Map, GoogleApiWrapper, Marker  } from 'google-maps-react';

// import Header from "../header/header";
import PropTypes from 'prop-types';

// import Home from "../home/home";
import {Constants} from "../rglobal/constants";

/**** https://www.npmjs.com/package/react-places-autocomplete ****/


class  BikeItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {

        }
    }


    componentDidMount() {

    }



    render(){
        const {data, onClickItem} = this.props;

        return (
            <tr onClick={onClickItem}>
                <td>
                    <img src={data.bike_photo} width={'50px'}  alt=""/>
                </td>
                <td>
                    <div className={'row'}>
                        <div className={'col'}>
                            <strong>{data.bike_name}</strong>
                        </div>
                   </div>
                    <div className={'row'}>
                        <div className={'col'}>
                            in {data.distance} miles
                        </div>
                    </div>
                </td>
                <td>{this.props.durationSecs !== null &&  Constants.CURRENCY_CODE + ' '+(Constants.calcMilePrice(this.props.distance, data.price_per_mile))} <br/>   {this.props.durationSecs !== null && 'for '+this.props.duration}</td>
                <td> <i class="fa fa-chevron-right fa-1x" style={{alignSelf:'center'}}/> </td>
            </tr>
        );
    }

}

BikeItem.propTypes = {
    data : PropTypes.object.isRequired,
    duration: PropTypes.string,
    distance: PropTypes.number,
    durationSecs: PropTypes.number,
    // bounds : PropTypes.object.isRequired,
    onClickItem : PropTypes.func.isRequired,
    // duration : PropTypes.string
}

//
BikeItem.defaultProps = {
    data: {
        img: require('../assets/images/moto1.png'),
        bike_name: 'Bike #4',
        price: '34.12 / hr',
        color: 'Black',
        seats: 2,
        base_fare : 12,
        min_fare: 25,
        cancel_fee: 2,
        per_km: 3,
        description: 'This is templated description and will be replaced with real description in live version.'

    },
}
export default BikeItem;
