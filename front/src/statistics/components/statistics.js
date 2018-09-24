import React from 'react'
import {strings} from "../../localization/strings";
import moment from 'moment';
import {connect} from "react-redux";
import { createStructuredSelector } from 'reselect';
import {updateStatistic} from "../actions";
import {getGrowth, getRecordInfo} from "../selectors";
import {Line, Pie, Scatter} from "react-chartjs-2";
import {openMessageDialog} from "../../messageDialog/actions";
import {isAuthInfoPresent} from "../../utils/db";

let options= {
    responsive: true,
    title: {
        display: true,
        text: "Crecimiento"
    },
    tooltips: {
        mode: 'index',
        intersect: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: "Mes - Año"
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: "Cantidad"
            }
        }]
    }
};

let inputContainerStyles = {textAlign:"center",width:"100%",margin:"15px 0"};

class Statistics extends React.Component {

    // handleSearchButtonClick = (type) => {
    //     this.props.dispatch(updateStatistic({type:type}));
    // };
    //
    // componentDidMount(){
    //     this.props.dispatch(updateStatistic({type:"recordInfo"}));
    //     this.props.dispatch(updateStatistic({type:"growth"}));
    //
    // }

    getGrowthLineGraph = () =>{

        let data={
            labels: [12,5,3,2,5,7,8,24],

            datasets: [
                {
                    label: "Crecimiento",
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    fill:true,
                    data: [45,5,3,2,5,7,8,24]
                }
            ]
        };

        return <Line
            data={data}
            height={200}
            options={options}
        />
    };

    getRecordInfoPieGraph = () =>{
        let data={
            labels: [255,5,3,2,5,7,8,24],

            datasets: [
                {
                    label: "Crecimiento",
                    borderWidth: 1,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    borderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBorderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    fill:true,
                    data: [34,5,3,2,5,7,8,24]
                }
            ]
        };

        return <Pie
            data={data}
            height={200}
        />
    };

    getRecordInfoScatterGraph = () =>{
        if(!this.props.recordInfo)
            return null;

        let data={

            datasets: [
                {
                    label: "Crecimiento",
                    borderWidth: 1,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    borderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    hoverBorderColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56'
                    ],
                    fill:true,
                  //  data: mock.map((recordInfo)=>{return {x:recordInfo._id.month + " " + recordInfo._id.year,y:recordInfo.count}})
                }
            ]
        };

        return <Scatter
            data={data}
            height={200}
        />
    };

    componentDidMount(){
        if(! isAuthInfoPresent())
            this.props.dispatch(openMessageDialog({message: "Por favor, logeate en la aplicación"},this.props.history.push("/login")))
    };

    render() {

        return  <section>
            <div style={inputContainerStyles}>
                {this.getGrowthLineGraph()}
            </div>
            <div style={inputContainerStyles}>
                {this.getRecordInfoPieGraph()}
            </div>

            {
                //this.getRecordInfoScatterGraph()
            }
        </section>
    }
}


export default connect(
    createStructuredSelector({
        recordInfo: getRecordInfo,
        growth: getGrowth
    })
)(Statistics)