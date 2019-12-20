import React, { Component } from 'react';
import '../App.css';
import LineChart from 'react-linechart';
import '../../node_modules/react-linechart/dist/styles.css';
import * as d3 from "d3";

// Graph component displays closes given a ticker from the user
class Graph extends Component {
    constructor(props) {
        super(props);
        // retrieves previous state or sets new state to ''
        this.state = {
            graphData: [],
            userTickerInput: localStorage.getItem('userTickerInput') || ''
        }
        // binds methods to constructor
        this.handleGraphButton = this.handleGraphButton.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);

        //paints previous graph
        this.handleGraphButton();
    }

    //fetches data from python server (http://127.0.0.1:5000/price_timeseries/{ticker_name})
    handleGraphButton() {
        let ticker = this.state.userTickerInput.toUpperCase().trim();
        console.log(`http://127.0.0.1:5000/price_timeseries/${ticker}`)
        fetch(`http://127.0.0.1:5000/price_timeseries/${ticker}`)
            .then(data => data.json())
            .then(data => {
                this.setState(
                    {graphData: data.map(date => { return { x: date.tradedate, y: date.close } }) } 
                )
            })
    }

    handleUserInput(event) {
        this.setState({ userTickerInput: event.target.value });
        localStorage.setItem('userTickerInput', event.target.value);
    }

    render() {
        const data = [
            {
                color: "steelblue",
                points: this.state.graphData
            }
        ];
        return (
            <div className="App">
                <div>
                    <div className="App">
                        <h1>Graph of Price at Close vs Trade Date</h1>
                        <LineChart
                            width={900}
                            height={400}
                            data={data}
                            isDate={true}
                            xLabel="Trade Date"
                            yLabel="Price at Close"
                            xDisplay={d3.time.format("%b %Y")}
                        />
                    </div>
                </div>
                <input value={this.state.userTickerInput} onChange={this.handleUserInput}></input>
                <button onClick={this.handleGraphButton}>Graph</button>
            </div>
        )
    }
}

export default Graph;