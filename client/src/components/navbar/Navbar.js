import React,{Component} from 'react';
import logo from '../../assets/JunEBug.png';
import { Link } from 'react-router-dom';


const navStyle = {
    position: "sticky",
    width: "100%",
    height: "70px",
    textAlign: "left",
    background: "white",
    marginBottom: "30px",
    color: "black",
}



class Navbar extends Component {
    state = {
        logout:false,
        message: "You are sucessfully logged out."
    }

    onClickLogout=()=>{
        this.setState({logout:true})
        this.props.logout(this.state.message);
    }

    render(){
        

    return (
        <nav style={navStyle} >
            <div>          
                <ul style={{ float: "left" }} >
                < img src={logo} style={{ height: "100px", width: "100px", marginRight: "30px", verticalAlign: "text-top" }} alt="logo" />
                    <li className="title">KIDS TASK IT</li>
                    {this.props.info.parentslogin?<li><Link to="/user" className="link">User |</Link> </li>:null}                    
                    <li><Link to="/todo" className="link">To Do List |</Link> </li> 
                    <li><Link to="/nottodo" className="link">Not To Do List |</Link></li>
                    <li><Link to="/report/" className="link">Report |</Link></li>                   
                    {this.props.info.parentslogin?<li><Link to="/shopping/add" className="link">Shopping Center |</Link></li>:<li><Link to={`/shopping/${this.props.info.loginKidid}`} className="link">Shopping Center |</Link></li>}
                    <li><Link to="/aboutus" className="link">About Us |</Link></li>
                    <li><button className="btn_logout" onClick={this.onClickLogout}>Logout</button></li>                    
                </ul>
            </div>   
        </nav>
    )
    }
}


export default Navbar
