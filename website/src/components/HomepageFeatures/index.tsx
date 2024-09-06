import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Powered by CDK',
    Svg: require('@site/static/img/cdkdevlogo.svg').default,
    description: (
      <>
        SBT makes extensive use of the AWS Cloud Development Kit (CDK), and adheres to CDK's
        Construct Programming Model (CPM).
      </>
    ),
  },
  {
    title: 'Partner integrations',
    Svg: require('@site/static/img/partners.svg').default,
    description: (
      <>
        SBT is designed to work with a variety of third-party integrations. See{' '}
        <a href="">this page </a>for additional information.
      </>
    ),
  },
  {
    title: 'Open Source',
    Svg: require('@site/static/img/github-mark.svg').default,
    description: (
      <>
        SBT is open source, and built in the open. We love community contributions and open
        discussion. We'd love to hear from you.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
