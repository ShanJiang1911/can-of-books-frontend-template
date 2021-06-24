import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './BestBooks.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import BookFormModal from './BookFormModal';
import UpdateForm from './UpdateForm';


class MyFavoriteBooks extends React.Component {
  constructor(props) {
    // Setting states for showing modal on/off 
    super(props);
    this.state = {
      isToggleOn: false,
      showUpdate: false
    };
    this.handleAddBookClick = this.handleAddBookClick.bind(this);
  }

  // handle click function for add a new book button
  handleAddBookClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
    }));
  }

  handleUpdateCancel = () => {
    this.setState({
      showUpdate: false,
      bookToUpdate: {}
    });
  }

  // basic get config function to aquire authorization token from logged in user
  getConfig = async () => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;

    const config = {
      headers: { "Authorization": `Bearer ${jwt}` }
    };
    return config;
  }

  // onSubmit passed down to BookFormModal
  onSubmit = async (e) => {
    e.preventDefault();
    // Setting listeners for form input data
    let data = {
      name: e.target.name.value,
      description: e.target.description.value
    }
    console.log(data);

    // assign the getConfig function to variable
    let config = await this.getConfig();

    // Setting responseData to be the data recieved back from the server side POST address
    const responseData = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/books`, data, config);
    console.log(responseData);

    // assignd  updated array to be th state of new data recieved from server
    let updatedArray = this.state.bookData;

    // pushing the responseData to updated array
    updatedArray.push(responseData.data);

    // setting the new state of bookData to be UpdatedArray data
    this.setState({
      bookData: updatedArray,
      showUpdate: false
    });
  }

  // Makes GET request from server at inital component rendering
  componentDidMount = async () => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;

    // sets config to be the Authorization token from auth0 to verify the users
    const config = {
      headers: { "Authorization": `Bearer ${jwt}` }
    };

    // assigns bookData to be the data we recieve from the GET request from the server
    const bookData = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/books`, config);
    console.log(bookData);

    // updated the state of bookData to be the new bookData.Data from the server
    this.setState({ bookData: bookData.data });
  }

  // deleteBook function triggers when clicking the remove book button on the Carousel
  deleteBook = async (id) => {
    let config = await this.getConfig();

    // Assigns response the value of the Delete request sent to the server, assign book ID, and config token verify 
    let response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/books/${id}`, config);
    console.log(response);
    
    // Assignd updatedArray the new state of bookData after filtering the removed book by ID
    let updatedArray = this.state.bookData.filter(book => book._id !== id);

    // Updating the state of bookData to be updated arry which contained the filter book data
    this.setState({ bookData: updatedArray });
  }

  // updateBook function is setting states for showupdate Modal, and the book to be updated
  updateBook = (bookInfo) => {
    this.setState({
      // showUpdate is true will make the UpdateForm modal show
      showUpdate: true,
      
      // bookToUpdate will assign the targeted book chose to update
      bookToUpdate: bookInfo
    })
  }

  // sendBookUpdate gatheres the data of the selcted book, sends a PUT to server with dataToUpdate book
  sendBookUpdate = async (e) => {
    e.preventDefault();
    let config = await this.getConfig();

    // when Update Book is clicked, it will target the current book on the carousel
    let dataToUpdate = {
      name: e.target.updateName.value,
      description: e.target.updateDescription.value
    };

    // sets response to be the data recieved back from put server
    let response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/books/${this.state.bookToUpdate._id}`, dataToUpdate, config);

    // Assigns update Array to be bookData
    let updatedArray = this.state.bookData;

    // Splicing the updatedArray so that it will no contain the old version of the updated book
    updatedArray.splice(updatedArray.indexOf(this.state.bookToUpdate), 1, response.data);

    // Sets the state for bookData to be the new updatedArray, hides the Modal, and clears bookToUpdate state
    this.setState({
      bookData: updatedArray,
      showUpdate: false,
      bookToUpdate: {}
    });
  }

  render() {
    const { user } = this.props.auth0;
    return (
      <Jumbotron>
        <h1>My Favorite Books</h1>
        <h3>This is a collection of {user.name} favorite books</h3>
        {
          this.state.bookData ?
            <Carousel fade>
              {
                this.state.bookData.map(data =>
                  <Carousel.Item interval={12000} id={data._id}>
                    <img
                      className="d-block w-100"
                      src={`https://via.placeholder.com/800x400/000000/FFFFFF/?text=${data.name}`}
                      alt="First slide"
                    />
                    <Carousel.Caption>
                      <h3>{data.description}</h3>
                      <h6>{data.status}</h6>
                      <Button variant='outline-danger' onClick={() => this.deleteBook(data._id)}>Remove Book</Button>
                      <Button variant='outline-info' onClick={() => this.updateBook(data)}>Update Book</Button>
                    </Carousel.Caption>
                  </Carousel.Item>)
              }
            </Carousel> : ''
        }
        <Button variant='outline-dark' onClick={this.handleAddBookClick}>Add A Book</Button>
        {
          this.state.isToggleOn ?
            <BookFormModal isToggleOn={this.state.isToggleOn}
              handleAddBookClick={this.handleAddBookClick}
              onSubmit={this.onSubmit}
            /> : ''
        }
        {
          this.state.showUpdate ?
          <UpdateForm
          book={this.state.bookToUpdate}
          showUpdate={this.state.showUpdate}
          sendBookUpdate={this.sendBookUpdate}
          handleUpdateCancel={this.handleUpdateCancel}
          ></UpdateForm> : ''
        }
      </Jumbotron>
    );
  }
};

export default withAuth0(MyFavoriteBooks);
