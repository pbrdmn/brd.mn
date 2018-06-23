import React from 'react'
import Link from 'gatsby-link'
import Navigation from './Navigation'

const Header = () => (
  <div id="h">
    <div className="header__content">
      <h1 className="header__title">
        <Link to="/" className="header__link">
          Philip Boardman
        </Link>
      </h1>
      <Navigation />
      <div className="header__anchor" />
    </div>
  </div>
)

export default Header
