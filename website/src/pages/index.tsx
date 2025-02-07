import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import ReactPlayer from 'react-player';
import styles from './index.module.css';

function VideoPlayer({ url }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactPlayer 
        url={url} 
        controls
        width="100%"
        // height="100%"
      />
    </div>
  );
}

const videos = [
  {
    title: 'Video 1 Title',
    url: 'https://www.youtube.com/watch?v=XYHxu2eMxCk',
    description: 'Description for Video 1',
  },
  {
    title: 'Video 2 Title',
    url: 'https://www.youtube.com/watch?v=slo2vPPtldo',
    description: 'Description for Video 2',
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <Link 
          className="button button--secondary button--lg"
          to="/docs/tutorials/tutorial-basics/intro"
        >
          SBT Tutorial - 5min ⏱️
        </Link>
        <div className={styles.videoGrid}>
          <h2 className={styles.videoHeading}>Watch and Learn</h2>
        <div className={styles.videoRow}>
          <VideoPlayer url={videos[0].url} />
          <VideoPlayer url={videos[1].url} />
        </div>
      </div>


      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}