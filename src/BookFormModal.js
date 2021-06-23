import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BestBooks.css';
import { withAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


class BookFormModal extends React.Component {

  render() {
    return (
      <Modal show={this.props.isToggleOn} hide={this.props.isToggleOn} onSubmit={this.props.onSubmit}>
        <Modal.Header>
          <Button variant='outline-dark' type='submit' onClick={this.props.handleAddBookClick}>Back to Books</Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control type='input' placeholder='Book Title' id='name'></Form.Control>
              <Form.Text ClassName='text-muted'>Enter the title of your book</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Control type='input' placeholder='Description' id='description'></Form.Control>
              <Form.Text ClassName='text-muted'>Enter a description of your book</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-dark' type='submit'>Add your book</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export default withAuth0(BookFormModal);
