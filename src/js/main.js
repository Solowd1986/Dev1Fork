
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";
//require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);

import {DomHelper} from "./components/helpers/DomHelper";
import {Request} from "./components/fetch/Request";

import {AdminInitPanel} from "./components/admin/AdminInitPanel";
import {CookieHelper} from "./components/helpers/CookieHelper";

import React, {Component} from "react";
import ReactDom from "react-dom";
import styled from 'styled-components';

fetch("/api/post")
    .then((res) =>
        res.text()
            .then(res => console.log(res)));
fetch("/api/get")
    .then((res) =>
        res.text()
            .then(res => console.log(res)));


new AdminInitPanel({
    shomListOfTablesBtn: ".show-tables",
    listOfTablesWrapper: ".admin__list-of-sections",
    listOfRecordsWrapper: ".admin__records-wrapper"
});


import {User} from "./react/components/navbar/navbar";








class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users : [
                {id: 1, name: "bob"},
                {id: 2, name: "stan"},
                {id: 3, name: "glenn"},
            ],
            cnt: 0,
            showUsers: false};
    }

    init = (evt) => {
        // //console.log(evt.nativeEvent);
        // console.log("up");
        // if (evt.shiftKey) {
        //     this.setState({ name: "stan", cnt: this.state.cnt + 10 });
        // } else {
        //     this.setState({ name: "stan", cnt: this.state.cnt + 1 });
        // }
    };


    show = (user, evt) => {
        console.log(user);
        console.log(evt);
        console.log(this);
    };


    renderUsers = () => {
      this.setState({showUsers: !this.state.showUsers});
    };

    userChangeName = (name, evt) => {
        evt.stopPropagation();
        //console.log(name);
        //console.log(evt);
        
        const userFind = this.state.users.find(user => user.id === name.id);
        userFind.name = evt.nativeEvent.target.previousElementSibling.value || "John Doe";

        const users = [...this.state.users];
        users.forEach(user => {
            if (user.id === userFind.id) {
                user.name = userFind.name;
            }
        });

        //console.log(users);
        this.setState({users});

    };

    render() {
        const Title = styled.div`
          font-size: 16px;
          text-align: center;         
          color: palevioletred; 
          cursor: pointer;
          `;

        return (
            <div>
                <Title>
                    <button onClick={this.renderUsers} style={{padding: "10px"}}>Show</button>
                    {
                        this.state.showUsers
                        ?
                        this.state.users.map((user) =>
                            <User
                                key={user.id}
                                onChangeName={this.userChangeName.bind(this, {id: user.id, name: user.name})}>
                                {user.name}
                            </User>)
                        :
                        null
                    }
                </Title>
            </div>
        )
    }
}




import NavBar from "./react/components/navbar/navbar";


import Overlay from "./react/components/overlay/overlay";
import CloseModal from "./react/components/close-modal/closeModal";


ReactDom.render(
    <Button/>,
    document.querySelector(".app")
);














