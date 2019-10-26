import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import Getdate from '../../../func/getdate';
import axios from 'axios'


export class ReportNotTodo extends Component {

    state = {
        kidId: "",
        nottodolists: [],
        title: '',
        points: 0
    }

    change = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    submit = (e) => {
        e.preventDefault();
        const nottodo = {
            title: this.state.title,
            points: this.state.points,
            kidname: this.props.name,
            kidid: this.props.kid,
            date: this.props.pickdate,
        }
        this.setState({ nottodolists: [...this.state.nottodolists, nottodo] })
    }

    delete = (id) => {
        const update = this.state.nottodolists.filter((nottodo, index) => {
            return index !== id
        })
        this.setState({ nottodolists: update })
    }

    save = () => {

        if (this.props.kid === 'Your Kids:') {
            this.setState({ message: "Please make sure you pick your kids name first before you save the list." });
            setTimeout(() => (this.setState({ message: '' })), 2000);
        } else if (this.state.nottodolists.length === 0) {
            alert('There are nothing to save')
        } else {
            axios.post('/api/nottodo/' + this.props.kid,{nottodolists:this.state.nottodolists})
                .then((res) => {
                    this.setState({
                        nottodolists: [],
                        message: "Report has been updated"
                    })
                })
                    .catch ((err) => { throw err })
        }
    }

    close = () => {
        this.setState({
            nottodolists: []});
        this.props.close();
    }
    render() {
        return (
            <div className="page_reportnottodo">
                <button className="search_button" onClick={this.save}><FontAwesomeIcon icon={faSave} size="1x" style={{ marginRight: "15px", verticalAlign: "center" }} />Save</button>
                <button className="search_button" onClick={this.close}><FontAwesomeIcon icon={faWindowClose} size="1x" style={{ marginRight: "15px", verticalAlign: "center" }} />Close</button>
                <p className="report_name_date">
                    <span>{this.props.name}</span>
                    <span>{Getdate(this.props.pickdate)}</span>
                </p><hr />
                <div className="msg">{this.state.message}</div>
                <div><ul>{this.state.nottodolists.map((nottodo, index) => (
                    <li key={index}>{index + 1}.&nbsp;{nottodo.title}<span style={{ color: "red", marginLeft: "10px" }}>{nottodo.points}</span><button className="delete" onClick={() => this.delete(index)}>X</button></li>
                ))}</ul></div>
                <form className="form1" onSubmit={this.submit}>
                    Title: <input type="text" name="title" value={this.state.title} onChange={this.change} /> Minus Points:<input type="Number" max="0" value={this.state.points} name="points" onChange={this.change} />
                    <input type="submit" value="submit" />
                </form>


            </div>
        )
    }
}

export default ReportNotTodo
