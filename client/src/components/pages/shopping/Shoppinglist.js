import React from 'react'

const Shoppinglist = (props) => {
 

    return (
        <div className="shopping_list_display">
            <button onClick={props.closeWindow} className="close_preview_window">X</button>
            <button onClick={props.order}>Place an Order</button>
            <button onClick={props.cancelOrder}>Cancel all the Orders</button>
            <h4>You currently have <span style={{ color: "black"}} >{props.shoppinglist.length} </span>items in your shopping cart.</h4>
            <h4>Total cost for this order is going to be <span style={{ color: "black"}}>{props.sum} points.</span></h4>
            <div>{props.shoppinglist.map((item, index) => (
                <div key={index} style={{display:"flex",justifyContent:"space-between"}}>
                    <div className="product_image_outer_mini"><img alt="product_image" src={item.image} className="product_img_shoppinglist"></img></div>
                    <div className="product_list_mini">
                        <p>{item.product}</p>
                        <p>Price:{item.price}&nbsp; points</p>
                        <label>Quantity:</label><span>{item.quantity}</span>
                        <p>Cost:{item.total} points</p>
                        <button onClick={()=>props.remove(index)}>Remove</button>
                        <hr/>
                    </div>
                </div>
            ))}</div>
        </div>
    )
}

export default Shoppinglist;
