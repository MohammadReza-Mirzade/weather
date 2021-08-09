import React, {useEffect, useState} from "react";
import style from "./Home.module.css";
import Location from "./Location";
import CanvasJSReact from '../CanvaJS/canvasjs.stock.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Home(props){

    const tempOptions = {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: "Minimum And Maximum Temperature"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY"
        },
        axisY: {
            title: "Temperature (°C)",
            includeZero: true,
            suffix: " °C"
        },
        data: [{
            type: "rangeColumn",
            indexLabel: "{y[#index]}°",
            xValueFormatString: "DD MMM YY",
            toolTipContent: "<strong>{x}</strong></br> Max: {y[1]} °C<br/> Min: {y[0]} °C",
            dataPoints: []
        }]
    };

    const pressureOptions = {
        animationEnabled: true,
        zoomEnabled: true,
        title:{
            text: "Pressure"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY:{
            title:"Pressure (in hPa)",
            suffix: "hPa",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        data: [{
            type: "scatter",
            markerSize: 15,
            toolTipContent: "<strong>{x}</strong></br> Pressure: {y} hPa",
            dataPoints: []}]
    };

    const humidityOptions = {
        animationEnabled: true,
        zoomEnabled: true,
        title:{
            text: "Humidity"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY:{
            title:"Humidity",
            suffix: "%",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        data: [{
            type: "scatter",
            markerSize: 15,
            toolTipContent: "<strong>{x}</strong></br> Humidity: {y} %",
            dataPoints: []}]
    };

    const [location, setLocation] = useState([]);
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        if(location.length===0) fetch("http://localhost:8080")
            .then((response) => response.json())
            .then((data) => {
                setLocation([data.lon, data.lat]);
            });
        if(weatherData.length===0 && location.length===2) fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+location[1]+"&lon="+location[0]+"&exclude=current,minutely,hourly,alerts&appid=3a56b3ec1fdb8fd79a93de9bd20282c9&units=metric")
            .then((response) => response.json())
            .then((data) => {
                 setWeatherData(data.daily.map((element) => {
                     const temp = new Date(element.dt*1000);
                     temp.setHours(0,0,0,0);
                    return {date: temp, minTemp: element.temp.min, maxTemp: element.temp.max, pressure: element.pressure, humidity: element.humidity};
                }));
            });
    });

    weatherData.forEach(element => {
        tempOptions.data[0].dataPoints.push({x: element.date, y: [element.minTemp, element.maxTemp]});
        pressureOptions.data[0].dataPoints.push({x: element.date, y: element.pressure});
        humidityOptions.data[0].dataPoints.push({x: element.date, y: element.humidity});
    });

    return(
        <>
            <div className={style.page}>
                {location.length===2?<Location lon={location[0]} lat={location[1]}></Location>:null}
                <div className={style.chart}><CanvasJSChart options = {tempOptions}/></div><br/>
                <div className={style.chart}><CanvasJSChart options = {pressureOptions}/></div><br/>
                <div className={style.chart}><CanvasJSChart options = {humidityOptions}/></div>
            </div>
        </>
    );
}