import React from 'react'
import Link from 'gatsby-link'

const Navigation = () => (
  <div className="header__links">
    <Link to="/articles">Articles</Link>
    <a href="https://github.com/dustykeyboard">GitHub</a>
    <a href="https://twitter.com/pbrdmn">@pbrdmn</a>
  </div>
)

export default Navigation
