import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


class UpdateForm extends React.Component {

  render() {
    return (
      <Modal show={this.props.isToggleOn} hide={this.props.isToggleOn}>
        <Modal.Body>
          <Form onSubmit={this.props.onSubmit}>
            <Form.Group>
              <Form.Control type='input' defualtValue={this.props.book.name} id='updateName'></Form.Control>
              <Form.Text ClassName='text-muted'>Update the title of your book</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Control type='input' defualtValue={this.props.book.description} id='updateDescription'></Form.Control>
              <Form.Text ClassName='text-muted'>Update the description of your book</Form.Text>
            </Form.Group>
            <Button variant='outline-dark' type='submit'>Update</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-dark' onClick={this.props.handleAddBookClick}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default UpdateForm;
