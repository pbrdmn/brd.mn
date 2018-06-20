import React from 'react'
import Link from 'gatsby-link'

export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div className="articles">
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .map(
          ({ node: { id, excerpt, frontmatter: { title, date, path } } }) => {
            return (
              <div className="article__preview" key={id}>
                <div className="date">{date}</div>
                <h2>
                  <Link to={path}>{title}</Link>
                </h2>
                <p className="article__content">{excerpt}</p>
              </div>
            )
          }
        )}
    </div>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 140)
          id
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
  }
`
