module.exports = {
  siteMetadata: {
    title: 'brd.mn',
    description: 'Front-end engineer building React and React Native apps with JavaScript, CSS3 and HTML5',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-copy-images',
          'gatsby-remark-autolink-headers',
        ],
      },
    },
    'gatsby-plugin-offline',
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 600,
            },
          },
        ],
      },
    },
  ],
}
