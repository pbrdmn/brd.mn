import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

export default function Template({ data }) {
  const { markdownRemark: { html: __html, frontmatter: { title, date, path } } } = data
  return (
    <div className="article__container">
      <Helmet title={`${title} – Philip Boardman`} />
      <div className="article">
        <h1><Link to={path} rel="permalink">{title}</Link></h1>
        <h2 className="date">{date}</h2>
        <div
          className="article__content"
          dangerouslySetInnerHTML={{ __html }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
