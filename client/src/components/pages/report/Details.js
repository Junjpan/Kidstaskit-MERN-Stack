import React, { Component } from 'react';
import getdate from '../../../func/getdate'

export class Details extends Component {
    
    render() {
        const {details}=this.props;
        return (
            <div>
                <p style={{textDecoration:"underline",textAlgin:"left"}}>From:{getdate(details.startdate.toString())}&nbsp;To:{getdate(details.enddate.toString())}</p>
                <p>You totally make <span style={{color:"blue"}}>{details.sum}</span> points</p>
                <p>You totally have <span style={{color:"red"}}>{details.nottodosum}</span> points</p>
            </div>
        )
    }
}

export default Details
