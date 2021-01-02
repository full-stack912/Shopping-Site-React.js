

export class UserProfile{
    // role_id : 1 Admin
    // role_id : 2 customer
    // role_id : 3 staff : Rider
    // role_id : 4 carrier

    static ROLE_CUSTOMER = 2;
    static ROLE_RIDER = 3;
    static ROLE_CARRIER = 4; // seller

    user_id = null;
    staff_id = null;

    userName = '';
    firstName='';
    lastName='';
    gender = '';
    email = '';
    token = '';
    role = 1; // driver : 2, customer : 1,
    dob = null;
    phone = '';
    avatar = '';
    address = '';

    bike_number = '';

    memberShip={};
    is_active = 1;
    pickup_available = 1;

    bikeProfile = {};

    carrierProfile = {};

    isRider = ()=>{
        // console.log('isRider',global.curUser)
        if( this.role == UserProfile.ROLE_RIDER){
            return this.carrierProfile == null || this.carrierProfile.carrier_id==null
        }else{
            return false
        }
    }
    isCarrier = ()=>{
        // console.log('isCarrier',global.curUser)
        if(this.role == UserProfile.ROLE_RIDER){

            return this.carrierProfile != null && this.carrierProfile.carrier_id > 0
        }else{
            return false
        }
    }

    isCustomer = ()=>{
        return this.role == UserProfile.ROLE_CUSTOMER
    }

    constructor(data){
        if(data !== null){

            if(data.user_id != null){
                this.user_id = data.user_id;
            }
            if(data.staff_id != null){
                this.staff_id = data.staff_id;
            }
            if(data.is_active != null){
                this.is_active = data.is_active
            }

            this.userName = data.userName || "";
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.gender = data.gender;
            this.phone = data.phone;
            this.address = data.address;
            this.email = data.email || "";
            this.token = data.token || "";
            this.role = data.role || UserProfile.ROLE_CUSTOMER;  //  driver : 2, customer : 1,
            // this.dob = new Date(data.dob) || null;
            this.avatar = data.avatar || "";

            this.pickup_available = data.pickup_available;

            this.bike_number = data.bike_number || "";
            this.bikeProfile = data.bikeProfile  || {};
            this.carrierProfile = data.carrierProfile || null;
            this.memberShip = data.memberShip
        }
    }
}

export class BikeProfile {

    photo = '';
    name = '';
    license = '';
    reg_number = '';
    policeReport = '';
    insurance = '';
    price_per_mile = 0.0;
    min_price = 0.0;

    constructor(data){
        if(data !== null){
            this.photo = data.photo || "";
            this.name = data.name || "";
            this.license = data.license || "";
            this.reg_number = data.reg_number || "";
            this.policeReport = data.policeReport || "";
            this.insurance = data.insurance || "";
            this.price_per_mile = data.price_per_mile;
            this.min_price = data.min_price;
        }
    }
}

export class DriverProfile{

    userName = '';
    email = '';
    token = '';
    role = 1;
    dob = null;
    phone = '';
    avatar = '';
    bike_number = '';

    location={
        addr : '',
        position:{
            lat:null,
            lng: null,
        }
    };

    constructor(data){
        if(data !== null){
            this.userName = data.userName || "";
            this.email = data.email || "";
            this.token = data.token || "";
            this.role = data.userName || 2;  // 1- admin, 2-custom,
            this.dob = data.dob || null;
            this.avatar = data.avatar || "";
            this.bike_number = data.bike_number
            this.phone = data.phone
        }

    }

}

export class Carrier{

    userName = '';
    email = '';
    token = '';
    role = 1;
    dob = null;
    phone = '';
    avatar = '';

    location={
        addr : '',
        position:{
            lat:null,
            lng: null,
        }
    };

    comments = [];
    review = null;


    constructor(data){
        if(data !== null){
            this.userName = data.userName || "";

            this.email = data.email || "";
            this.token = data.token || "";
            this.role = data.userName || 2;  // 1- admin, 2-custom,
            this.dob = data.dob || null;
            this.avatar = data.avatar || "";

            this.phone = data.phone;
            this.location = data.location;
            this.comments = data.comments;
            this.review = data.review;

        }

    }

}
