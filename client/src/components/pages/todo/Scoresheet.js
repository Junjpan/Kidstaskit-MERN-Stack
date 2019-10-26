import React, { Component } from 'react';
import axios from 'axios';



class Scoresheet extends Component {
    state={message:""};

    getStyle = () => {
        return {
            display: this.props.todoInfo.finish ? "block" : "none",
            width: "50%",
            margin: "auto",
            background:"white"
        }
    }

    getOuterStyle = () => {
        return {
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

    //kid update and save the todo list 
    save=()=>{
        var {todos}=this.props.todoInfo;          
     //  console.log(todos)
      axios.put('/api/todo/kid',{todos:todos})
           .then((res)=>{
            this.setState({message:res.data});
            setTimeout(()=>{this.props.cancel("save")},2000)
        })
            .catch((err)=>{throw err})
    }

    render() {
        return (
            <div style={this.getOuterStyle()}>
                <div style={this.getStyle()} className="spreadsheet">
                    <h4>Report For {this.props.todoInfo.loginkid} </h4> <span>{this.getTime()}</span>
                    <div className="msg">{this.state.message}</div>
                    <table>
                        <tbody>
                            <tr>
                                <th>No.</th>
                                <th>Description</th>
                                <th>Target Time(mins)</th>
                                <th>Total of finish(mins)</th>
                                <th>Full Score</th>
                                <th>Earned Score</th>
                                <th>Completed</th>
                            </tr>
                            {this.props.todoInfo.todos.map((todo, index) => {
                                return (<tr key={index} >
                                    <td>{index + 1}</td>
                                    <td>{todo.title}</td>
                                    <td>{todo.time}</td>
                                    <td>{todo.finishtime}</td>
                                    <td>{todo.points}</td>
                                    <td>{parseInt(todo.finishtime/todo.time*todo.points)}</td>
                                    <td>{todo.completed?"Yes":"No"}</td>
                                </tr>
                              )
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

export default Scoresheet
