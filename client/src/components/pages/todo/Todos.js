import React, { Component } from 'react';
import image from '../../../assets/kidwithabook.jpg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Addtodo from './Addtodo';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Spreadsheet from './Spreadsheet';
import Scoresheet from './Scoresheet';
import axios from 'axios';
//to be able to use fontawesome, you need to  install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons & @fortawesome/fontawesome-svg-core


/** using function to receive props,thru the function, you don't need "this"
const Todos = (props) => {
    return (
        <div>
            <h2 className="subtitle">To Do List</h2>
            <div className="normal">
                <p>{props.todo}</p>
            </div>
        </div>
    )
}
**/
class Todos extends Component {
    state = {
        kids: [],
        kidsId: [],
        todos: [],
        kidId: '',
        kidslogin: false,
        parentslogin: false,
        kid: "",
        loginkid: "",
        loginkidid: "",
        finish: false,
        date: new Date(),
        message: "",
        kidmsg: "Welcome back! Happy to see you again, pick the date and use import button to retrieve the todo list your parents made for you, The more you finish, the more points you can gain. Don't forget to mark the completed box once you finish the job. Of course, watch out the not todo list, they can minus your points. You can run the report all the times in the report center. Find out how many points you make at the end of the month, Your parents may have some surprise for you :)."
    }


    componentDidMount() {
        const props = this.props.info;
        //console.log(this.props.info)
        this.setState({
            kids: props.kidsArray,
            kidsId: props.kidsId,
            kidslogin: props.kidslogin,
            parentslogin: props.parentslogin,
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

    pickKid = (e) => {
        e.preventDefault();
        this.setState({
            kidId: e.target.value.split('&')[0],
            kid: e.target.value.split('&')[1],
        })
    }

    //change calendar
    handleChange = (newdate) => {
        this.setState({ date: newdate })
    }

    markComplete = (id) => {
        //console.log(id)
        this.setState({
            todos: this.state.todos.map((todo, index) => {
                if (index === id) {
                    todo.completed = !todo.completed;
                }
                return todo;
            }
            )
        })
    }

    delete = (id) => {
        this.setState({
            todos: this.state.todos.filter((todo, index) => {
                return (index !== id)
            })
        })
    }

    //never recommended to mutate the state directly in React,(such as, don't using push)
    async addTodo(title, points, time) {
       // console.log(title, points)
        var newtodo = {
            title: title,
            completed: false,
            points: points,
            time: time
        }
        await this.setState({
            todos: [...this.state.todos, newtodo]
        })

    }
    //finish submitting todo list//or kids finish the to do list
    finish = () => {
        this.setState({
            finish: true
        })
    }
    // import old todo list with certain date-parent
    import = () => {
        let id = "";
        const { date, kidId, loginkidid, kidslogin } = this.state;
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        const newdate = `${month}/${day}/${year}`;
        //console.log(newdate);
        if (this.state.kidslogin === true) {
            id = loginkidid
        } else {
            id = kidId
        }
        // console.log(id)
        axios.get(`/api/todo/search?date=${newdate}&kidId=${id}&kidslogin=${kidslogin}`)
            .then((res) => {
                this.setState({ todos: res.data.todos })
            })
            .catch((err) => {
                this.setState({ message: err.response.data });
                setTimeout(() => { this.setState({ message: '' }) }, 2000)
            })

    }

    //import todo list-Kid import

    cancel = (info) => {
        if (info === "cancel") {
            this.setState({ finish: false })
        } else if (info === "save") {
            this.setState({
                finish: false,
                todos: []
            })
        }
    }
    kidinput = (e, id) => {
        e.preventDefault();
        const value = e.target.value
        // console.log(value,index);
        this.setState({
            todos: this.state.todos.map((todo, index) => {
                if (index === id) {
                    todo.finishtime = value;
                }
                return todo;
            }
            )
        })
    }

    imageStyle = {
        width: "150px",
        height: "250px",
        border: "0px"
    };

    kidslogin = () => {
        return (
            <div>
                {this.state.finish ? <Scoresheet todoInfo={this.state} cancel={this.cancel} /> : <br />}
                <p style={{ textAlign: "left", marginLeft: "10%" }}>{this.state.loginkid},</p>
                <div className="msg" style={{ fontSize: "15px", width: "70%", textAlign: "left", color: "#004d4d", margin: "auto" }}>{this.state.kidmsg}</div>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div className="todoBackground" >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h2 className="subtitle" style={{ fontSize: "30px" }}>Kids To Do List</h2>
                            <div style={{ margin: "5px" }}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "white", marginRight: "10px", verticalAlign: "bottom" }} />
                                <DatePicker className="calendar" selected={this.state.date} onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="msg" style={{ fontSize: "15px" }}>{this.state.message}</div>
                        <div className="normal">
                            {this.state.todos.map((todo, index) => {
                                return (
                                    <div key={index}>{index + 1}.&nbsp;{todo.title} for {todo.time}&nbsp;mins&nbsp;&nbsp;&nbsp;+{todo.points}&nbsp;&nbsp;points
                                   <br />
                                        <div style={{ color: "rgb(48, 78, 122)" }}>You did <input type="number" onChange={(e) => this.kidinput(e, index)} defaultValue={todo.finishtime} />mins so far.</div>
                                        <div >Completed:<input type="checkbox" onChange={() => this.markComplete(index)} /></div>
                                        <hr />
                                    </div>
                                )
                            })}
                        </div>
                        <button className="normal" style={{ color: "#074061" }} onClick={this.finish}>Done</button>
                        <button className="normal" style={{ color: "green", marginLeft: "10px" }} onClick={this.import}>Import</button>
                    </div>
                    <div>
                        <img src={image} alt="pics" style={this.imageStyle}></img>
                    </div>
                </div>
            </div>
        )
    }


    render() {


        const btn = {
            background: "red",
            color: "white",
            borderRadius: "50%",
            border: "none",
            padding: "1px 3px",
            cursor: "pointer",
            float: "right",
        };
        if (this.state.kidslogin === true) {
            return this.kidslogin()
        } else {
            //when you are calling the function in the render, you have to use arrow function, otherwise you will have maximum update depth exceeded error
            return (
                <div>
                    <Addtodo addTodo={this.addTodo.bind(this)} />
                    <Spreadsheet todoInfo={this.state} cancel={this.cancel} />
                    <p className="normal" style={{ color: "red", fontSize: "15px" }}>**Please make sure pick you kid's name first before set up the to do list or import the old list!</p>
                    <p className="normal" style={{ color: "red", fontSize: "15px" }}>**You can pick the date and use import button to import the old to do list as your current to do list and edit it.</p>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <div className="todoBackground" >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h2 className="subtitle" style={{ fontSize: "30px" }}>Kids To do List</h2>
                                <div style={{ margin: "5px" }}>
                                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "white", marginRight: "10px", verticalAlign: "bottom" }} />
                                    <DatePicker className="calendar" selected={this.state.date} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="msg" style={{ fontSize: "15px" }}>{this.state.message}</div>
                            <div className="normal">

                                {this.state.todos.map((todo, index) => {
                                    return (<p key={index}>{index + 1}.&nbsp;{todo.title} for {todo.time}&nbsp;mins&nbsp;&nbsp;&nbsp;+{todo.points}&nbsp;&nbsp;points
                                   <button style={btn} onClick={() => this.delete(index)}>X</button></p>)
                                })}
                            </div>
                            <button className="normal" style={{ color: "#074061" }} onClick={this.finish}>Finish</button>
                            <button className="normal" style={{ color: "green", marginLeft: "10px" }} onClick={this.import}>Import</button>
                        </div>
                        <div>
                            <div style={{ margin: "10px" }}>
                                <select name="kid" className='kidlist' onChange={this.pickKid}>
                                    <option>Your Kids:</option>
                                    {this.state.kids.map((kid, index) => {
                                        return <option key={index} value={this.state.kidsId[index] + '&' + kid}>{kid}</option>
                                    })}</select>
                            </div>
                            <img src={image} alt="pics" style={this.imageStyle}></img>
                        </div>
                    </div>
                </div>
            )
        }
    }
}



export default Todos;



