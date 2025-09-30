import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
// Removed ReactPlayer to comply with privacy regulations and prevent unauthorized cookie installation
import styles from './index.module.css';

function VideoThumbnail({ url, title, description }) {
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  const handleClick = () => {
    // Open YouTube in new tab - no iframes, no cookies, no tracking on our site
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={styles.videoThumbnail}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Play video: ${title}`}
    >
      <img 
        src={thumbnailUrl} 
        alt={`${title} video thumbnail`}
        className={styles.thumbnailImage}
      />
      <div className={styles.playButton} aria-hidden="true">▶</div>
      <div className={styles.videoInfo}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
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
          <VideoThumbnail 
            url={videos[0].url} 
            title={videos[0].title}
            description={videos[0].description}
          />
          <VideoThumbnail 
            url={videos[1].url} 
            title={videos[1].title}
            description={videos[1].description}
          />
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