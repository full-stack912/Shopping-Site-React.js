import React, {useState} from 'react';

const STEP_REQINF = 1;
const STEP_CHOOSERIDER = 2;
const STEP_CONFIRM = 3;
const STEP_CHECKOUT = 4;
const DefaultAvatar = require('../../assets/images/avatar_empty.png')


const ErrandRequestForm = props =>{

    const [pickup_addr, setPickupAddr] = useState('')
    const [dest_addr, setDestAddr] = useState('')
    const [sender_name, setSenderName] = useState('')
    const [sender_phone, setSenderPhone] = useState('')
    const [receiver_name, setReceiverName] = useState('')
    const [receiver_phone, setReceiverPhone] = useState('')

    const [parcelDesc, setParcelDesc] = useState('')
    const [deliveryDesc, setDeliveryDesc] = useState('')

    const {stepOfRequest, onChangePickupAddr, onChangeDestAddr, onChangeSenderName, onChangeReceiverName, onChangeSenderPhone, onChangeReceiverPhone,
        onChangeParcelDesc, onChangeDeliveryDesc} = props
    return (
        <div className="row" style={{display: stepOfRequest === STEP_REQINF ? '' : 'none'}}>
            <div className="col-md-6 text-left">
                <div
                    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                    <label htmlFor="pickup_addr" className={'font-13'}>Pickup Address</label>
                    <input className="mdl-textfield__input" type="text" id="pickup_addr" placeholder={''}
                        //        value={pickup_addr} onChange={e=>{
                        //     setPickupAddr(e.target.value)
                        //     if(onChangePickupAddr)onChangePickupAddr(e.target.value)
                        // }}
                    />

                </div>
                <div
                    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                    <label className="font-13" htmlFor="dest_addr">Destination Address</label>
                    <input className="mdl-textfield__input" type="text" id="dest_addr" placeholder={''}
                        //        value={dest_addr} onChange={e=>{
                        //     setDestAddr(e.target.value)
                        //     if(onChangeDestAddr)onChangeDestAddr(e.target.value)
                        // }}
                    />

                </div>
                <div
                    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input" >
                    <label className="font-13" htmlFor="sender_name">Sender Name</label>
                    <input className="mdl-textfield__input" type="text" id="sender_name" value={sender_name} onChange={e=>{
                        setSenderName(e.target.value)
                        if(onChangeSenderName)onChangeSenderName(e.target.value)
                    }}/>

                </div>
                <div
                    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                    <label className="font-13" htmlFor="sender_phone">Sender Phone</label>
                    <input className="mdl-textfield__input" type="number" id="sender_phone" value={sender_phone} onChange={e=>{
                        setSenderPhone(e.target.value)
                        if(onChangeSenderPhone)onChangeSenderPhone(e.target.value)
                    }}/>

                </div>

                <div
                    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                    <label className="font-13" htmlFor="receiver_name">Receiver Name</label>
                    <input className="mdl-textfield__input" type="text" id="receiver_name" value={receiver_name} onChange={e=>{
                        setReceiverName(e.target.value)
                        if(onChangeReceiverName)onChangeReceiverName(e.target.value)
                    }}/>

                </div>
                <div
                    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label form-input">
                    <label className="font-13" htmlFor="receiver_phone">Receiver Phone</label>
                    <input className="mdl-textfield__input" type="number" id="receiver_phone" value={receiver_phone} onChange={e=>{
                        setReceiverPhone(e.target.value)
                        if(onChangeReceiverPhone)onChangeReceiverPhone(e.target.value)
                    }}/>

                </div>

            </div>
            <div className="col-md-6">
                <div className="form-group pt-4">
                    <label className="text-left w-100">Description of Parcel</label>
                    <textarea className="form-control" rows={5} onChange={e=>{
                        setParcelDesc(e.target.value)
                        if(onChangeParcelDesc)onChangeParcelDesc(e.target.value)
                    }}
                              defaultValue={parcelDesc}
                    ></textarea>
                </div>
                <div className="form-group pt-4">
                    <label className="text-left w-100">Additional description for Delivery</label>
                    <textarea className="form-control" rows={5} onChange={e=>{

                        setDeliveryDesc(e.target.value)
                        if(onChangeDeliveryDesc)onChangeDeliveryDesc(e.target.value)
                    }}
                              defaultValue={deliveryDesc}
                    ></textarea>
                </div>
            </div>
        </div>
    )
}

export default ErrandRequestForm;
