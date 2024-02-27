## How to push a new version

[Projen](https://projen.io/releases.html) is designed to help with versioning and packaging new releases. Here's how:

1. When merging new PRs, use the "Conventional Commits" strategy outlined [here](https://www.conventionalcommits.org/en/v1.0.0/#summary) to set the commit message. (Note that this has implications on what the new version will be.)
2. Clone the repo, switch to the `main` branch and pull the latest changes
3. Run `npm run release` to prep the release
4. Run `npm publish dist/js/sbt*` to publish the new package
5. Push any new commits and tags to `main` (`git push; git push --tags`)

### Pushing a pre-release

Using pre-release versions can be a good way to signal to others that a given version is under active development. To release a pre-release version:

1. Commit all unsaved changes. (This is required in order for `projen` to prep the release.)
2. Run `PRERELEASE=beta npm run release` to prep the pre-release
3. Run `npm publish dist/js/sbt*` to publish the new package
4. Push any new commits and tags to your working branch (ex. If the branch is `feature1`, then run `git push origin $(git rev-parse --abbrev-ref HEAD); git push --tags origin $(git rev-parse --abbrev-ref HEAD)`.)

(For more info, click [here](http://projen.io/releases.html#can-i-do-a-manual-one-off-prerelease).)
