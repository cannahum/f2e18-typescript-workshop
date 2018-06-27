import React, {Component} from 'react';
import JSXFeatures from './components/JSXFeatures';
import TSXFeatures from './components/TSXFeatures';
import {FeatureFlagHelper} from '../lib/feature-helper/';

interface IComplexFeaturesProps {
  lovesTypeScript: boolean;
}

interface IComplexFeaturesState {
  isFetched: boolean;
}

export default class ComplexFeatures extends Component<IComplexFeaturesProps, IComplexFeaturesState> {

  constructor(props: IComplexFeaturesProps) {
    super(props);

    this.state = {
      isFetched: false,
    };
  }

  componentWillMount() {
    const source = {
      sourceName: 'complexSource',
      fetcher: complexSourceFetcher,
      transformer: complexSourceTransformer,
    };
    const ffh: any = FeatureFlagHelper.getInstance();
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
          specificSource="complexSource"/>
        <JSXFeatures/>
      </div>
    );
  }
}

type ComplexFeature = { name: string, value: any };
const complexSourceFetcher = (): Promise<Array<ComplexFeature>> => {
  return new Promise((resolve) => resolve([
    {
      name: 'featureB',
      value: false
    },
    {
      name: 'featureD',
      value: false
    }
  ]));
};

const complexSourceTransformer = (response: ComplexFeature[]): any => {
  return response.map((f: ComplexFeature) => {
    return {
      ...f,
      source: 'complexSource'
    };
  });
};
