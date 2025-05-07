import { Link } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Profile from '../images/profile.svg';
import './stylesheets/UserDetails.css';

// Define the API URL using the environment variable
const apiUrl = process.env.REACT_APP_API_URL || '';

function UserDetails() {
  const  { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const logout = async () => {
    try {
      // Use the absolute API URL
      await axios.post(`${apiUrl}/api/auth/logout`, {}); // <-- CHANGE HERE
      setCurrentUser({});
    } catch (error) {
      console.error(error);
    }
  };
  return (
  <div className="user-details-component">
  { currentUser.username
  ? (
  <div>
 {currentUser.access === 'associate'
 ? <Link to="/orders" style={{textDecoration: 'none'}}>Orders</Link>
 : null}

  <img src={Profile} alt="profile" />
  <p>{currentUser.username}</p>
  <button type="button" onClick={logout} >Log Out</button>
  </div>
  ) : <Link to="/login" style={{textDecoration: 'none'}}>Log In</Link> }
  </div>
  );
  }

export default UserDetails;