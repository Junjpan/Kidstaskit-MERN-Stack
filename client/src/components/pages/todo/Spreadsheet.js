import React, { Component } from 'react';
import axios from 'axios';



class Spreadsheet extends Component {
    state={message:""};

    getStyle = () => {
        return {
            display: this.props.todoInfo.finish ? "block" : "none",
            width: "40%",
            margin: "auto",
            background:"white"
        }
    }

    getOuterStyle = () => {
        return {
            display: this.props.todoInfo.finish ? "block" : "none",
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
            zIndex: "2",
        }
    }

    getTime = () => {
        const { date } = this.props.todoInfo;
        const month = date.getMonth()+1;
        const year = date.getFullYear();
        const day = date.getDate();
        return `${month}/${day}/${year}`
    }

    cancel=()=>{
        this.props.cancel("cancel");
    }

    save=()=>{
        var {kid,kidId,todos,date}=this.props.todoInfo;  
        const todoinfo={
            kidname:kid,
            todo:todos,
            date:date,
        };
        if(kid===''){
         alert('Please make sure you pick your kids name first before you save the list.')
         this.cancel();
        }else if(todos.length===0){
         alert('Please enter at least one todo list.')
         this.cancel();
        }else{
        //console.log(todoinfo)
      axios.post('/api/todo/'+kidId,todoinfo)
           .then((res)=>{   
            this.setState({message:res.data});
            setTimeout(()=>{this.setState({message:''});
                           this.props.cancel("save")},2000)//close the spreadsheet and clean the todo list
        })
            .catch((err)=>{throw err})
    }
    }

    render() {
        return (
            <div style={this.getOuterStyle()}>
                <div style={this.getStyle()} className="spreadsheet">
                    <h4>ToDo List For {this.props.todoInfo.kid} </h4> <span>{this.getTime()}</span>
                    <div className="msg">{this.state.message}</div>
                    <table>
                        <tbody>
                            <tr>
                                <th>No.</th>
                                <th>Description</th>
                                <th>Duration</th>
                                <th>Points</th>
                            </tr>
                            {this.props.todoInfo.todos.map((todo, index) => {
                                return (<tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{todo.title}</td>
                                    <td>{todo.time}</td>
                                    <td>{todo.points}</td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                    <button onClick={this.cancel}>Cancel</button>
                    <button onClick={this.save}>Save</button>
                </div>
            </div>
        )
    }
}

export default Spreadsheet
