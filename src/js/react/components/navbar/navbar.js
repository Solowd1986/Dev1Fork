
import React from "react";
import Style from "./style"


export const User = (props) => {
    return (
        <>
            <div>{props.children}</div>
            <div style={{display: "flex", maxWidth: "300px", margin: "0 auto", justifyContent: "center"}}>
                <input type="text" style={{padding: "5px", color: "black"}}/>
                <button onClick={props.onChangeName} style={{padding: "10px"}}>Change</button>
            </div>
        </>
    )
};


// export default class NavBar extends React.Component{
//     render() {
//         return (
//             <Style>
//                 <a href="/">Link</a>
//             </Style>
//             )
//     }
// }
