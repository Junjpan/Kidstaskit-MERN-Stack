import React, {Component} from 'react';
import axios from 'axios';
import {saveAs} from 'file-saver'


class AddRule extends Component {
    state={
        title:"",
        rules:"",
        username:'',
        message:""
    }
   componentDidMount(){
       const username=this.props.user;
       this.setState({username:username})
       axios.get('/api//user/rules/'+username)
            .then((res)=>this.setState({title:res.data.title,
                                      rules:res.data.rules}))
            .catch((err)=>console.log(err))
   
    }

    changeValue=(e)=>{
     e.preventDefault();
     this.setState({[e.target.name]:e.target.value})
    }

    save=(e)=>{
        e.preventDefault();
        document.myForm.rules.style.color="black";
        document.myForm.title.style.color="black";
        const rules={
            title:this.state.title,
            rules:this.state.rules,
        }
        axios.post('/api/user/rules/'+this.state.username,rules)
             .then((res)=>{
             this.setState({message:res.data})})
             .catch((err)=>{console.log(err)})
    }

    close=()=>{
        this.props.close();
    }

    html2PDF=()=>{
        const rules={
            title:this.state.title,
            rules:this.state.rules,
        }
        axios.post('/api/rules/print',rules)
            .then(()=>axios.get('/api/fetch-pdf',{responseType:"blob"}))
            .then((res)=>{
               const pdfblob=new Blob([res.data],{type:'application/pdf'});
               saveAs(pdfblob,'rules.pdf');
            })
             
    }

    edit=()=>{
        document.myForm.rules.focus();
        document.myForm.rules.style.color="blue";
        document.myForm.title.style.color="blue";
    }

    render(){
        return (
            <div>
                <div className="msg" style={{ fontSize: "15px", textAlign: "right", marginRight:"10px" ,color: "red"}}>{this.state.message}</div>
                <form className="form_add_rule" name="myForm" onSubmit={this.save} >
                    <input type="text" placeholder="Title" value={this.state.title} name="title" onChange={this.changeValue}></input><br/>
                    <textarea value={this.state.rules} name="rules" onChange={this.changeValue} placeholder="Enter your not todo list (example: Rude to parents -50 pts/time)" type="text" ></textarea>
                    <div style={{width:"150px",float:"right" }}>
                    <input type="button" className="button" value="Close" onClick={this.close}/><br/>    
                    <input type="button" className="button" value="Edit"  onClick={this.edit}/><br/>
                    <input type="button" className="button" value="Download" onClick={this.html2PDF} /><br/>  
                    <input type="submit" className="button" value="Save" />
                    </div>
                    <p style={{color:"red"}}>** Note: please make sure there is one line gap between each paragraph.</p>
                </form>    
            </div>
        )
    }
    
}

export default AddRule;
