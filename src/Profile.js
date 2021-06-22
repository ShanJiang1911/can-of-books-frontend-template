// import './App.css'
import React from 'react';
import Card from 'react-bootstrap/Card'


class Profile extends React.Component {

  render() {
    return (
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={this.props.picture} />
        <Card.Body>
          <Card.Title>{this.props.name}</Card.Title>
          <Card.Text>{this.props.email}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}


export default Profile;
