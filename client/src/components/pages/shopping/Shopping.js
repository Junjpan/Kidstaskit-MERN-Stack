import React, { Component } from 'react';
import Product from './Product';
import ShoppingList from './Shoppinglist';
import ShoppingHistory from './ShoppingHistory';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export class Shopping extends Component {
     state = {
          productlist: [],
          shoppinglist: [],
          todoTotal: 0,
          nottodoTotal: 0,
          shoppingTotal: 0,
          balance: 0,
          is_mounted: false,
          shoppinglist_view: false,
          shoppinglist_sum: 0,
          orderstatus:false,
          ordermessage:false,
          order_msg:''
     }
     componentDidMount() {
          axios.get('/api/products/' + this.props.username)
               .then((res) => {
                    this.setState({ productlist: res.data.products })
               })
               .catch((err) => { throw err })
          //get avaiable balance:
          axios.get('/api/nottodo/kid/' + this.props.loginKidid)
               .then((res) => {
                    // console.log(res.data.total)
                    this.setState({ nottodoTotal: res.data.total })
               })
               .catch((err) => { throw err })
          axios.get('/api/todo/kid/' + this.props.loginKidid)
               .then((res) => { this.setState({ todoTotal: res.data.total }) })
               .catch((err) => { throw err })
          axios.get('/api/shopping/kid/' + this.props.loginKidid)
               .then((res) => { this.setState({ shoppingTotal: res.data.total }) })
               .catch((err) => { throw err })
          setTimeout(() => this.setState({ is_mounted: true }), 500)
     }

     componentDidUpdate(){

          axios.get('/api/shopping/kid/' + this.props.loginKidid)
          .then((res) => { this.setState({ shoppingTotal: res.data.total }) })
          .catch((err) => { throw err })
     }

     //add product into the cart;
     buyProduct = (product) => {
          var sum;
          sum = product.total + this.state.shoppinglist_sum;
          this.setState({
               shoppinglist: [...this.state.shoppinglist, product],
               shoppinglist_sum: sum
          })
     }
     //place an order
     order = () => {
          //console.log(this.state.shoppinglist)
         this.setState({ordermessage:true,order_msg:"Your order is in the process..."}) ;  
         var balance=this.state.todoTotal + this.state.nottodoTotal - this.state.shoppingTotal
               if(balance>=this.state.shoppinglist_sum){                   
                    axios.post('/api/shopping/details/' + this.props.loginKidid, this.state.shoppinglist)
                    .then((res) => { 
                         setTimeout(()=>{this.setState({order_msg:res.data})},2000);
                         setTimeout(()=>{this.setState({ordermessage:false,
                                                  shoppinglist_view:false,
                                                  shoppinglist:[]})},3000);  })
                    .catch((err) => { throw err })
               }else if(balance<this.state.shoppinglist_sum){
                    setTimeout(()=>{this.setState({order_msg:"Sorry, you don't have enough points to pay for these order and your order has been cancelled."})},2000);
                    setTimeout(()=>{this.setState({ordermessage:false})},4000);     
               }
          
     }
     viewItems = () => {
          var sum = 0;
          for (var i = 0; i < this.state.shoppinglist.length; i++) {
               sum += this.state.shoppinglist[i].total
          }
          this.setState({
               shoppinglist_view: true,
               shoppinglist_sum: sum
          })
     }

     //remove item from shoppinglist
     removeShoppingItem = (id) => {
          const updatelist = this.state.shoppinglist.filter((item, index) => {
               return index !== id;
          })
          const updatedsum = this.state.shoppinglist_sum - this.state.shoppinglist[id].total
          this.setState({
               shoppinglist: updatelist,
               shoppinglist_sum: updatedsum
          })
     }

     //remove all the order list
     cancelOrder = () => {
          this.setState({
               shoppinglist: [],
               shoppinglist_sum: 0,
               shoppinglist_view: false
          })
     }
     //close shoppinglist view window
     closeWindow = () => {
          this.setState({ shoppinglist_view: false })
     }
     render() {
          return (
               <div >
                    <h1 className="title">Shopping Center</h1>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                         <div className="shopping_balance">{this.state.is_mounted === true ? (<p>Your current available blance is:<span style={{ color: "green" }}>{this.state.todoTotal + this.state.nottodoTotal - this.state.shoppingTotal}</span> points</p>) : <p>Loading...</p>}</div>
                         <div ><FontAwesomeIcon icon={faShoppingCart} size="2x" style={{ color: "red", marginRight: "15px", verticalAlign: "center" }} />
                         <span onClick={this.viewItems} className="shopping_list">Check Out Now: {this.state.shoppinglist.length} items</span> 
                         <ShoppingHistory kidid={this.props.loginKidid} /></div>
                         {this.state.shoppinglist_view ? <ShoppingList order={this.order} closeWindow={this.closeWindow} cancelOrder={this.cancelOrder} remove={this.removeShoppingItem} sum={this.state.shoppinglist_sum} shoppinglist={this.state.shoppinglist} /> : null}   
                    </div><br />
                    <div style={{ display: "flex", flexWrap: "wrap" }}>{this.state.productlist.map((unit, index) => {
                         return (<Product key={index} product={unit} username={this.props.username} kidid={this.props.loginKidid} shop={this.buyProduct} />)
                    })}</div>
                    {this.state.ordermessage?(<div className='order_message'>{this.state.order_msg}</div>):null}
               </div>
          )
     }
}

export default Shopping
