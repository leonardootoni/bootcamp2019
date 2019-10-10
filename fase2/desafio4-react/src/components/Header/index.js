import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './header.css';
import Logo from './images/facebook-header.png';

/**
 * Facebook header component
 */
class Header extends Component {
  render() {
    return (
      <Fragment>
        <div className='header'>
          <div className='header-item-left'>
            <img src={Logo}></img>
          </div>
          <div className='header-item-right'>
            <a href={this.props.profileLink}>
              <h4>
                My Profile <FontAwesomeIcon icon={faUserCircle} size='lg' />
              </h4>
            </a>
          </div>
        </div>
      </Fragment>
    );
  }
}

Header.defaultProps = {
  profileLink: '#'
};

export default Header;
