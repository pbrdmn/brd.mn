import React from 'react'
import Link from 'gatsby-link'
import Navigation from './Navigation'

const Header = ({ siteTitle }) => (
  <div id="h">
    <div className="header__content">
      <h1 className="header__title">
        <Link to="/" className="header__link" title="Home">
          {siteTitle}
        </Link>
      </h1>
      <Navigation />
    </div>
  </div>
)

export default Header
