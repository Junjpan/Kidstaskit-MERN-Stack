import React, { Component } from 'react';
import axios from "axios";

class Register extends Component {
    
    
    state = {
        username: "",
        password: "",
        kids: [],
        kidname:'',
        registed: false,
        msg: "",
    }
   
    //as soon as the target's name is match state's name we can use this way
    create = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    //register username
    submit = (e) => {
        e.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post('/api/register', user)
            .then((res) => {
                this.setState({  
                    msg: res.data,
                    registed: true
                })
            })
            .catch((err) => {                
                this.setState({registed:false,
                    msg:'This username has been used, try a different username.' }); }  )
    }
  
    //Add kid's name 
    addKid=(e)=>{
     e.preventDefault();
     var newkid=this.state.kidname
     if (newkid.length<2){
     this.setState({msg:"Please enter the correct name."})
     setTimeout(()=> this.setState({msg:""}),2000)
     }else{
     this.setState({kids:[...this.state.kids,newkid],
                   kidname:""})}
    }

    //add kids to the database attached to username
    done=(e,props)=>{
        e.preventDefault();
    const kids=this.state.kids;
    axios.post("/api/user/"+this.state.username,kids)
         .then((res)=>{
           console.log(res.data);
        })
         .catch((err)=>{throw err})
         .finally(()=>{
            this.props.history.push('/login')// you can do window.location('/login')
         })
             

    }

    render() {
        //regist sucessfully and register their kids.
        if (this.state.registed === true) {
            return (<div style={{ background: "lightgreen", padding: "20px" }}>
                <div className="msg">{this.state.msg}</div>
                    <br/>
                    <br/>
                    <h1 className="title">Register for Kids</h1>
                    <form className="form_login">
                        <div>{this.state.kids.map((kid,index)=>{
                            return (<div className="normal" style={{color:"black"}} key={index} >{index+1}&nbsp;{kid}
                                    </div>)
                        })}</div>
                        <label htmlFor="kidname">Kid's Name</label>
                        <input type="text"  name="kidname" onChange={this.create} id="kidname" minLength="8" required />
                        <input type="submit" onClick={this.addKid} value="Add More" />
                        <input type="submit" onClick={this.done} value="Done" />
                    </form>    
         </div>)
        }else{
            //before register
        return (
            <div className="bg_register">
                    <div className="msg">{this.state.msg}</div>
                    <br />
                    <br/>
                    <h1 className="title">Register</h1>
                    <br />
                    <form className="form_login" onSubmit={this.submit} >
                        <label htmlFor="username">Username (Minimun 6 Characters):</label>
                        <br />
                        <input type="text" minLength="6" id="username" name="username" onChange={this.create} required></input>
                        <br />
                        <label htmlFor="password">Password (Minimun 8 Characters):</label><br />
                        <input type="password" minLength="8" id="password" name="password" onChange={this.create} required></input>
                        <br />
                        <input type="submit" value="Create an Account" />
                    </form>
                    <br />
                    <br />
                </div>
                )}
            }
        }
        
        export default Register
