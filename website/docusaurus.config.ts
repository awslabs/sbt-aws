import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'SaaS Builder Toolkit for AWS (SBT-AWS)',
  tagline: 'A developer toolkit to implement SaaS best practices and increase developer velocity.',
  favicon: 'img/favicon.ico',

   // Set the production url of your site here
   url: 'https://awslabs.github.io',
   baseUrl: '/sbt-aws/',
   trailingSlash: false,
   organizationName: 'awslabs', // Usually your GitHub org/user name.
   projectName: 'sbt-aws', // Usually your repo name.
   githubHost: 'github.com',
   onBrokenLinks: 'throw',
   onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
          'https://github.com/awslabs/sbt-aws/blob/main/website/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    navbar: {
      title: 'SBT-AWS',
      logo: {
        alt: 'sbt logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'docSidebar',
          sidebarId: 'partnerIntegrations',
          position: 'left',
          label: 'Partner Integrations',
        },
        {
          type: 'docSidebar',
          sidebarId: 'interfaces',
          position: 'left',
          label: 'Interfaces',
        },
        {
          type: 'docSidebar',
          sidebarId: 'referenceArchitectures',
          position: 'left',
          label: 'Reference Architectures',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              href: 'https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md#tutorial',
            },
          ],
        },
        {
          title: 'Get Involved',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/awslabs/sbt-aws',
            },
          ],
        },
      ],
      copyright: `Built with ❤️ at AWS <br/> © ${new Date().getFullYear()} Amazon.com, Inc. or its affiliates. All Rights Reserved`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    }
  } satisfies Preset.ThemeConfig
};

export default config;
