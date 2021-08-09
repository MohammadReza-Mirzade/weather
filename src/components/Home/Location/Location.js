import React from "react";
import style from "./Location.module.css";

export default function Location(props){
    return(<div className={style.location}>
        <b>Your Location:</b><p>Latitude: {props.lat}</p><p>Longitude: {props.lon}</p>
    </div>);
}