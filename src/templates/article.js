import React from 'react'
import Helmet from 'react-helmet'

export default function Template({ data }) {
  const { markdownRemark: { html: __html, frontmatter: { title, date }} } = data
  return (
    <div className="article__container">
      <Helmet title={`${title} – Philip Boardman`} />
      <div className="article">
        <h1>{title}</h1>
        <h2>{date}</h2>
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
