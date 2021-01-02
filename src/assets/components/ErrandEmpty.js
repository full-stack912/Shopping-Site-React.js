import React from 'react';

// import {Constants} from "../../rglobal/constants";
// import StarRatings from "react-star-ratings";
import {Link} from "react-router-dom";

// const STEP_REQINF = 1;
// const STEP_CHOOSERIDER = 2;
// const STEP_CONFIRM = 3;
// const STEP_CHECKOUT = 4;
// const DefaultAvatar = require('../../assets/images/avatar_empty.png')

const ErrandEmpty = ()=>{

    let msg = global.curUser.isCarrier() ? 'Nothing requests..' : 'Looks like you haven\'t taken a errand service yet.'

    return (
        <div >
            <h4 className="text-center"><small>{msg}</small></h4>
            <div className="text-center">
                <img src={require('../../assets/images/zenda_bike_emo.png')} alt={'Empty'} width={200}/>
            </div>
            <br/><br/>
            {
                global.curUser.isCustomer() && <h5 className="text-center">Ask help for errand service.<small></small></h5>
            }

            {
                global.curUser.isCustomer() &&
                <div className="text-center">
                    <Link className="btn btn-primary btn-pill  " to={'/errand_request'}>Request a Errand</Link>
                </div>
            }


        </div>
    );
}

export default ErrandEmpty;