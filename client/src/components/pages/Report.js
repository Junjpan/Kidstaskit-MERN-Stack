import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/JunEBug.png';
import image from '../../assets/kidclimbingrope.jpg';
import { Motion, spring } from "react-motion";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from './Pagination';
import axios from 'axios';
import getdate from '../../func/getdate';
import minDateandMaxDate from '../../func/minDateandMaxDate';
import Details from './report/Details';
import Total from './report/Total';
import * as d3 from 'd3';



export class Report extends Component {
    state = {
        kids: [],
        kidsId: [],
        kid: "",
        kidId: '',
        kidslogin: false,
        parentslogin: false,
        loginkid: "",
        loginkidid: "",
        kidPanel: false,
        searchPanel: false,
        nottodoPanel: false,
        d3Panel: false,
        startdate: new Date(),
        enddate: new Date(),
        results: [],
        nottodosresults: [],
        todo30daysresult: [],
        nottodo30dayresult: [],
        searchStatus: false,
        sum: 0,
        nottodosum: 0,
        shoppingsum: 0,
        todoallscores: 0,
        nottodoallscores: 0,
        currentpage: 1,
    }

    componentDidMount() {
        const props = this.props.info;
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

    //toggle kid panel
    toggle = () => {
        this.setState({ kidPanel: !this.state.kidPanel })
    }
    // toggle search panel
    toggleSearch = () => {
        this.setState({ searchPanel: !this.state.searchPanel })
    }

    //toggle nottodo pannel
    nottodo = () => {
        this.setState({ nottodoPanel: true })
    }
    //change startdate
    handleChangeStartDate = (startdate) => {
        this.setState({ startdate: startdate })
    }
    //change endate
    handleChangeEndDate = (enddate) => {
        this.setState({ enddate: enddate })
    }

    //change kidId' state
    clickOnKid = (id, kid) => {
        this.setState({
            kidId: id,
            kid: kid
        })
    }

    stopMsg = () => {
        setTimeout(() => { this.setState({ message: '' }) }, 2000)
    }

    //close nottodo panel
    closeNottodo = () => {
        this.setState({ nottodoPanel: false })
    }

    //open d3 panel
    d3Panel = () => {
        const { kidId } = this.state;
        if (kidId === '') {
            this.setState({ message: "You haven't selected your child's name." });
            this.stopMsg();
        } else {
            this.setState({ d3Panel: true })
        }

    }
    //close d3 panel
    closeD3Panel = () => {
        this.setState({ d3Panel: false, })
        const node = this.node
        const svg = d3.select(node)
        svg.text('')//clear out all the inner text and keep the attributes
    }
    // get total of todoscore for the picked kidid
    getSum = (id) => {
        axios.get('/api/todo/kid/' + id)
            .then((res) => {
                this.setState({ todoallscores: res.data.total })
            })
            .catch((err) => {
                throw err
            })

    }

    getNottodoSum = (id) => {
        axios.get('/api/nottodo/kid/' + id)
            .then((res) => {
                this.setState({ nottodoallscores: res.data.total })
            })
            .catch((err) => {
                throw err
            })

    }
    //get total of spent in shopping
    getShoppingSum = (id) => {
        axios.get('/api/shopping/kid/' + id)
            .then((res) => {
                this.setState({ shoppingsum: res.data.total })
            })
            .catch((err) => {
                throw err
            })
    }

    //search basedon id/startdate/enddate
    search = () => {
        this.setState({ searchStatus: true })
        const { kidId, startdate, enddate } = this.state;
        if (kidId === "") {
            this.setState({ message: "You haven't selected your child's name." });
        } else {
            this.getSum(kidId);
            this.getNottodoSum(kidId);
            this.getShoppingSum(kidId);
            axios.get(`/api/report/${kidId}?startdate=${startdate}&enddate=${enddate}`)
                .then((res) => {
                    //console.log(res.data);
                    var sum = 0, minussum = 0;
                    for (var i = 0; i < res.data.todos.length; i++) {
                        sum += res.data.todos[i].score
                    }
                    for (var j = 0; j < res.data.nottodos.length; j++) {
                        minussum += res.data.nottodos[j].points
                    }
                    this.setState({
                        results: res.data.todos,
                        nottodosresults: res.data.nottodos,
                        sum: sum,
                        nottodosum: minussum
                    })
                })
                .catch((err) => {
                    this.setState({ message: err.response.data })
                })
        }
        this.stopMsg();
    }

    //check todo score in the past 30 days
    d3todoview = async () => {
        const node = this.node
        const svg = d3.select(node)
        svg.text('')
        let res = await axios.get('/api/todo/30days/' + this.state.kidId);
        let { data } = res
        this.setState({ todo30daysresult: data })
        this.BarChart()
    }

    d3nottodoview = () => {
        const node = this.node;
        const svg = d3.select(node);
        svg.text('');//clear the svg page 
        axios.get('/api/nottodo/30days/' + this.state.kidId)
            .then((res) => {//this.setState({nottodo30dayresult:res.data}),
                this.nottodoBarChart(res.data)
            })
            .catch((err) => { throw err })

    }

    BarChart = () => {
        // console.log(this.state.todo30daysresult)
        const node = this.node
        const svg = d3.select(node)
            .style("background-color", "white")
        svg.append('text')
            .attr('x', "5%")
            .attr("y", "5%")
            .text(`${this.state.kid} Behavior Progression Bar for the last 30 days`);
        const yGroup = svg.append('g')
            .attr("transform", "translate(50,50)") //set the yaxis starting location
        const xGroup = svg.append('g')
            .attr("transform", "translate(50,450)"); //set the xaxis starting locaiton
        var newArray = this.state.todo30daysresult.map((a) => {
            return a._id = new Date(`${a._id.month}/${a._id.dayOfMonth}/${a._id.year}`)
        })//use map also mutate the state of todo30daysresult
        var minDate = minDateandMaxDate(newArray).minD;
        var { daysapart } = minDateandMaxDate(newArray)
        var tooltip = d3.select("body").append("div")
            .attr("id", "tooltip");
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.state.todo30daysresult, (d) => d.total)])
            .range([400, 0])
        const yAxis = d3.axisLeft(yScale);
        const xScale = d3.scaleTime()
            .domain([new Date(minDate), new Date()])
            .range([0, 800]);

        const xAxis = d3.axisBottom(xScale);
        xGroup.call(xAxis);
        yGroup.call(yAxis);
        // console.log(xScale(new Date()),xScale(new Date("Oct/14/2019")));  

        function mouseOver(d) {
            d3.select(this)
                .style("opacity", 0.3);
            tooltip.style("display", "block")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY) + "px")
                .html(`<p>${d.total} points</p><p>${d._id.toString().substr(0, 15)}`);
        }

        function mouseOut(d) {
            d3.select(this)
                .style("opacity", 1)
            tooltip.style("display", "none")
        }

        const width = this.state.todo30daysresult.length <= 3 ? 80 : 800 / daysapart + 2;
        yGroup.selectAll("rect")
            .data(this.state.todo30daysresult)
            .enter()
            .append('rect')
            .attr('x', (d) => { return xScale(new Date(`${d._id}`)) })
            .attr('y', (d) => { return yScale(d.total) })
            .attr("width", width)
            .attr("height", (d) => { return 400 - yScale(d.total) })
            .attr("fill", "#00bfff")
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)

        yGroup.selectAll('.number')
            .data(this.state.todo30daysresult)
            .enter()
            .append("text")
            .attr("class", "number")
            .attr("fill", "red")
            .attr('x', (d) => { return xScale(new Date(`${d._id}`)) + 20 })
            .attr('y', (d) => { return yScale(d.total) })
            .text((d) => d.total)
    }

    nottodoBarChart = (items) => {
        this.setState({ nottodo30dayresult: items })
        var newItems = this.state.nottodo30dayresult.map((item => {
            return item._id = new Date(`${item._id.month}/${item._id.dayOfMonth}/${item._id.year}`);
        }));
        //console.log(newItems,this.state.nottodo30dayresult);
        const node = this.node;
        const svg = d3.select(node)
            .style("background", "black")
        const xGroup = svg.append('g')
            .attr("transform", "translate(50,50)");
        const yGroup = svg.append('g')
            .attr("transform", "translate(50,50)");
        svg.append('text')
            .attr("x", "75%")
            .attr("y", "90%")
            .text(`${this.state.kid}'s Complaint Report`)
            .style('fill', "white")

        const minDate = d3.min(newItems);
        const minVal = d3.min(this.state.nottodo30dayresult, (d) => d.total)
        const xScale = d3.scaleTime()
            .domain([new Date(minDate), new Date()])
            .range([0, 800])
        var xAxis = d3.axisTop(xScale)
        const yScale = d3.scaleLinear()
            .domain([minVal, 0])
            .range([400, 0])
        xGroup.call(xAxis);
        yGroup.call(d3.axisLeft(yScale));

        //create a line generator
        var line = d3.line() //the path is follow the database sequence
            .x((d) => { return xScale(d._id) })
            .y((d) => { return yScale(d.total) })
            .curve(d3.curveNatural)
        //call the line generator
        function mouseOver(d) {
            d3.select(this)
                .attr("r", 50)
                .style("opacity", 0.5)

        }

        function mouseOut(d) {
            d3.select(this)
                .attr("r", 5)
                .style("opacity", 1)
        }
        this.state.nottodo30dayresult.sort((a, b) => {
            return a._id - b._id
        })//sort the state's date and the state got automatically updated
        yGroup.append('path')
            .datum(this.state.nottodo30dayresult)
            .attr("class", "line")
            .attr("d", line) //call the line generator

        yGroup.selectAll(".dot")
            .data(this.state.nottodo30dayresult)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr('cx', (d) => { return xScale(d._id) })
            .attr('cy', (d) => { return yScale(d.total) })
            .attr('r', 5)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)

        yGroup.selectAll(".number")
            .data(this.state.nottodo30dayresult)
            .enter()
            .append("text")
            .attr("class", "number")
            .attr('x', (d) => { return (xScale(d._id)+30)})
            .attr('y', (d) => { return yScale(d.total) })
            .text((d) => d.total)


        //style the line/path/text
        svg.selectAll('line')
            .style("stroke", "red")
        svg.selectAll('path')
            .style('stroke', "red")
        svg.selectAll('text')
            .style("fill", "white")

    }

    paginate = (num) => {
        this.setState({ currentpage: num })
    }


    report_kidlist = {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        height: "120vh",
        width: "350px",
        background: "rgb(79, 98, 151)",
        zIndex: "2",

    }

    report_search = {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "350px",
        height: "120vh",
        width: "600px",
        background: "black",
        zIndex: "4",
    }

    report_nottodo = {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "950px",
        height: "120vh",
        width: "650px",
        background: "black",
        zIndex: "4",
    }

    d3style = {
        position: "absolute",
        top: "0",
        left: "0",
        height: "80%",
        width: "100%",
        background: "#697874",
        zIndex: "6",
    }
    render() {
        const indexofLastPagelist = this.state.currentpage * 10;
        const indexofFirstPageList = indexofLastPagelist - 10;
        const currentPageList = this.state.results.slice(indexofFirstPageList, indexofLastPagelist);
        const currentNottodoPageList = this.state.nottodosresults.slice(indexofFirstPageList, indexofLastPagelist)
        const max = Math.ceil(this.state.results.length / 10);
        const nottodomax = Math.ceil(this.state.nottodosresults.length / 10);
        // console.log(max)

        return (
            <div style={{ background: "lightblue", height: "100vh" }}>
                <br />
                <br />
                <div className="msg" style={{ marginRight: "20px" }}>{this.state.message}</div>
                <h1 className="title" style={{ color: "black" }}>Report Center</h1>
                <div style={{ float: "right", width: "300px" }}>
                    <button className="report_button" onClick={this.toggle}>Toggle Kid's Panel</button>
                    <button className="report_search_button" onClick={this.toggleSearch}>Toggle Search Panel</button>
                    <div>
                        <h3 className="subtitle" style={{ float: "left" }}>SUMMARY for <span style={{ color: "black" }}>{this.state.kid}:</span> </h3><br /><br />
                        {this.state.searchStatus === true ? (<div className="data_details"><Details details={this.state} /><Total todosum={this.state.todoallscores} nottodosum={this.state.nottodoallscores} shoppingsum={this.state.shoppingsum} /></div>) : null}
                    </div>
                </div>
                <div className="content">
                    <Motion style={{ x: spring(this.state.kidPanel ? 0 : -100), opacity: spring(this.state.kidPanel ? 1 : 0) }}>
                        {(currentStyles) => (
                            <div style={{ ...this.report_kidlist, transform: `translate3d(${currentStyles.x}%,0,0)`, opacity: currentStyles.opacity }}>
                                <img src={logo} alt="logo" className='report_img' ></img>
                                <br />
                                <ul>
                                    {this.state.kids.map((kid, index) => {
                                        return (<li className="report_li" key={index}><Link to={`/report/${this.state.kidsId[index]}`} className="link" onClick={() => this.clickOnKid(this.state.kidsId[index], kid)}>{kid}</Link></li>)
                                    })}
                                </ul>
                                <p className="normal" style={{ color: "white", fontSize: "15px", width: "300px", margin: "auto", }}>**Please click your child's name even if you only have one kid.</p>
                            </div>
                        )}
                    </Motion>
                    <Motion style={{ y: spring(this.state.searchPanel ? 0 : -100), opacity: spring(this.state.searchPanel ? 1 : 0) }}>
                        {(currentStyles) => (
                            <div style={{ ...this.report_search, transform: `translate3d(0,${currentStyles.y}%,0)`, opacity: currentStyles.opacity }}>
                                <img src={image} alt="kid_image" className='report_img2' ></img>
                                <br />
                                <div className="search">
                                    <label>Search By Date:</label>
                                    <button className="search_button" onClick={this.search}><FontAwesomeIcon icon={faSearch} size="1x" style={{ color: "white", marginRight: "15px", verticalAlign: "center" }} />Search</button>
                                    <button className="search_button" onClick={this.nottodo}><FontAwesomeIcon icon={faThumbsDown} size="1x" style={{ color: "red", marginRight: "15px", verticalAlign: "center" }} />Include Nottodo</button><br />
                                    <span>Start With:&nbsp;</span><DatePicker className="calendar" selected={this.state.startdate} onChange={this.handleChangeStartDate} />
                                    <span>End with: &nbsp;</span><DatePicker className="calendar" selected={this.state.enddate} onChange={this.handleChangeEndDate} />
                                </div>
                                <hr />
                                <button onClick={this.d3Panel}>Visualize Data with a Bar Chart</button>
                                <p style={{ color: "red", marginLeft: "10px", textAlign: "center", fontSize: "15px" }}>**Note: data is only comparable for the last 30 days</p>
                            </div>
                        )}
                    </Motion>
                    <Motion style={{ y: spring(this.state.nottodoPanel ? 0 : -100), opacity: spring(this.state.nottodoPanel ? 1 : 0) }}>
                        {(currentStyles) => (
                            <div style={{ ...this.report_nottodo, transform: `translate3d(0,${currentStyles.y}%,0)`, opacity: currentStyles.opacity }} >
                                <div className="report_nottodo">
                                    <div>
                                        <button onClick={this.closeNottodo}>Close</button>
                                        <label style={{ marginTop: "80px" }}>Report of not to do:</label>
                                    </div>
                                    <p className="note">Note: In order to receive the report of not to do, select the child's name and day of which you want your report. Then Click Search button.</p>
                                    <div>{currentNottodoPageList.map((nottodo, index) => {
                                        return (<div key={index}><p>{index + 1}.&nbsp;<span>{getdate(nottodo.date)}</span>&nbsp;{nottodo.title}&nbsp;<span style={{ color: 'red' }}>{nottodo.points} points</span></p><hr /></div>)
                                    })}</div>
                                </div>
                                {this.state.currentpage === nottodomax ? (<div>You have lost <span style={{ color: "red" }}>{this.state.nottodosum}</span> points in total.</div>) : null}
                                <Pagination totallist={this.state.nottodosresults.length} paginate={this.paginate} />
                            </div>
                        )}
                    </Motion>
                    <Motion style={{ y: spring(this.state.d3Panel ? 0 : -100), opacity: spring(this.state.d3Panel ? 1 : 0) }}>
                        {(currentStyles => (
                            <div style={{ ...this.d3style, transform: `translate3d(0,${currentStyles.y}%,0)`, opacity: currentStyles.opacity }}>
                                <button className="d3_button" onClick={this.closeD3Panel} style={{ width: "200px", marginLeft: "20px", top: "50px", position: 'absolute' }}>Close</button>
                                <button className="d3_button" onClick={this.d3todoview} style={{ width: "200px", background: "black", marginLeft: "20px", top: "150px", position: 'absolute' }}>To Do Score</button>
                                <button className="d3_button" onClick={this.d3nottodoview} style={{ width: "200px", background: "red", marginLeft: "20px", top: "250px", position: 'absolute' }}>Not To Do Score</button>
                                <p style={{ fontSize: "30px", marginLeft: "20px", top: "350px", position: 'absolute' }}>{this.state.kid}</p>
                                <svg ref={node => this.node = node} width="70%" height="80%" style={{ border: "1px solid white", color: "black", marginTop: "3%", marginRight: "25px", padding: "15px", float: "right" }} ></svg>
                            </div>// this.node is set in the ref property of the svg element and acs as a reference to the actual DOM node generated by React, so you  can hand that DOM node over to your D3 functionality
                        ))}
                    </Motion>
                    {this.state.searchStatus ? (//only show the search result when the seach button was clicked.
                        <div className="report"><table>
                            <tbody>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Target Time</th>
                                    <th>Finished Time</th>
                                    <th>Target Points</th>
                                    <th>Score</th>
                                    <th>Completed</th>
                                </tr>
                                {currentPageList.map((result, index) => {
                                    return (<tr key={index}>
                                        <td>{getdate(result.date)}</td>
                                        <td>{result.title}</td>
                                        <td>{result.time}</td>
                                        <td>{result.finishtime}</td>
                                        <td>{result.points}</td>
                                        <td>{result.score}</td>
                                        <td>{result.completed ? "Yes" : "No"}</td>
                                    </tr>)
                                })}
                                {this.state.currentpage === max ? <tr style={{ color: "red", fontWeight: "bold" }}><td>Total Earned Score</td><td>{this.state.sum}</td></tr> : null}
                            </tbody>
                        </table></div>) : ''}
                    <Pagination totallist={this.state.results.length} paginate={this.paginate} />
                </div>
            </div>
        )
    }
}

export default Report

