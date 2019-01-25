import React, { Component } from "react";
import Persons from "./components/Persons";
import { Container } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <Container>
        <Persons />
      </Container>
    );
  }
}

export default App;
