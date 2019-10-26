import React, { Component } from 'react'

class Name extends Component{
  
    render(){

   return(
   <div>
   <p className="normal" style={{ marginLeft: "10%",fontSize: "25px" ,color:"black"}}>
   {this.props.kid}<button  onClick={this.props.delete.bind(this,this.props.id)}>Delete</button>
   </p>
   </div>
   )
    
}
}

export default Name;