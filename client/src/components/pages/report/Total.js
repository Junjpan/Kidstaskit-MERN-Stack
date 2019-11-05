import React, { Component } from 'react';

export class Total extends Component {


    render() {
        return (
            <div>
            <hr/>
            <p>You have gained <span style={{color:"blue"}}>{this.props.todosum} </span> points since you've start .</p>
            <p>You have lost <span style={{color:"red"}}> {this.props.nottodosum} </span> points since you've start .</p>
            <p>You have spent <span style={{color:"purple"}}>{this.props.shoppingsum}</span> points on shopping.</p>
            <p>Your avaiable balance are <span style={{color:"green", fontSize:"20px"}}>{this.props.todosum+this.props.nottodosum-this.props.shoppingsum} </span> points .</p>
            </div>
        )
    }
}

export default Total
