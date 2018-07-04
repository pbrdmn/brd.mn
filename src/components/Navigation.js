import React from 'react'
import Link from 'gatsby-link'
const profileIcon = require('../images/profile.svg')
const articlesIcon = require('../images/articles.svg')
const octocatIcon = require('../images/octocat.svg')
const twitterIcon = require('../images/twitter.svg')

const Navigation = () => (
  <div className="header__links">
    <Link to="/profile" title="Profile">
      <img className="icon" src={profileIcon} alt="Profile icon" />
    </Link>
    <Link to="/articles" title="Articles">
      <img className="icon" src={articlesIcon} alt="Articles icon" />
    </Link>
    <a href="https://github.com/dustykeyboard" title="DustyKeyboard on GitHub">
      <img className="icon" src={octocatIcon} alt="GitHub logo" />
    </a>
    <a href="https://twitter.com/pbrdmn" title="@pbrdmn on Twitter">
      <img className="icon" src={twitterIcon} alt="Twitter logo" />
    </a>
  </div>
)

export default Navigation
