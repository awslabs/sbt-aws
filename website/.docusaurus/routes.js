import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'd20'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'e68'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '09c'),
            routes: [
              {
                path: '/docs/category/isv-partner-integrations',
                component: ComponentCreator('/docs/category/isv-partner-integrations', 'e64'),
                exact: true,
                sidebar: "partnerIntegrations"
              },
              {
                path: '/docs/category/sbt-for-aws-workshop',
                component: ComponentCreator('/docs/category/sbt-for-aws-workshop', 'b86'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/sbt-tutorial---basics',
                component: ComponentCreator('/docs/category/sbt-tutorial---basics', '927'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/interfaces',
                component: ComponentCreator('/docs/interfaces', 'de0'),
                exact: true,
                sidebar: "interfaces"
              },
              {
                path: '/docs/interfaces/auth-interface',
                component: ComponentCreator('/docs/interfaces/auth-interface', '507'),
                exact: true,
                sidebar: "interfaces"
              },
              {
                path: '/docs/interfaces/billing-interface',
                component: ComponentCreator('/docs/interfaces/billing-interface', '514'),
                exact: true,
                sidebar: "interfaces"
              },
              {
                path: '/docs/interfaces/metering-interface',
                component: ComponentCreator('/docs/interfaces/metering-interface', '585'),
                exact: true,
                sidebar: "interfaces"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '853'),
                exact: true
              },
              {
                path: '/docs/partners/isv-integrations/amberflo',
                component: ComponentCreator('/docs/partners/isv-integrations/amberflo', '7b6'),
                exact: true,
                sidebar: "partnerIntegrations"
              },
              {
                path: '/docs/partners/isv-integrations/descope',
                component: ComponentCreator('/docs/partners/isv-integrations/descope', 'aa4'),
                exact: true,
                sidebar: "partnerIntegrations"
              },
              {
                path: '/docs/partners/isv-integrations/moesif',
                component: ComponentCreator('/docs/partners/isv-integrations/moesif', '21b'),
                exact: true,
                sidebar: "partnerIntegrations"
              },
              {
                path: '/docs/reference_architectures/ecs-reference-architecture',
                component: ComponentCreator('/docs/reference_architectures/ecs-reference-architecture', 'b26'),
                exact: true,
                sidebar: "referenceArchitectures"
              },
              {
                path: '/docs/reference_architectures/eks-reference-architecture',
                component: ComponentCreator('/docs/reference_architectures/eks-reference-architecture', '64a'),
                exact: true,
                sidebar: "referenceArchitectures"
              },
              {
                path: '/docs/reference_architectures/serverless-saas-reference-architecture',
                component: ComponentCreator('/docs/reference_architectures/serverless-saas-reference-architecture', 'ae9'),
                exact: true,
                sidebar: "referenceArchitectures"
              },
              {
                path: '/docs/tutorial-basics/congratulations',
                component: ComponentCreator('/docs/tutorial-basics/congratulations', '70e'),
                exact: true
              },
              {
                path: '/docs/tutorial-basics/create-a-blog-post',
                component: ComponentCreator('/docs/tutorial-basics/create-a-blog-post', '315'),
                exact: true
              },
              {
                path: '/docs/tutorial-basics/create-a-document',
                component: ComponentCreator('/docs/tutorial-basics/create-a-document', 'f86'),
                exact: true
              },
              {
                path: '/docs/tutorial-basics/create-a-page',
                component: ComponentCreator('/docs/tutorial-basics/create-a-page', '9f6'),
                exact: true
              },
              {
                path: '/docs/tutorial-basics/deploy-your-site',
                component: ComponentCreator('/docs/tutorial-basics/deploy-your-site', 'b91'),
                exact: true
              },
              {
                path: '/docs/tutorial-basics/markdown-features',
                component: ComponentCreator('/docs/tutorial-basics/markdown-features', '272'),
                exact: true
              },
              {
                path: '/docs/tutorial-extras/manage-docs-versions',
                component: ComponentCreator('/docs/tutorial-extras/manage-docs-versions', 'a34'),
                exact: true
              },
              {
                path: '/docs/tutorial-extras/translate-your-site',
                component: ComponentCreator('/docs/tutorial-extras/translate-your-site', '739'),
                exact: true
              },
              {
                path: '/docs/tutorials/sbt-workshop/workshop',
                component: ComponentCreator('/docs/tutorials/sbt-workshop/workshop', '168'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/app-plane-utils',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/app-plane-utils', '278'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/build-it',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/build-it', 'a68'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/congratulations',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/congratulations', '510'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/create-application-plane',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/create-application-plane', 'b22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/create-control-plane',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/create-control-plane', '1ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/install-sbt',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/install-sbt', '91e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/intro',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/intro', '957'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/provisioning-script-breakdown',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/provisioning-script-breakdown', '4fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/putting-it-all-together',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/putting-it-all-together', '995'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/tutorials/tutorial-basics/test-the-deployment',
                component: ComponentCreator('/docs/tutorials/tutorial-basics/test-the-deployment', '199'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
