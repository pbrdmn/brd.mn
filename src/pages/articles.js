import React from 'react'
import Link from 'gatsby-link'

export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div className="articles">
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .map(({ node: { id, html: __html, frontmatter: { title, date, path } } }) => {
          return (
            <div className="article__preview" key={id}>
              <h1>
                <Link to={path}>{title}</Link>
              </h1>
              <h2>{date}</h2>
              <div
                className="article__content"
                dangerouslySetInnerHTML={{ __html }}
              />
            </div>
          )
        })}
    </div>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date]}) {
      edges {
        node {
          excerpt(pruneLength: 250)
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
