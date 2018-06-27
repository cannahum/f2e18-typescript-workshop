import React, {Component} from 'react';
import {
  FeatureFlagHelper,
  IFeature,
  TFeatures,
  IFeatureSource,
  TFetcher,
  TTransformer,
} from 'feature-helper';
import JSXFeatures from './components/JSXFeatures';
import TSXFeatures from './components/TSXFeatures';

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
    const source: IFeatureSource<ComplexFeature[]> = {
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
const complexSourceFetcher: TFetcher<ComplexFeature[]> = (): Promise<ComplexFeature[]> => {
  return new Promise((resolve) => {
    resolve([
      {
        name: 'featureA',
        value: true
      },
      {
        name: 'featureB',
        value: false,
      }
    ] as ComplexFeature[]);
  })
};

const complexSourceTransformer: TTransformer<ComplexFeature[]> = (response: ComplexFeature[]): TFeatures => {
  return response.map((f: ComplexFeature) => {
    return {
      name: f.name,
      value: f.value,
      source: 'complexSource'
    } as IFeature;
  })
};
