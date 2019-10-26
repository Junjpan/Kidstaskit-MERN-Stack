import React, { Component } from 'react';
import Name from './Name';

class User extends Component {
state={
    addStatus:false,
    newKid:''
}

addmore=()=>{
    this.setState({addStatus:true})
}

getStyle=()=>{
    return {
        display:this.state.addStatus ? "flex":"none",
        justifyContent:"center"
    }
}

onSave=(e)=>{
    e.preventDefault();
    this.props.addKid(this.state.newKid)
    this.setState({addStatus:false})
}

change=(e)=>{ 
    this.setState({newKid:e.target.value})
}

async onCancel(){                            //to be able to use async with arrow function, it will be like const onCancel=aync()=>{}
   await this.setState({addStatus:false})   //setState()is usually asynchronous, which means that at the time you console.log the state, it is not updated yet,and they we can use async and await to get the real update.
   // console.log(this.state)
}


    render() {
        const { username } = this.props.userInfo;
        return (
            <div style={{background:"lightblue",height:"100vh"}}>
                <br />
                <br />
                <div className="userBackground">
                    <br/>
                    <h1 className="title" style={{color:"black"}}>Hello {username}</h1>
                    <div >
                    <div>
                        <h2 className="normal" style={{ marginLeft: "8%", fontSize: "35px" ,color:"black"}}>You kids:</h2>
                        <div>{this.props.userInfo.kidsArray.map((kid, index) => {
                            return <Name key={index} kid={kid} id={this.props.userInfo.kidsId[index]} delete={this.props.deleteNameID} />
                        })}</div>
                    </div>
                    <div >
                        <div style={this.getStyle()} >
                        <form className="form_login" onSubmit={this.onSave} style={{width:"30%",background:"rgb(0, 102, 153)"}}>
                            <input type="text" name="kid" placeholder="Add kid's name" onChange={this.change} required></input>
                            <button type="button" onClick={this.onCancel.bind(this)} >Cancel</button>
                            <button type="submit" >Save</button>
                        </form>
                        </div>
                    <button style={{width:"180px", height:"50px",marginTop:"10px"}} onClick={this.addmore}>Add More Kids</button>
                    </div>
                    </div>
                </div>
                
            </div>)
    }
}

export default User;
