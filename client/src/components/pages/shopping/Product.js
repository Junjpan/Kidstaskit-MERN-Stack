import React, { Component } from 'react'

class Product extends Component {
    state={
        count:0,
    }

    buyProduct=(product)=>{

        if(this.state.count<1){
        alert('Please enter quantity first before you add the product into the cart!')
        }
        product.productid=product._id;
        delete product._id;
        product.quantity=this.state.count;
        product.username=this.props.username;
        product.kidid=this.props.kidid;
        product.total=this.state.count*product.price
       this.props.shop(product);

    }

   
    change=(e)=>{
        e.preventDefault();
        
        this.setState({count:Number(e.target.value)})
    }

    render() {
        return (
            <div>
            <div className="product_image_outer"><img alt="product_image" src={this.props.product.image} className="product_img"></img></div><br />
                        <div className="product_list">
                            <p>{this.props.product.product}</p>
                            <p>Price:{this.props.product.price}&nbsp; points</p>
                            <label>Quantity:</label>
                            <input type="number" name="unit" min="0" placeholder="0" onChange={this.change} style={{width:"25px", height:"25px", marginBottom:"10px"}}></input><br/>
                            <button style={{ width: "150px", height: "35px" }} onClick={() => this.buyProduct(this.props.product)}>Add To Shopping Cart</button>
            </div>
            </div>
        )
    }
}

export default Product

