/// <reference path="../server.d.ts" />
import React, {Component} from 'react';
import axios, {AxiosResponse} from 'axios';
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
    const source2: IFeatureSource<Server.IServerFeature[]> = {
      sourceName: 'serverFlags',
      fetcher: serverFlagsFetcher,
      transformer: serverFlagsTransformer,
    };
    const ffh: any = FeatureFlagHelper.getInstance();
    ffh.addFeatureSource(source);
    ffh.addFeatureSource(source2);
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
        <JSXFeatures flagsAreFetched={this.state.isFetched}/>
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

const serverFlagsFetcher: TFetcher<Server.IServerFeature[]> = async () => {
  try {
    const data = await axios.get<AxiosResponse<Server.IServerFeatureEndpoint>>('/featureflags');
    if (isServerFeatureInterface(data.data.data)) {
      return data.data.data;
    }
  }
  catch (e) {
    //
  }
  return [];
};

function isServerFeatureInterface(x: any): x is Server.IServerFeature[] {
  if (!Array.isArray(x)) {
    return false;
  }

  const [first] = x;
  if (first && first.name && typeof first.name === 'string') {
    return true;
  }
  return false;
}

const serverFlagsTransformer: TTransformer<Server.IServerFeature[]> = (list: Server.IServerFeature[]): TFeatures => {
  return list.map((f: Server.IServerFeature) => {
    return {
      name: f.name,
      value: (f.currentValue && f.currentValue === 'true'),
      source: 'serverFlags',
    };
  });
};