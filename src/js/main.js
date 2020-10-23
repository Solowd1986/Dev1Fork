
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";
//require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);

import {DomHelper} from "./components/helpers/DomHelper";
import {Request} from "./components/fetch/Request";

import {AdminInitPanel} from "./components/admin/AdminInitPanel";
import {CookieHelper} from "./components/helpers/CookieHelper";

import React from "react";
import ReactDom from "react-dom";
import styled from 'styled-components';

new AdminInitPanel({
    shomListOfTablesBtn: ".show-tables",
    listOfTablesWrapper: ".admin__list-of-sections",
    listOfRecordsWrapper: ".admin__records-wrapper"
});


class Wrap extends React.Component {
    render() {
        return (
            <button onClick={this.props.clickHandler}>+</button>
        )
    }
}


class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: "bob", cnt: 0};
    }

    init = (evt) => {
        console.log(evt.nativeEvent);
        if (evt.shiftKey) {
            this.setState({ name: "stan", cnt: this.state.cnt + 10 });
        } else {
            this.setState({ name: "stan", cnt: this.state.cnt + 1 });
        }
    };

    render() {
        const Title = styled.h1`
          font-size: 16px;
          text-align: center;         
          color: palevioletred; 
          `;

        const elems = ["date ", "state", "gate"];
        return (
            <div>
                <Title onClick={this.init}>
                {/*<input type={this.props.type} value={this.props.value}/>*/}
                <p>{this.state.name}</p>
                <p>{this.state.cnt}</p>
                </Title>

                <Wrap clickHandler={this.init}/>
            </div>

        )
    }
}




class Wraper extends React.Component {
    render() {
        return (
            <div> {this.props.children}</div>
        )
    }
}


class Timer {
    constructor(props) {
        this.tick = 0;
    }

    ticker() {
        console.log(this);

        this.tick++
    }

    setTimer() {
        setTimeout(() => this.ticker(), 1000);
    }
}

//new Timer().setTimer();




import NavBar from "./react/components/navbar/navbar";
import Overlay from "./react/components/overlay/overlay";

import CloseModal from "./react/components/close-modal/closeModal";


ReactDom.render(
    <Button/>,
    document.querySelector(".app")
);














