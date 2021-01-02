import UserProfile from "./user_profile";

export default class ReqItem{

    customer = {}; // UserProfile
    driver = {}; // DriverProfile
    start_addr = '';
    end_addr = '';
    start_location = {
      lat:null,
      lng:null,
    };
    end_locationn = {
        lat:null,
        lng:null,
    };
    distance = 0.0;
    duration = '';
    bike_img = '';
    created_at = null;
    price = 0.0;
    bike_name = '';
    bike_color = '';
    review = 0.0;
    comment = '';

    customerLocation = {
        lat:null,
        lng:null
    }

    constructor(data){
        if(data !== null){

            this.customer = data.customer;
            this.driver = data.driver; // DriverProfile
            this.start_addr = data.start_addr;
            this.end_addr = data.end_addr;
            this.distance = data.distance;
            this.duration = data.duration;
            this.bike_img = data.bike_img;
            this.created_at = data.created_at;
            this.price = data.price;
            this.bike_name = data.bike_name;
            this.bike_color = data.bike_color;
            this.review = data.review;
            this.comment = data.comment;
            this.customerLocation = data.customerLocation

            this.start_location = data.start_location
            this.end_locationn = data.end_locationn
        }

    }

}
