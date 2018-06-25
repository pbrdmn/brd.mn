import React from 'react'
import Link from 'gatsby-link'

export default function NotFoundPage({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div>
      <h1>Not Found</h1>
      <p>There is no page at this address...</p>
      <p>Here are some other pages</p>
      <div className="articles">
        {posts
          .filter(post => post.node.frontmatter.title.length > 0)
          .filter((post, index) => index < 5)
          .map(
            ({
              node: {
                id,
                excerpt,
                frontmatter: { title, date, path },
              },
            }) => {
              return (
                <div className="article__preview" key={id}>
                  <h2>
                    <Link to={path}>{title}</Link>
                  </h2>
                  <div className="date">{date}</div>
                  <p className="article__content">{excerpt}</p>
                </div>
              )
            }
          )}
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query missingQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 5
    ) {
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
