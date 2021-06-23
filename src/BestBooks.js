import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './BestBooks.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import BookFormModal from './BookFormModal';


class MyFavoriteBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: false };
    this.handleAddBookClick  = this.handleAddBookClick.bind(this);
  }

  handleAddBookClick = () => {
    this.setState( prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  getConfig = async() => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;

    const config = {
      headers: {"Authorization" : `Bearer ${jwt}`}
    };
    return config;
  }

  onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      name: e.target.name.value,
      description: e.target.description.value
    }
    console.log(data);

    let config = await this.getConfig();

    const responseData = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/books`, data, config);
    console.log(responseData);
    let updatedArray = this.state.bookData;

    updatedArray.push(responseData.data);
    this.setState({ bookData: updatedArray });
  }

  componentDidMount = async () => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;

    const config = {
      headers: { "Authorization": `Bearer ${jwt}` }
    };
    const bookData = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/books`, config);
    console.log(bookData);
    this.setState({ bookData: bookData.data });
  }
  
  deleteBook = async (id) => {
    let config = await this.getConfig();
    let response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/books/${id}`, config);
    console.log(response);
    let updatedArray = this.state.bookData.filter(book => book._id !== id);
    this.setState({bookData: updatedArray});
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
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={`https://via.placeholder.com/800x400/000000/FFFFFF/?text=${data.name}`}
                      alt="First slide"
                    />
                    <Carousel.Caption>
                      <h3>{data.description}</h3>
                      <h6>{data.status}</h6>
                    <Button variant='outline-light' onClick={() => this.deleteBook(data._id)}>Remove</Button>
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
      </Jumbotron>
    );
  }
};

export default withAuth0(MyFavoriteBooks);
