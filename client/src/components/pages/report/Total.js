import React, { Component } from 'react';

export class Total extends Component {


    render() {
        return (
            <div>
            <hr/>
            <p>Total gained points are <span style={{color:"blue"}}>{this.props.todosum} </span> points since you start .</p>
            <p>Total minus points are <span style={{color:"red"}}> {this.props.nottodosum} </span> points since you start .</p>
            <p>Total spend on shopping are <span style={{color:"purple"}}>{this.props.shoppingsum}</span> .</p>
            <p>You avaiable balance are <span style={{color:"green", fontSize:"20px"}}>{this.props.todosum+this.props.nottodosum-this.props.shoppingsum} </span> points .</p>
            </div>
        )
    }
}

export default Total
