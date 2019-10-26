import React, { Component } from 'react';
import axios from "axios";
import getDate from '../../../func/getdate';
import { Motion, spring } from "react-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"

export class ShoppingHistory extends Component {
    state = {
        shoppingHistory: [],
        pickeddate: "",
        historyPannel: false,
        currentPickedHistory:[],
    }

    componentDidMount() {
        axios.get('/api/shopping/history/' + this.props.kidid)
            .then((res) => {
                this.setState({ shoppingHistory: res.data })
            })
            .catch((err) => { throw err })

    }

    checkShoppingHistory = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const date = value.split('&')[0];
        const id = value.split('&')[1]
        this.setState({
            historyPannel: true,
            pickeddate: date,
            currentPickedHistory:this.state.shoppingHistory[id].itemSold,
        })
    }

    closeHistoryPanel=()=>{
        this.setState({historyPannel:false})
        //console.log(this.state.currentPickedHistory)
    }

    render() {
        const historyPannel_style = {
            position: "absolute",
            top: "0",
            left: "0",
            width: "350px",
            background: "black",
            zIndex: "11",
            color: "white"
        }
        return (
            <div style={{ float: "right" }}>
                <select className="shopping_history" onChange={this.checkShoppingHistory}><option>Shopping History:</option>
                    {this.state.shoppingHistory.map((item, index) => <option key={index} value={`${getDate(item._id)}&${index}`}>{getDate(item._id)}</option>)}
                </select>
                <Motion style={{ x: spring(this.state.historyPannel ? 0 : -100) }}>
                    {(currentValues) => (<div style={{ ...historyPannel_style, transform: `translate3d(${currentValues.x}%,0,0)` }}>
                        <div style={{display:"flex",justifyContent:"space-around"}}> <h4 style={{ fontSize: "20px", fontFamily: "'Ropa Sans', sans-serif" }}>Order on {this.state.pickeddate}</h4>
                            <FontAwesomeIcon icon={faWindowClose} size="2x" onClick={this.closeHistoryPanel} style={{ color: "lightblue", marginRight: "10px",marginTop:"20px"}} />
                        </div><br/>
                        <div className="history_list">{this.state.currentPickedHistory.map((item,index)=>(
                            <div key={index}>Product:&nbsp;{item.product}<br/>   
                            Price:&nbsp;{item.price} &nbsp;&nbsp;Quantity:&nbsp;{item.quantity} <br/>
                            Total:&nbsp;{item.total}
                            <hr/></div> 
                        ))}</div>
                        <div className="history_bottom_band"></div>   
                    </div>)}
                </Motion>
            </div>
        )
    }
}

export default ShoppingHistory
