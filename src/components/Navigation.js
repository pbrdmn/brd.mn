import React from 'react'
import Link from 'gatsby-link'
const articlesIcon = require('../images/articles.svg')
const octocatIcon = require('../images/octocat.svg')
const twitterIcon = require('../images/twitter.svg')

const Navigation = () => (
  <div className="header__links">
    <Link to="/articles">
      <img className="icon" src={articlesIcon} alt="Articles" />
    </Link>
    <a href="https://github.com/dustykeyboard">
      <img className="icon" src={octocatIcon} alt="DustyKeyboard on GitHub" />
    </a>
    <a href="https://twitter.com/pbrdmn">
      <img className="icon" src={twitterIcon} alt="@pbrdmn on Twitter" />
    </a>
  </div>
)

export default Navigation
