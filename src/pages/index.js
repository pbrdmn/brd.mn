import React from 'react'
import Link from 'gatsby-link'

export default function Welcome({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div>
      <h1>
        <Link to="/" rel="permalink">
          brd.mn
        </Link>
      </h1>
      <p>
        Philip Boardman is a front-end engineer with extensive experience
        building responsive web applications using JavaScript, CSS3 and HTML5.
      </p>
      <p>
        <Link to="/profile">View profile</Link>
      </p>
      <hr />
      <div className="articles">
        {posts
          .filter(post => post.node.frontmatter.path.startsWith('/articles/'))
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
                  <h3>
                    <Link to={path}>{title}</Link>
                  </h3>
                  <div className="date">{date}</div>
                  <p className="article__content">{excerpt}</p>
                </div>
              )
            }
          )}
        <p>
          <Link to="/articles">More articles &hellip;</Link>
        </p>
      </div>
    </div>
  )
}

export const recentQuery = graphql`
  query recentQuery {
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
