// import UserProfile from "./user_profile";

export default class ErrandReqItem{

    customer = {}; // UserProfile
    carrier = {}; // CarrierProfile
    startLocation = {
        addr : '',
        position:{
            lat:null,
            lng: null,
        }
    };
    endLocation = {
        addr : '',
        position:{
            lat:null,
            lng: null,
        }
    };

    sender = {};
    receiver = {}

    review = 0.0;
    comment = '';

    createdAt = '';


    customerLocation = {
        lat:null,
        lng:null
    }

    constructor(data){
        if(data !== null){

            this.customer = data.customer;
            this.carrier = data.carrier; // DriverProfile

            this.startLocation = data.startLocation;
            this.endLocation = data.endLocation;

            this.createdAt = data.createdAt;

            this.sender = data.sender;
            this.receiver = data.receiver;

            this.review = data.review;
            this.comment = data.comment;

        }

    }

}
