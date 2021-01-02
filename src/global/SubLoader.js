import React from 'react';

import {Constants} from "../rglobal/constants";
import PropTypes from 'prop-types';
import {BarLoader, PulseLoader, ClipLoader} from "react-spinners";

export function SubLoader (props){
    let width = props.width ? props.width : 100;
    let height = props.height ? props.height : 3;

    return (
        <BarLoader
            css=" display: block;margin: 0 auto;border-color: red;"
            sizeUnit={"%"}
            width={width}
            height={height}
            color={Constants.orangeColor}
            loading={props.isLoading}
        />
    );
}

export function SubPulseLoader (props){
    return (
        <PulseLoader
            css=" display: block;margin: 0 auto;border-color: red;"
            sizeUnit={"px"}
            size={12}
            color={Constants.orangeColor}
            loading={props.isLoading}
        />
    );
}

export function SubClipLoader ({isLoading = false, color=Constants.orangeColor}){
    return (
        <ClipLoader
            // css=" display: block;margin: 0 auto;border-color: red;"
            sizeUnit={"px"}
            size={40}
            color={color}
            loading={isLoading}
        />
    );
}



