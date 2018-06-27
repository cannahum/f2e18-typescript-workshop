import React, {Component} from 'react';
import {FeatureFlagHelper} from "feature-helper";
const ffh = FeatureFlagHelper.getInstance();

export default class JSXFeatures extends Component {
  render() {
    const {firstName, lovesTypeScript, flagsAreFetched, specificSource} = this.props;
    const getFeatureComponent = (name) => {
      const isOpen = ffh.isFeaturePublished(name, specificSource);
      if (isOpen && isOpen.asBoolean()) {
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
                {getFeatureComponent('paymentsEnabled')}
                {getFeatureComponent('payrollEnabled')}
              </div>
            )
            : (
              <p>Loading...</p>
            )
        }
      </div>
    )
  }
}