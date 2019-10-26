import React, { Component } from 'react';
import * as d3 from 'd3';

export class BarChart extends Component {
    state={
        nottodo:[],
        kidid:''
    }
   
   componentDidUpdate(){
       //console.log(this.props)
       this.createBarChart(this.props.todo);
   }
 
    createBarChart=(todo)=>{
        //console.log(todo)
        
        const svg = d3.select(this.refs.d3div)
            .style("background-color", "gray")
            .append('text')
            .attr('x', "5%")
            .attr("y", "5%")
            .text(`Behavior Progression Bar in the past 30 days`);
            const group=svg.append('g')
                  .attr("transform","translate(20,0)") 
                  
                  var length=todo.length-1;
                  var min=todo[length]._id
                  var minDate=`${min.month}/${min.dayOfMonth}/${min.year}`;
                  console.log(minDate)  

    }

    render() {


        return (
            <svg ref="d3div" width="80%" height="80%" style={{ border: "1px solid white", color: "black", marginTop: "3%", marginRight: "25px", padding: "15px", float: "right" }} >

            </svg>
        )
    }
}

export default BarChart
