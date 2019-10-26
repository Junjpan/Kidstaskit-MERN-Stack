import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import './App.scss';
import axios from 'axios';
import Todos from './components/pages/todo/Todos';
import Nottodo from './components/pages/nottodo/Nottodo';
import Navbar from './components/navbar/Navbar';
import NavbarLogin from './components/navbar/NavbarLogin';
import Aboutus from './components/pages/Aboutus';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import User from './components/pages/user/User';
import Report from './components/pages/Report';
import Shopping from './components/pages/shopping/Shopping';
import SetUpProducts from './components/pages/shopping/SetUpProducts';

class App extends Component {
  state = {
    todos: [],
    login: false,
    message: "",
    username: "",
    parentslogin: false,
    kidslogin: false,
    kidsArray: [],
    kidsId: [],
    loginKidid: ""
  };

  //confirm login
  loginStatus = (login, message, username, parentslogin, kidslogin, kids, kidsId, loginKidid) => {
    this.setState({
      login: login,
      message: message,
      username: username,
      parentslogin: parentslogin,
      kidslogin: kidslogin,
      kidsArray: kids,
      kidsId: kidsId,
      loginKidid: loginKidid

    })
    this.setTimeOutMessage();
  }

  //set up login page
  login = () => {
    return (<Router>
      <div >
        <NavbarLogin />
        <p className='msg'>{this.state.message}</p>
        <Route exact path="/" />{this.state.login ? <Redirect to="/todo" /> : <Redirect to="/login" />}
        <Route path="/login" exact render={(props) => {
          return (<Login loginStatus={this.loginStatus} />)
        }} />
        <Route path="/register" exact component={Register} />
        <Route path="/aboutus" exact component={Aboutus} />
      </div>
    </Router>)
  }

  setTimeOutMessage = () => {
    setTimeout(() => { this.setState({ message: "" }) }, 2000)
  }
  //logout message
  logout = (msg) => {
    this.setState({ login: false, message: msg })
    this.setTimeOutMessage();
  }

 
  //user page-delete kidid
  deleteNameID = (id) => {
    axios.delete('/api/user/kid/' + id)
      .then((res) => {
        this.setState({
          message:res.data.message,
          kidsId:res.data.kidsId,
          kidsArray:res.data.kidsArray
        })       
      })
      .catch((err) => { console.log(err) })
    this.setTimeOutMessage();
  }

  //user page-add kid
  addKid=(name)=>{
    //console.log(name)
    const newKid={
      username:this.state.username,
      kidname:name
    }
    axios.post('/api/user/kid/add',newKid)
         .then((res)=>{
           console.log(res.data)
           this.setState({
            kidsArray:res.data.kidsname,
            kidsId:res.data.kidsID,
            message:res.data.message
           })
         })
         .catch(((err)=>{throw err}))
         this.setTimeOutMessage();    
  }

  render() {
    if (this.state.login === false) {
      return this.login();
    } else {
      return (
        <Router>
          <div >
            <Navbar info={this.state} logout={this.logout} />
            <div className="msg">{this.state.message}</div>
            <Route exact path="/" />{this.state.login ? <Redirect to="/aboutus" /> : <Redirect to="/login" />}
            <Route path="/todo" exact render={(props) => (//when you just include one compoent in the Route, use component as props, if you have more than one component, you have to render props            
              <div className="title">
                <Todos info={this.state}  />
              </div>
            )}
            />
            <Route path="/nottodo" exact render={()=>{
              return <Nottodo info={this.state}/>
            }} />
            <Route path="/aboutus" exact component={Aboutus} />
            <Route path="/report"  render={()=>{
              return <Report info={this.state} />
            }}/>
            <Route path="/user" exact render={(props) => (
              <User  userInfo={this.state} deleteNameID={this.deleteNameID} addKid={this.addKid} />
            )} />
            {this.state.parentslogin?<Route path='/shopping/add' exact render={(props)=>(
              <SetUpProducts  username={this.state.username} />)}/>:<Route path='/shopping/:id'  exact render={(props)=>(
                <Shopping username={this.state.username} loginKidid={this.state.loginKidid}/>
              )}/>}            
          </div>
        </Router>
      );
    }
  }
}

export default App;

