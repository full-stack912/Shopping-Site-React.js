import React, { Component } from 'react'
import PropTypes from 'prop-types';



export class BtnNormal extends Component {
    static propTypes = {
        title : PropTypes.string.isRequired,    
        disabledTitle : PropTypes.string,    
        onClick : PropTypes.func,    
        disabled: PropTypes.bool,

    }
    render() {
        
        let className = "btn btn-primary btn-pill " + (this.props.disabled ? "disabled" : "")
        let title = this.props.disabled ? this.props.disabledTitle  : this.props.title;

        return (
            <div> 
                <a className={className} onClick={this.props.onClick}  >{title}</a> 
            </div>
        )
    }
}


class BtnMain extends Component {
    render() {
        return (
            <div className="slider-button">
                <a className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect button button-primary button-pill"
                    onClick={this.props.onClick}
                >{this.props.title}</a>
            </div>
        )
    }    
}
BtnMain.propTypes = {
    title : PropTypes.string.isRequired,    
    onClick : PropTypes.func,    
}

export default BtnMain;

