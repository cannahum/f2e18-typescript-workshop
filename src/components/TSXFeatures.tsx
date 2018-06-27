import React from 'React';
import {FeatureFlagHelper} from '../../lib/feature-helper/';
const ffh: any = FeatureFlagHelper.getInstance();

interface IFeatureProps {
  firstName: string;
  lovesTypeScript: boolean;
  flagsAreFetched: boolean;
  specificSource?: string;
}

export default class TSXFeatures extends React.Component<IFeatureProps> {

  render() {
    const {firstName, lovesTypeScript, flagsAreFetched, specificSource} = this.props;
    const getFeatureComponent = (name: string): JSX.Element => {
      const isOpen: boolean = ffh.isFeaturePublished(name, specificSource);
      if (isOpen) {
        return <p style={{backgroundColor: '#00800085'}}>{name}</p>
      }
      return <p style={{backgroundColor: '#ff000075'}}>{name}</p>
    };
    return (
      <div>
        Welcome {firstName}!
        You currently {lovesTypeScript ? 'love' : 'does not love'} TS.
        {
          flagsAreFetched
            ? (
              <div>
                {getFeatureComponent('featureA')}
                {getFeatureComponent('featureB')}
                {getFeatureComponent('featureC')}
                {getFeatureComponent('featureD')}
              </div>
            )
            : (
              <p>Loading...</p>
            )
        }
      </div>
    );
  }
}
