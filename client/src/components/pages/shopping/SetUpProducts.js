import React, { Component } from 'react';
import { Motion, spring } from "react-motion";
import axios from 'axios';

export class SetUpProducts extends Component {
    state = {
        name: '',
        addpanel: false,
        previewPanel: false,
        price: 1,
        description: '',
        imageurl: 'https://www.freeiconspng.com/uploads/no-image-icon-8.png',
        productlist: [],
        message: "",
        editstatus: false,
        editimageurl: '',
        editprice: 0,
        editdescription: '',
        editid: '',
        editindex: 0
    }

    
    componentDidMount() {
        axios.get('/api/products/' + this.props.username)
            .then((res) => {
                this.setState({ productlist: res.data.products })
            })
            .catch((err) => { throw err })
    }

    //you can use componentDidUpdate if you want to have side effects after any states changed    
    componentDidUpdate(){
        axios.get('/api/products/' + this.props.username)
            .then((res) => {
                this.setState({ productlist: res.data.products })
            })
            .catch((err) => { throw err })
    }
    //open addpannel
    add = () => {
        this.setState({ addpanel: true })
    }

    closeAddPannel = (e) => {
        e.preventDefault();
        this.setState({
            addpanel: false,
            editstatus: false
        })
    }

    //add product to database
    addProduct = (e) => {
        e.preventDefault();
        const products = {
            product: this.state.description,
            price: this.state.price,
            image: this.state.imageurl,
            username: this.props.username,
        }
        //this.setState({ productlist: [products, ...this.state.productlist] })
        axios.post('/api/products/add/' + this.props.userid, products)
            .then((res) => { this.setState({ message: res.data });
            setTimeout(() => { this.setState({ message: '' }) },2000) })
            .catch((err) => { throw err })

    }

    //edit product mode
    editProduct = (index) => {
        this.setState({
            editstatus: true,
            editimageurl: this.state.productlist[index].image,
            editprice: this.state.productlist[index].price,
            editdescription: this.state.productlist[index].product,
            editid: this.state.productlist[index]._id,
            editindex: index,
            addpanel: true
        });
    }
    //edit product
    edit = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    //submit edit product form
    submitEditedProduct = (e) => {
        e.preventDefault();
        const editedProduct = {
            product: this.state.editdescription,
            price: this.state.editprice,
            image: this.state.editimageurl,
            _id: this.state.editid,
        }
        /** componentDidUpdate() update the state (frontend) automatically everytime you change the backend data. Because of that, you don't need to write the code below
        const updated = this.state.productlist;
        updated[this.state.editindex] = editedProduct;
        this.setState({
            productlist: updated,
            editstatus: false,
            addpanel: false
        })*/
        this.setState({editstatus:false,
                        addpanel:false})
        axios.put('/api/products/' + this.state.editid, editedProduct)
            .then((res) => {
                this.setState({ message: res.data });
                setTimeout(() => { this.setState({ message: '' }) },2000)
            })
            .catch((err) => { throw err })


    }
    //delete product
    deleteProduct=(id,productid)=>{
     /**   Once you did the componentDidUpdate() you don't need to update the frontend
     const array=this.state.productlist.filter((product,index)=>{
     return index!==id
     });
     this.setState({productlist:array})*/ 
     axios.delete('/api/products/delete/'+productid+'?username='+this.props.username)
          .then((res)=>{this.setState({message:res.data});
          setTimeout(() => { this.setState({ message: '' }) },2000)
          })
          .catch((err)=>{throw err})
    }

    //change input field included image-url,description,price
    change = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    //preview product set up
    preview = (e) => {
        e.preventDefault();
        this.setState({ previewPanel: true })
    }

    //close preview product panel
    closePreviewPanel = () => {
        this.setState({ previewPanel: false })
    }



    render() {
        const addstyle = {
            position: "absolute",
            top: "20%",
            left: "35%",
            height: "70vh",
            width: "500px",
            background: "rgb(79, 98, 151)",
            zIndex: "2",
        };

        const previewstyle = {
            position: "absolute",
            top: "20%",
            left: "0",
            height: "70vh",
            width: "500px",
            background: "rgb(79, 98, 151)",
            zIndex: "2",
        }

        return (
            <div>
                <button className="shop_addproducts" onClick={this.add}>Add Products</button>
                <div className="msg">{this.state.message}</div>
                <Motion style={{ y: spring(this.state.addpanel ? 0 : -500), opacity: spring(this.state.addpanel ? 1 : 0) }}>
                    {(currentStyles) => (
                        <div style={{ ...addstyle, transform: `translate3d(0,${currentStyles.y}%,0)`, opacity: currentStyles.opacity }}>
                            {this.state.editstatus === false ? (<div>
                                <div className="product_image_outer1"><img alt="product_image" src="https://www.freeiconspng.com/uploads/no-image-icon-8.png" className='product_img' ></img></div>
                                <form className="add_product_form" onSubmit={this.addProduct}>
                                    <label>(Optional) If you want to add a picture for the product, change the image url below.</label>
                                    <input type="text" name="imageurl" value={this.state.imageurl} onChange={this.change} placeholder="Input image url(such as:https://www....)." style={{ width: "400px" }}></input><br />
                                    <input type="text" name="description" value={this.state.description} onChange={this.change} placeholder="Product description(such as cash price $5.00, use ipad for an hr...)" style={{ width: "400px" }} required></input>  <br />
                                    <input type="number" name="price" value={this.state.price} onChange={this.change} placeholder="Input Product Unit Price(points)" style={{ width: "300px" }} min="1" required></input>&nbsp;<label>points</label><br />
                                    <input type="button" onClick={this.closeAddPannel} value="Close" />
                                    <input type="button" onClick={this.preview} value="Preview" />
                                    <input type="submit" value="Add" />
                                </form>
                            </div>) : (<div>
                                <div className="product_image_outer1"><img alt="product_image" src={this.state.editimageurl} className='product_img' ></img></div>        
                                <form className="add_product_form" onSubmit={this.submitEditedProduct}>
                                    <input type="text" name="editimageurl" value={this.state.editimageurl} onChange={this.edit} placeholder="Input image url(such as:https://www....)." style={{ width: "400px" }}></input><br />
                                    <input type="text" name="editdescription" value={this.state.editdescription} onChange={this.edit} placeholder="Product description(such as cash price $5.00, use ipad for an hr...)" style={{ width: "400px" }} required></input>  <br />
                                    <input type="number" name="editprice" value={this.state.editprice} onChange={this.edit} placeholder="Input Product Unit Price(points)" style={{ width: "300px" }} required></input>&nbsp;<label>points</label><br />
                                    <input type="button" onClick={this.closeAddPannel} value="Cancel" />
                                    <input type="submit" style={{ width: "150px" }} value="Save Edited Product" />
                                </form>
                            </div>)}
                        </div>)}
                </Motion>
                <Motion style={{ x: spring(this.state.previewPanel ? 0 : -500), opacity: spring(this.state.previewPanel ? 1 : 0) }}>
                    {(currentStyles) => (
                        <div style={{ ...previewstyle, transform: `translate3d(${currentStyles.x}%,0,0)`, opacity: currentStyles.opacity }}>
                        <div className="product_image_outer1"><img alt="product_image" src={this.state.imageurl} className='product_img' ></img></div>    
                            <br />
                            <div className="product_preview">
                                <p>{this.state.description}</p>
                                <p>Price:{this.state.price}&nbsp; points</p>
                                <button style={{ color: "black", width: "100px", height: "35px" }} onClick={this.closePreviewPanel}>Close</button>
                            </div>
                        </div>)}
                </Motion>
                <div style={{ display: "flex",flexWrap:"wrap" }}>{this.state.productlist.map((product, index) => (<div key={index}>
                    <div className="product_image_outer"><img alt="product_image" src={product.image} className="product_img"></img></div><br />
                    <div className="product_list">
                        <p>{product.product}</p>
                        <p>Price:{product.price}&nbsp; points</p>
                        <button style={{ width: "100px", height: "35px" }} onClick={() => this.editProduct(index)}>Edit</button>
                        <button style={{ color: "red", width: "100px", height: "35px" }} onClick={()=>this.deleteProduct(index,product._id)}>Delete</button>
                    </div>
                </div>))}</div>

            </div>
        )
    }
}

export default SetUpProducts
