import React, { Component } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';



export class Kidview extends Component {
_isMounted=false;
    state = {
        loginkidid: '',
        loginkid: '',
        message: "",
        nottodos:[],
    }

    componentDidMount() {
//this._isMounted=true
        const { loginkidid, loginkid, username } = this.props.info
        this.setState({
            loginkidid: loginkidid,
            loginkid: loginkid
        })
        axios.get('/api/user/rules/' + username)
            .then((res) => {
               // console.log(res.data);
                this.setState({
                    title: res.data.title,
                    rules: res.data.rules,
                })
            })
            .catch((err) => { throw err })
         //find out today if you have minus points   
       axios.get('/api/nottodo/' + loginkidid)
            .then((res) => {
                if(res.data.nottodos.length===0){
                    this.setState({message:`Great job ${loginkid}, so far you haven't lost any points today!`})
                }else if (res.data.nottodos.length>=1) {
             this.setState({message:`Sorry ${loginkid}, unfortunately you lost some points today, you can find more details inside the report center`})       
                }
            })
            .catch((err) => { throw err })
    }
  
    printRules=()=>{

    }

    render() {
        return (
            <div >
                <div className="msg">{this.state.message}</div>
                <div>
                    <h4 style={{ textAlign: "center", fontFamily: "cursive" }}>{this.state.title}</h4>                  
                    <div className="markdown_html"><Markdown source={this.state.rules} /></div>                   
                </div>
        <p>{this.state.nottodos.map((nottodo)=>(<p>{nottodo.title}</p>))} </p>
            </div>
        )
    }
}

export default Kidview
