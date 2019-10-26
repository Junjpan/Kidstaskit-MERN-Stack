import React ,{ Component } from 'react';
import axios from 'axios';

export class Login extends Component {
    state = {
        kids: [],//kids's name in a array
        kidsId:[],
        loginKidid:'',
        kidslogin: false,
        parentslogin: false,
        message: "",
        username: "",
        password: "",
        login: false,
    }

 

    //receive input value
    create = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    //if you don't use arrow function, program will not recognize "this"
   //step1 kidlogin
    kids_Login = (e) => {
        e.preventDefault()
        axios.get(`/api/login?username=${this.state.username}&password=${this.state.password}`)
            .then((res) => {
                this.setState({
                    kidslogin: true,
                    kids: res.data.kids,
                    kidsId:res.data.kidsId,
                    login: true,
                    message:res.data.message,
                })
            })
            .catch((err) => { this.setState({ message: err.response.data }) })

    }
    

    //step2 kidlogin2 
    kidLogin = (e) => {
     e.preventDefault();
     // if you don't pick your name, will prompt message.
     if(this.state.loginKidid===''){
         alert("Please pick your name before login!")
     }else{
     const { login, message, username, parentslogin,kidslogin,kids,kidsId,loginKidid} = this.state;
     this.props.loginStatus(login, message, username, parentslogin,kidslogin,kids,kidsId,loginKidid);
 }
    }
 
    parents_login = (e) => {
        e.preventDefault();
        axios.get(`/api/login?username=${this.state.username}&password=${this.state.password}`)
            .then((res) => {
                this.setState({
                    login: true,
                    message: res.data.message,
                    kids: res.data.kids,
                    kidsId:res.data.kidsId,
                    parentslogin:true
                });
                const { login, message, username, parentslogin, kidslogin,kids,kidsId,loginKidid } = this.state;
                this.props.loginStatus(login, message, username, parentslogin, kidslogin,kids,kidsId,loginKidid);
            })
            .catch((err) => { this.setState({ message: err.response.data }) })
        //err.response, will be an object include data,status,statustext,header ,always get the response back from server "res.status(4XX).send('message')" 
    }

    ///pick kid's name to login
    pickKid=(e)=>{
      this.setState({loginKidid:e.target.value})
    }

    render() {
        if (this.state.kidslogin === true) {
            return (
                <div style={{ background: "lightgreen", padding: "20px" }}>
                    <div className="msg">{this.state.message}</div>
                    <br />
                    <br />
                    <h1 className="title">Login</h1>
                    <form className="form_login">
                        <select name="kid" onChange={this.pickKid}>
                        <option >Please select your name</option>
                        {this.state.kids.map((kid, index) => {
                            return <option key={index} value={this.state.kidsId[index]}>{kid}</option>
                        })}</select>
                        <br />
                        <input type="submit" onClick={this.kidLogin} value="Login" />
                    </form>
                </div>
            )
        } else {
            return (
                <div className="bg_login">
                    <div className="msg">{this.state.message}</div>
                    <br />
                    <br />
                    <h1 className="title">Login</h1>
                    <form className="form_login">
                        <label htmlFor="username">Username:</label>
                        <input type="text" minLength="6" id="username" name="username" onChange={this.create} required></input>
                        <label htmlFor="password">Password:</label>
                        <input type="password" minLength="8" id="password" name="password" onChange={this.create} required></input>
                        <input type="submit" onClick={this.parents_login} value="Parent Login" />
                        <input type="submit" onClick={this.kids_Login} value="Kids Login" />
                        <p className="normal" style={{ fontSize: "12px", color: "black" }}> Note: Kids use parents' same password and username to login and pick your name in the dropdown menu</p>
                    </form>
                    <br />
                </div>
            )
        }
    }
}

export default Login

