import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import './index.css'

const Layout = ({ children }) => (
  <div>
    <Helmet
      title='brd.mn'
      meta={[
        { name: 'description', content: 'Front-end engineer building React and React Native apps with JavaScript, CSS3 and HTML5' },
      ]}
    />
    <Header siteTitle='brd.mn' />
    <div className="page">{children()}</div>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout
