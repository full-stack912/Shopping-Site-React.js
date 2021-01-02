// import React from 'react';
import { Constants } from '../rglobal/constants';

// import Geocoder from 'react-native-geocoding';
// import Constants from "./Constants";

// const hostURL = 'http://localhost/';

const hostURL = 'https://admin.zendasgh.com/api';

const requestCall = (subUrl, method, body, headers, callBack, isFullUrl=false)=>{

    // Origin: http://toto.example

    let reqParams = {
        method:method,
    }
    if(headers !== null){
        reqParams.headers = headers
    }
    if(body !== null){
        reqParams.body = body
    }
    let fullUrl = isFullUrl ? subUrl : hostURL + subUrl;

    fetch(fullUrl, reqParams)
    .then(function(response) {
        console.log(response)
        return response.json()
    }).then(function(data) {
        console.log(data)
        callBack(data, null)
    }).catch(function (err) {
        console.log('err', err)
        callBack(null, err)
    }).then(function(){
        console.log('final callback')
    });

}

const GetBearerToken = (token)=>{
    return  {
        'Authorization':'Bearer '+token
    }
}

const GetHashHeader = (hash)=>{
    
    return  {
        'Authorization': hash,
        "Content-Type": "application/json"
    }
}



const RestAPI = {

    ErrCode:{
        EmailExist:101,
        InvalidParams:102,
        PackageInvalid:103,
        RegisterFailed:104,
    },

    fullUrl:(url)=>{
        return hostURL + url;
    },
    
    getIPAddress:()=>{
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        return new Promise((resolve, reject)=>{
            fetch("http://ip-api.com/json", requestOptions)
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => reject(error));
        })

    },



    geoCodingFromLocationIQ(lat, lon, callBack){
        
        // let myTokenInLocationIq = 'd3c27446a8e7b0'; // from zyxm gmail account https://my.locationiq.com/
        let myTokenInLocationIq = 'd44ee62beac66a'; 
        
        let url = 'https://us1.locationiq.com/v1/reverse.php?key='+myTokenInLocationIq+'&lat='+lat+'&lon='+lon+'&format=json';

        fetch(url)
            .then(function(res) {

                try{
                    let json = res.json();
                    return json;
                }catch (e) {
                    callBack(null, 'Failed to parse data.'  );
                }

            })
            .then(function(resJson) {

                callBack(resJson ,null );

            }, error=>{

                callBack(null, error);
            })
    },
    
    getFeeData:(region_name)=>{

        let body = new FormData();
        body.append('region_name', region_name)
        return new Promise((resolve, reject)=>{
            requestCall('/getFeeData', 'POST', body, null, (res, err)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
        
    },
    
    login(email, pwd, callBack){
        
        const data = new FormData();
        data.append('email', email);
        data.append('password', pwd);
        data.append('push_user_id', global.pushToken);

        requestCall('/login', 'POST', data, null, callBack)
    },

    logOut(userId, callBack){
        const data = new FormData();
        data.append('id', userId);
        requestCall('/logout', 'POST', data, null, callBack)

    },

    signUp:(email, password, gender, first_name, last_name, phone_number, deviceToken,  callBack)=>{

        let deviceType = "web"

        const data = new FormData();
        data.append('email', email);
        data.append('password', password);
        data.append('gender', gender);
        data.append('first_name', first_name);
        data.append('last_name', last_name);
        data.append('phone_number', phone_number);
        data.append('push_user_id', deviceToken);
        data.append('role_id', 2);
        // data.append('userType', userType);
        data.append('deviceType', deviceType);

        requestCall('/register', 'POST', data, null, callBack)

    },

    socialLogin:(email, socialID, last_name, first_name, social_image, push_user_id,  callBack)=>{

        const data = new FormData();
        data.append('email', email);
        data.append('password', socialID);
        data.append('first_name', first_name ? first_name : '' );
        data.append('last_name', last_name ?  last_name : '');
        data.append('push_user_id', push_user_id);
        data.append('social_image', social_image ? social_image :  '');

        requestCall('/registerSocialLogin', 'post', data, null, callBack)


    },

    getPackagesInCategory:(category_id, callback)=>{

        let obj = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        fetch(hostURL+ '/packages/category/'+category_id, obj)
            .then(function(res) {

                try{
                    let json = res.json();
                    return json;
                }catch (e) {
                    callback('Failed to parse data.' , null);
                }

            })
            .then(function(resJson) {
                if(resJson.success ===1){
                    callback(null, resJson.data); // return array of packs
                }else{
                    callback('Failed to get package list, try again.', null);
                }
            }, error=>{

                callback(error, null);
            })
    },

    getAllMemberships:( callBack)=>{

        requestCall('/memberships', 'GET', null, null, callBack)
    },
    getAllRegions:( callBack)=>{
        requestCall('/getRegions', 'GET', null, null, callBack)
    },
    signUpRider:(staffData, pwd, push_user_id, callBack)=>{

        const data = new FormData();
        data.append('email', staffData.email);
        data.append('password', pwd);
        data.append('first_name', staffData.firstName);
        data.append('gender', staffData.gender);
        data.append('last_name', staffData.lastName);
        data.append('push_user_id', push_user_id);
        data.append('phone_number', staffData.phone);

        data.append('role_id', 3); // 3 : rider
        data.append('address', staffData.address);

        data.append('bike_name', staffData.bikeProfile.name);
        data.append('bike_license', staffData.bikeProfile.license);
        data.append('bike_reg_number', staffData.bikeProfile.reg_number);
        data.append('bike_insurance', staffData.bikeProfile.insurance);

        data.append('bike_report', staffData.bikeProfile.policeReport);

        data.append('photo_id', staffData.avatar)
        data.append('bike_photo', staffData.bikeProfile.photo)

        // data.append('min_price', staffData.bikeProfile.min_price)
        // data.append('price_per_mile', staffData.bikeProfile.price_per_mile)

        console.log('params for signup register:', data);

        requestCall('/register', 'POST', data, null, callBack)

    },

    updateProfile:(staffData, callBack)=>{

        const data = new FormData();
        data.append('email', staffData.email);
        data.append('first_name', staffData.firstName);

        data.append('last_name', staffData.lastName);
        data.append('gender', staffData.gender);
        // data.append('push_user_id', push_user_id);
        data.append('phone_number', staffData.phone);

        data.append('role_id', global.curUser.role); // 3 : rider
        data.append('address', staffData.address);

        data.append('bike_name', staffData.bikeProfile.name);
        data.append('bike_license', staffData.bikeProfile.license);
        data.append('bike_reg_number', staffData.bikeProfile.reg_number);
        data.append('bike_insurance', staffData.bikeProfile.insurance);

        data.append('bike_report', staffData.bikeProfile.policeReport);
        // data.append('price_per_mile', staffData.bikeProfile.price_per_mile);
        // data.append('min_price', staffData.bikeProfile.min_price);

        if(staffData.avatar != null){
            data.append('photo_id', staffData.avatar)
        }

        if(staffData.bikeProfile.photo != null){
            data.append('bike_photo', staffData.bikeProfile.photo)
        }

        console.log('params for signup register:', data);

        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }

        requestCall('/updateUserProfile', 'POST', data, headers, callBack)

    },

    updateCarrierProfile:(staffData, callBack)=>{
    

        const data = new FormData();
        data.append('role_id', global.curUser.role); // 3 : rider
        data.append('carrier_id', global.curUser.carrierProfile.carrier_id); // 3 : rider
        data.append('email', staffData.email);
        data.append('gender', staffData.gender);
        data.append('first_name', staffData.first_name);

        data.append('last_name', staffData.last_name);
        // data.append('push_user_id', push_user_id);
        data.append('phone_number', staffData.phone_number);
        data.append('address', staffData.address);

        data.append('is_free', staffData.is_free);
        data.append('max_width', staffData.max_width);
        data.append('max_height', staffData.max_height);
        data.append('max_depth', staffData.max_depth);
        data.append('max_weight', staffData.max_weight);
        data.append('grade', staffData.grade);
        data.append('delay', staffData.delay);

        data.append('avatar', staffData.avatar);
        data.append('price_per_mile', staffData.price_per_mile);
        data.append('min_price', staffData.min_price);

        console.log('params for updateCarrier register:', staffData.first_name);

        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }

        requestCall('/updateCarrier', 'POST', data, headers, callBack)

    },

    setMembership:(membershipId, staffId, callBack)=>{
        const data = new FormData();
        data.append('membership_id', membershipId);
        data.append('staff_id', staffId);
        console.log('params for signup register:', data);
        requestCall('/setMembership', 'POST', data, null, callBack)
    },

    updatePickupAvailable:(staff_id , is_pickup, callBack)=>{
        const data = new FormData();
        data.append('staff_id', staff_id);
        data.append('is_pickup', is_pickup);
        requestCall('/updatePickupAvailable', 'POST', data, null, callBack)
    },

    updateStaffLocation:(staff_id, lat,lon, address, callBack)=>{
        if(lat == null || lon == null || staff_id == null){
            console.log('location data is invalid for staff location update.');
            return
        }
        const data = new FormData();
        data.append('staff_id', staff_id);
        data.append('lat', lat);
        data.append('lon', lon);
        data.append('address', address);
        requestCall('/updateLocation', 'POST', data, null, callBack)

    },

    findNearByRiders:(lat, lng, is_carrier, callBack)=>{

        const data = new FormData();
        // data.append('user_id', user_id);
        data.append('lat', lat);
        data.append('lng', lng);
        data.append('is_carrier', is_carrier ? is_carrier : 0);
        requestCall('/findNearByRiders', 'POST', data, null, callBack)
    },

    postRequest:(reqData , callBack)=>{

        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }

        const data = new FormData();
        Object.keys(reqData).forEach(x=>{
            console.log(x, reqData[x])
            data.append(x, reqData[x])
        })
        
        requestCall('/postRequest', 'POST', data, headers, callBack)
    },

    acceptRequest:(req_id , callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('req_id', req_id);
        requestCall('/acceptRequest', 'POST', data, headers, callBack)
    },

    rejectRequest:(req_id , callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('req_id', req_id);
        requestCall('/rejectRequest', 'POST', data, headers, callBack)
    },
    canceledRequest:(req_id , callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('req_id', req_id);
        requestCall('/canceledRequest', 'POST', data, headers, callBack)
    },
    completeRequest:(req_id , callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('req_id', req_id);
        requestCall('/completeRequest', 'POST', data, headers, callBack)
    },

    getCustomerRequests:(limit, pageno, callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('limit', limit);
        data.append('pageno', pageno);
        requestCall('/allCustomerRequest', 'POST', data, headers, callBack)
    },

    getRiderRequests:(limit, pageno, callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('limit', limit);
        data.append('pageno', pageno);
        requestCall('/allStaffRequest', 'POST', data, headers, callBack)
    },

    leaveReview:(req_id, comment, mark, sender_role_id, callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('req_id', req_id);
        data.append('comment', comment);
        data.append('mark', mark);
        data.append('sender_role_id', sender_role_id);

        requestCall('/leaveReview', 'POST', data, headers, callBack)
    },
    updateReview:(req_id, comment, mark, callBack)=>{
        let headers = {
            'Authorization':'Bearer '+global.curUser.token
        }
        const data = new FormData();
        data.append('req_id', req_id);
        data.append('comment', comment);
        data.append('mark', mark);

        requestCall('/updateReview', 'POST', data, headers, callBack)
    },
    getAllReviews:(user_id, pageno, limit, callBack)=>{
        const data = new FormData();
        data.append('user_id', user_id);
        data.append('pageno', pageno);
        data.append('limit', limit);

        requestCall('/getAllReviews', 'POST', data, null, callBack)
    }

     ,
    getShopCarrierData:(ps_carrier_id, callBack)=>{
        const data = new FormData();
        data.append('ps_carrier_id', ps_carrier_id);

        requestCall('/getCarrierData', 'post',data, null, callBack)
    },

    registerCarrier:(carrierData, callBack  )=>{
        // max_width, max_height, max_depth,max_weight,  grade, delay,  first_name, last_name, email, phone_number, password, address, avatar,push_user_id, is_free=0,min_price=null, price_per_mile=null, lat=null, lon=null
        const data = new FormData();
        data.append('max_width', carrierData.max_width);
        data.append('max_height', carrierData.max_height);
        data.append('max_depth', carrierData.max_depth);
        data.append('max_weight', carrierData.max_weight);
        data.append('grade', carrierData.grade);
        data.append('delay', carrierData.delay);

        data.append('first_name', carrierData.first_name);
        data.append('last_name', carrierData.last_name);
        data.append('email', carrierData.email);
        data.append('gender', carrierData.gender);
        data.append('phone_number', carrierData.phone_number);
        data.append('password', carrierData.password);
        data.append('address', carrierData.address);
        data.append('avatar', carrierData.avatar);
        data.append('push_user_id', carrierData.push_user_id);
        data.append('is_free', carrierData.is_free);
        data.append('min_price', carrierData.min_price);
        data.append('price_per_mile', carrierData.price_per_mile);
        data.append('push_user_id', carrierData.push_user_id);
        data.append('pickup_available', carrierData.pickup_available);

        data.append('lat', carrierData.lat);
        data.append('lon', carrierData.lon);

        requestCall('/registerCarrier', 'post',data, null, callBack)

    },

    postTempBikeReq:(data, callBack)=>{

        const body = new FormData();
        body.append('user_id', data.user_id);
        body.append('address1', data.address1);
        body.append('lat1', data.lat1);
        body.append('lng1', data.lng1);
        body.append('address2', data.address2);
        body.append('lat2', data.lat2);
        body.append('lng2', data.lng2);
        body.append('user_address', data.user_address);
        body.append('region_name', data.region_name);
        body.append('user_lat', data.user_lat);
        body.append('user_lng', data.user_lng);

        body.append('trx_platform', data.trx_platform);
        body.append('trip_distance', data.trip_distance);
        body.append('trip_duration_secs', data.trip_duration_secs);

        console.log('temp req form data->', data)

        requestCall('/postTempBikeReq', 'post', body, null, callBack)

    },
    acceptBikeReqByRider:(data, callBack)=>{
      
        
        const body = new FormData();
        body.append('rider_id', data.rider_id);
        body.append('temp_req_id', data.temp_req_id);
        body.append('currency_code', data.currency_code);
        body.append('amount', data.amount);

        body.append('is_errand', data.is_errand);

        console.log('accept temp req form data->', data)

        requestCall('/acceptReqByRider', 'post', body, null, callBack)

    },

    // https://xchange.korbaweb.com/api/v1.0/collection_network_options/
    korba_CollectNetworkOptions : ()=>{

        let json = {client_id : Constants.HMAC_CLINET_ID};
        let hash =Constants.generateHash(json);

        var myHeaders = new Headers();
        // myHeaders.append("Authorization", "HMAC d163ffa271ed02faa60f4fa14e891507985e1b91:f720b10eb10ed30ba0eac84c7c80a1589c28177fb58b4c38f42f2ec16218a5cc");
        myHeaders.append("Authorization", hash);
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({"client_id":117});

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        
        return new Promise((resolve, reject)=>{
            fetch("https://xchange.korbaweb.com/api/v1.0/collection_network_options/", requestOptions)
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(error => reject(error));
        })        
    },
    

    createTransaction:(reqData)=>{
        
        
        const data = new FormData();
        Object.keys(reqData).forEach(x=>{
            console.log(x, reqData[x])
            data.append(x, reqData[x])
        })
        
        return new Promise((resolve, reject)=>{
            requestCall('/createTransaction', 'POST', data, GetBearerToken(global.curUser.token), (res, err)=>{
                if( err ){
                    reject(err)
                }
                resolve(res);
            })
        })
        
    },
    korba_Collect : (json)=>{
        
        // let json = {client_id : Constants.HMAC_CLINET_ID};
        let hash =Constants.generateHash(json);

        let myHeaders = new Headers();        
        
        myHeaders.append("Authorization", hash);
        myHeaders.append("Content-Type", "application/json");
        console.log('HMAC CODE Collect API:' , hash)
        
        let raw = JSON.stringify(json);
        
        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch("https://xchange.korbaweb.com/api/v1.0/collect/", requestOptions)
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(error => reject(error));
        })
        
    },

    removeFailedTrx:(id)=>{
        const data = new FormData();
        data.append('id', id)
        
        return new Promise((resolve, reject)=>{
            requestCall('/removeFailedTrx', 'POST', data, GetBearerToken(global.curUser.token), (res, err)=>{
                if( err ){
                    reject(err)
                }
                resolve(res);
            })
        })
    },

    cancelTempReq : (temp_id)=>{
        const data = new FormData();
        data.append('temp_id', temp_id);

        return new Promise((resolve, reject)=>{
            requestCall('/cancelTempReq', 'POST', data, GetBearerToken(global.curUser.token), (res, err)=>{
                if( err ){
                    reject(err)
                }
                resolve(res);
            })
        })

    },

    removeErrandReqByFailedPay:(req_id)=>{

        const data = new FormData();
        data.append('req_id', req_id);

        return new Promise((resolve, reject)=>{
            requestCall('/removeErrandReqByFailedPay', 'POST', data, GetBearerToken(global.curUser.token), (res, err)=>{
                if( err ){
                    reject(err)
                }
                resolve(res);
            })
        })
    },

    getErrandList:(page)=>{
        let subLink = '/errandReqList';
        if( page > 1 ){
            subLink += '?page=' + page;
        }
        return new Promise((resolve, reject)=>{
            requestCall(subLink, 'POST', null, GetBearerToken(global.curUser.token), (res, err)=>{
                if( err ){
                    reject(err)
                }
                resolve(res);
            })
        })
    },

    cancelErrandReq : (req_id)=>{
        let data = new FormData();
        data.append('req_id', req_id);
        return new Promise((resolve, reject)=>{
            requestCall('/cancelErrandReq', 'POST', data, GetBearerToken(global.curUser.token), (res, err)=>{
                if( err ){
                    reject(err)
                }
                resolve(res);
            })
        })
    }





}

export default RestAPI;


