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

  onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      name: e.target.name.value,
      description: e.target.description.value
    }
    console.log(data);

    let config = await this.getConfig();
    // send data to backend
    // the second argument to .post is the data that will be the request body
    // the third argument is config, including the header
    const responseData = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/books`, data, config);
    console.log(responseData);
    let updatedArray = this.state.bookData;
    // add the new cat we created into the array
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
                      <h3>{data.name}</h3>
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
