
import React from "react";
import OverlayBlock from "./style"


export default class Overlay extends React.Component{
    render() {
        return (
            <OverlayBlock>
                {this.props.children}
            </OverlayBlock>
        )
    }
}



