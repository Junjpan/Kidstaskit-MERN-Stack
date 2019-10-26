import React, { Component } from 'react';

class Addtodo extends Component {
    //usually if you have a field input, you need a state in this component
    state = {
            title: '',
            points: 0,
            time:0
    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.addTodo(this.state.title,this.state.points,this.state.time);      
        this.setState({
                title: "",
        })
    }

    submitTodo = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
        
    }



    render() {
        return (
            <div style={{ background: "rgb(48, 78, 122)", paddingBottom: "15px" }}>
                <form className="form_addtodo" onSubmit={this.submitForm} >
                    <label htmlFor="title" style={{ flex: "1", color: "white" ,fontSize:"20px"}}>Add To Do:&nbsp;</label>
                    <input name="title" id="title" type="text" style={{ flex: "2" }}
                        value={this.state.title} onChange={this.submitTodo}
                    ></input>
                    <label htmlFor="time" style={{ flex: "1", color: "white",fontSize:"20px" }}>Durations(mins):&nbsp;</label>
                    <input name="time" id="time" type="Number" style={{ flex: "1" }}
                        value={this.state.number} onChange={this.submitTodo}
                    ></input>
                    <label htmlFor="points" style={{ flex: "1", color: "white" ,fontSize:"20px"}}>Points:&nbsp;</label>
                    <input name="points" id="points" type="Number" style={{ flex: "1" }}
                        value={this.state.number} onChange={this.submitTodo}
                    ></input>
                    <input type="submit" value="Submit" style={{ flex: "1" }}></input>
                </form>
            </div>
        )
    }
}

export default Addtodo
