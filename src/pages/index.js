import React from 'react'
import Link from 'gatsby-link'

export default function Welcome({ data }) {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div>
      <h1><Link to="/" rel="permalink">About Me</Link></h1>
      <p>Front-end engineer with extensive experience building responsive web applications using JavaScript, CSS3 and HTML5.</p>
      <p><Link to="/profile">See my profile</Link></p>
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
