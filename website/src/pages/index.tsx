import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

interface VideoThumbnailProps {
  url: string;
  title: string;
  description: string;
}

function VideoThumbnail({ url, title, description }: VideoThumbnailProps) {
  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(url);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className={styles.videoThumbnail}>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.videoLink}
        aria-label={`Watch ${title} on YouTube (opens in new tab)`}
      >
        <div className={styles.thumbnailContainer}>
          <img 
            src={thumbnailUrl} 
            alt={`${title} video thumbnail`}
            className={styles.thumbnail}
          />
          <div className={styles.playButton}>
            <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
              <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
              <path d="M45 24L27 14v20l18-10z" fill="#fff"/>
            </svg>
          </div>
        </div>
        <div className={styles.videoInfo}>
          <h3>{title}</h3>
          <p>{description}</p>
          <span className={styles.externalLink}>Watch on YouTube →</span>
        </div>
      </a>
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