const path = require(`path`)

let siteConfig
let ghostConfig
let mediaConfig
let routesConfig

try {
    siteConfig = require(`./siteConfig`)
} catch (e) {
    siteConfig = null
}

try {
    mediaConfig = require(`./mediaConfig`)
} catch (e) {
    mediaConfig = null
}

try {
    routesConfig = require(`./routesConfig`)
} catch (e) {
    routesConfig = null
}

try {
    ghostConfig = require(`./.ghost`)
} catch (e) {
    ghostConfig = {
        development: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
        production: {
            apiUrl: process.env.GHOST_API_URL,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY,
        },
    }
} finally {
    const { apiUrl, contentApiKey } = process.env.NODE_ENV === `development` ? ghostConfig.development : ghostConfig.production

    if (!apiUrl || !contentApiKey || contentApiKey.match(/<key>/)) {
        ghostConfig = null //allow default config to take over
    }
}

module.exports = {
    plugins: [
        `gatsby-plugin-preact`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`),
                name: `images`,
            },
        },
        {
            resolve: `gatsby-theme-try-ghost`,
            options: {
                ghostConfig: ghostConfig,
                siteConfig: siteConfig,
                mediaConfig: mediaConfig,
                routes: routesConfig,
            },
        },
        {
            resolve: `gatsby-theme-ghost-dark-mode`,
            options: {
                // Set to true if you want your theme to default to dark mode (default: false)
                // Note that this setting has an effect only, if
                //    1. The user has not changed the dark mode
                //    2. Dark mode is not reported from OS
                defaultModeDark: false,
                // If you want the defaultModeDark setting to take precedence
                // over the mode reported from OS, set this to true (default: false)
                overrideOS: false,
            },
        },
        {
            resolve: `gatsby-theme-ghost-members`,
        },
        {
            resolve: `gatsby-transformer-rehype`,
            options: {
                filter: node => (
                    node.internal.type === `GhostPost` ||
                    node.internal.type === `GhostPage`
                ),
                plugins: [
                    {
                        resolve: `gatsby-rehype-ghost-links`,
                    },
                    {
                        resolve: `gatsby-rehype-prismjs`,
                    },
                    {
                        resolve: `gatsby-theme-ghost-contact`,
                        options: {
                            pageContext: {
                                title: `Contact Our Team`,
                                custom_excerpt: `Hello, and welcome to Judicial Domicide. We are a not-for-profit humanitarian organisation, which is run entirely by a benevolent group of passionate volunteers, that operates at a grassroots level with the principal aim of raising awareness of callous evictions involving vulnerable occupiers. If you are under threat of eviction or fear that you may be displaced from your place of residence, please contact us about your situation, as our team endeavours to reach out to those who are at risk in a timely manner, which may take several days due to our staff being purely comprised of voluntary members.`,
                                feature_image: `https://images.unsplash.com/photo-1577563820627-bc12aa2139de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjExNzczfQ&fit=crop&w=1350q=80`,
                            },
                        },
                    },
                ],
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // This plugin is currently causing issues: https://github.com/gatsbyjs/gatsby/issues/25360
        //`gatsby-plugin-offline`,
    ],
}
