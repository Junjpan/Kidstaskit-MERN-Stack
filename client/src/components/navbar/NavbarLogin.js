import React from 'react';
import logo from '../../assets/JunEBug.png';
import {Link} from 'react-router-dom';


//functional component only have one return works like render
const NavbarLogin=()=>{
    const navStyle={
        position:"sticky",
        width:"100%",
        height:"70px",
        textAlign:"left",
        background:"white",
        marginBottom:"30px",
        color:"black",
    }
    return(
        <nav style={navStyle} >  
         <div>
        <ul style={{float:"left"}} >  
            < img src={logo} style={{ height: "100px", width: "100px" ,marginRight:"30px", verticalAlign:"text-top"}} alt="logo" />
                <li className="title" >KIDS TASK IT</li>                
                <li><Link to="/login" className="link">Login |</Link> </li>
                <li><Link to="/register" className="link">Set Up An Account |</Link></li>
                <li><Link to="/aboutus" className="link">About Us |</Link></li>
            </ul>            
         </div>
         </nav>
    )

}


export default NavbarLogin
