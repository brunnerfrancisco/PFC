import React, { Component } from "react";
import socketIOClient from "socket.io-client";

// The Header creates links that can be used to navigate
// between routes.
var socket;
class Header extends Component {
    constructor() {
        super();
        this.state = {
            endpoint: "http://localhost:1100/" // Update 3001 with port on which backend-my-app/server.js is running.
        };
        socket = socketIOClient(this.state.endpoint);
    }

    render() {
        return (
            <div className="text-center p-2">
                <h1>La Isla Del Tesoro</h1>
            </div>
        );
    }
}
export { Header, socket };