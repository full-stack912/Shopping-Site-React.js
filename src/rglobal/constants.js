// import React from 'react';

const createHmac = require('create-hmac')

export const ZLog = (title, data)=>{
    console.log('**************************************************************************');
    console.log('*****************     '+  title +'    *****************');
    console.log('***************************************************************************');
    console.log(data);
    console.log('*************************** End of '+ title +'  *******************************')
};

export const GenderList = ['unknown', 'male', 'female'];

export const Constants={
    PayLogo:{
        VOD: require('../assets/apez/images/Voda.png'),
        MTN: require('../assets/apez/images/MTN.png'),
        TIG: require('../assets/apez/images/tigo.png'),
        AIR: require('../assets/apez/images/airtel.png')
    },

    COUNTRY_CODE:'+233',
    CURRENCY_CODE : 'GH₵',
    GOOGLE_API_KEY :  'AIzaSyCMClbEtIOY8iGfi9CMO30jGiOG1wTVDt4',
    
    HMAC_SECRET : "03d43a03828cf6a1e219ae97233a5019465168a9d83ad13f2ac69785c07e095f",
    HMAC_CLIENTKEY : "d163ffa271ed02faa60f4fa14e891507985e1b91",
    HMAC_CLINET_ID : 117,
    
    formatDate4Y2M2D: (dateStr)=>{
        let d = new Date(dateStr),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    
    number2FixedDecimalString:(number, fixed = 2)=>{
        
        let val = number;
        for(let i =0; i< fixed ; i++){
            val *= 10
        }
        
        val = parseInt(val)  ;
        let str = val.toString();
        return str.substr(0, str.length - fixed) + '.' + str.substr(-fixed)
    },
    
    timeDiff:(dateTime)=>{

        let dt = new Date(dateTime).getTime()
        let current = new Date().getTime()

        let msPerMinute = 60 * 1000;
        let msPerHour = msPerMinute * 60;
        let msPerDay = msPerHour * 24;
        let msPerMonth = msPerDay * 30;
        let msPerYear = msPerDay * 365;

        let elapsed = current - dt;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';
        }
        
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';
        }
        else {
            return Math.round(elapsed/msPerYear ) + ' years ago';
        }
    },

    ucFirst:(val)=> {
        return  val[0].toUpperCase() + val.slice(1);
    },

    calcMilePrice : (distanceMeters, price_per_mile, minPrice = null)=>{
        let miles = distanceMeters * 0.000621371;
        let price = price_per_mile * miles;
        if(minPrice != null){
            price = Math.max(minPrice, price)
        }
        return price.toFixed(2);
    },
    secsToHumanTime:(secs)=>{
      let hrs = Math.floor(secs / 3600)
      let remainSecs = secs-hrs * 3600
      let mins = Math.round(remainSecs / 60)
      // let sec = secs - mins*60
      let res = "";
      if(hrs > 0){
          res += hrs + 'hours '
      }
      if(mins > 0 ){
          res += mins+'mins '
      }
      return res
    },

    getMiles:(i)=>{
        let miles = i*0.000621371192;
        return miles.toFixed(0)
    },

    convMToKm:(x)=>{
        let km = x/1000
        return km.toFixed(2)
    },
    distance:(lat1, lon1, lat2, lon2, unit='M')=>{
        //    'M' is statute miles (default)
        //    'K' is kilometers
        //    'N' is nautical miles

        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            let radlat1 = Math.PI * lat1/180;
            let radlat2 = Math.PI * lat2/180;
            let theta = lon1-lon2;
            let radtheta = Math.PI * theta/180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    },

    getMeters:(i)=>{
        let meters = i*1609.344;
        return meters.toFixed(2)
    },
    getUrlQuery:()=>{
        let queryString = window.location.search.substr(1);
        let list = queryString.split('&');
        let q = {};
        list.forEach(x=>{
            let vals = x.split('=')
            q[vals[0]] = vals[1];
        })
        return q
    },
    
    generateHash:(jsonBody)=>
	{
            
            
            let keys = Object.keys(jsonBody).sort();
            
            console.log(keys);
            let json = {}
            keys.forEach(key=>{
                json[key] = jsonBody[key]
            })
            
            let paramString = "";
            keys.forEach( item =>{
				let pre5str = (jsonBody[item].toString()).substr(0,5) ;
				let val = jsonBody[item]
            	if( pre5str=='https' || pre5str == 'http:'){
            		val = encodeURI(val)
            		jsonBody[item] = val;
            	}

            	let temp = item + '=' + val;
            	if( paramString.length > 0){
            		temp = '&'+temp;
            	}
            	paramString += temp;
            })

            // let jsonString = JSON.stringify(json);
            
            var hmac = createHmac('sha256', Constants.HMAC_SECRET);
	        hmac.update(paramString)

	        // var hmac = forge.hmac.create();  
            // hmac.start('sha256', Constants.HMAC_SECRET);
            // hmac.update(paramString);  
            var hashText = hmac.digest('hex');
            
            
            return "HMAC " + Constants.HMAC_CLIENTKEY + ':' + hashText;
            
        } ,

    // getGlobalPhoneNumber : (phone)=>{
    //     if(!phone || phone.length < 0){
    //         return null;
    //     }
    //     if(phone.substr(0, 4) == '+233'){
    //         return phone;
    //     }else{
    //
    //     }
    // },
    

    GhanaBounds:[
        {lat:5.585652, lng:-0.297142},
        {lat:10.954413, lng:-2.780052},
        {lat:11.07306, lng:-0.011497},
        {lat:5.115300, lng:-3.087669},
        {lat:6.134529, lng:-1.198967},
    ],
    membershipColorList : [
        {border:'1px solid #aaa'},
        {border:'1px solid #31ee50'},
        {border:'1px solid #ff654d'}

    ],
    PaymentMethod  : {
        ZWallet: 1,
        CreditCard: 2,
        Airtel:'AIR',
        MTN:'MTN',
        TIGO:'TIG',
        VODA:'VOD'

    },

    orangeColor:'#ff654d',
    darkBlueColor: '#060542',
    whiteColor : '#fff',

    COLORS:{
        gray: '#aaa'
    }



};

