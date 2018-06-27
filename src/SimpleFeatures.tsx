import React, {Component} from 'react';
import {
  FeatureFlagHelper,
  IFeatureSource,
  TFetcher,
} from 'feature-helper';
import JSXFeatures from './components/JSXFeatures';
import TSXFeatures from './components/TSXFeatures';

interface ISimpleFeaturesProps {
  lovesTypeScript: boolean;
}

interface ISimpleFeaturesState {
  isFetched: boolean;
}

export default class SimpleFeatures extends Component<ISimpleFeaturesProps, ISimpleFeaturesState> {

  constructor(props: ISimpleFeaturesProps) {
    super(props);

    this.state = {
      isFetched: false,
    };
  }

  componentWillMount() {
    const source: IFeatureSource<Array<string>> = {
      sourceName: 'pureString',
      fetcher: pureStringFetcher,
    };
    const ffh: FeatureFlagHelper = FeatureFlagHelper.getInstance();
    ffh.addFeatureSource(source);
    ffh.fetchSources()
      .then(() => {
        this.setState({
          isFetched: true
        });
      })
  }

  render() {
    return (
      <div>
        <TSXFeatures
          firstName={'Jon'}
          lovesTypeScript={this.props.lovesTypeScript}
          flagsAreFetched={this.state.isFetched}
          specificSource="pureString"/>
        <JSXFeatures/>
      </div>
    );
  }
}

const pureStringFetcher: TFetcher<Array<string>> = (): Promise<Array<string>> => {
  return new Promise((resolve) => resolve([
    'featureA',
    'featureB',
    'featureC',
  ]));
};