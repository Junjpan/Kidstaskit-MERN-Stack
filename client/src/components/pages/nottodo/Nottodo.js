import React, { Component } from 'react';
import { Motion, spring } from "react-motion";
import AddRule from './AddRule';
import ReportNotTodo from './ReportNotTodo';
import DatePicker from 'react-datepicker';
import KidView from './Kidview';

export class Nottodo extends Component {
    state = {
        kids: [],
        kidsId: [],
        nottodos: [],
        kid: "",
        kidId: '',
        kidslogin: false,
        parentslogin: false,
        loginkid: "",
        loginkidid: "",
        finish: false,
        date: new Date(),
        message: "",
        rulepanel: false,
        addrule:false,
        username:''
    }

    componentDidMount() {
        const props = this.props.info;
        this.setState({
            kids: props.kidsArray,
            kidslogin: props.kidslogin,
            kidsId:props.kidsId,
            parentslogin: props.parentslogin,
            username:props.username,
        });
        if (props.kidslogin === true) {
            const index = props.kidsId.indexOf(props.loginKidid);
            this.setState({
                loginkid: props.kidsArray[index],
                loginkidid: props.loginKidid
            },
            )
        }
    }

async  pickKid(e) {
        e.preventDefault();
   await   this.setState({
            kidId: e.target.value.split('&')[0],
            kid: e.target.value.split('&')[1],
            rulepanel: true,
        })
    }

    save=()=>{
        this.setState({rulepanel:false})
    }

    addRules=()=>{
        this.setState({addrule:true,
                       rulepanel:true})
    }

    close=()=>{
        this.setState({rulepanel:false,
            addrule:false})
    }

    handleChange = (newdate) => {
        this.setState({ date: newdate })
    }

    render() {            
        const nottodolist={
            position:"absolute",
            left:"25%",
            width:"60%",
            minHeight:"60%",
            top:"22%",
            background:"black",
            zIndex:"4", 
            boxShadow:"5px 10px 8px 10px gray"          
        }

        return (
            <div >
                <br/>
                <br/>
                <h1 className="title">Rules</h1>
                <div style={{marginLeft: "50px"}}><DatePicker className="calendar1" selected={this.state.date} onChange={this.handleChange} /></div><br/>
                <div>  
                {this.state.kidslogin===false?(<div>    
                <div style={{ marginLeft: "50px" }}>
                    <select name="kid" className='kidlist' onChange={this.pickKid.bind(this)}>
                        <option>Your Kids:</option>
                        {this.state.kids.map((kid, index) => {
                            return <option key={index} value={this.state.kidsId[index] + '&' + kid}>{kid}</option>
                        })}</select>
                </div>
                <button className="general_rules_button" onClick={this.addRules}>Add/Edit General Guides</button>            
                <div className="normal" style={{float:"right",marginRight:"20%",color:"black"}}>
                    Instructions: <br/>
                    1. Use the "Add/Edit General Guides" button to set general rules/standards for your Kids to follow.<br/>
                    2. When your child breaks your rules, you can select his/her name to substract points.
                </div></div>):(<KidView  info={this.state} />)} 
                <Motion style={{z:spring(this.state.rulepanel?0:-100) ,opacity:spring(this.state.rulepanel?1:0)}}>
                    {(currentStyles)=>(
                     <div style={{ ...nottodolist, transform: `translate3d(0,0,${currentStyles.z})`, opacity: currentStyles.opacity}}>
                         {this.state.addrule?(<AddRule user={this.state.username} close={this.close}/>):(<ReportNotTodo name={this.state.kid} pickdate={this.state.date.toString()} kid={this.state.kidId} close={this.close}/>)}                       
                     </div>
                    )}
                </Motion>           
                </div>
            </div>
        )
    }
}

export default Nottodo
