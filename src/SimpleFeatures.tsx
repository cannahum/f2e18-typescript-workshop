import React, {Component} from 'react';
import JSXFeatures from './simple/JSXFeatures';
import TSXFeatures from './simple/TSXFeatures';

interface ISimpleFeaturesProps {
  lovesTypeScript: boolean;
}
export default class SimpleFeatures extends Component<ISimpleFeaturesProps> {

  render() {
    return (
      <div>
        <TSXFeatures firstName={"Jon"} lovesTypeScript={this.props.lovesTypeScript}/>
        <JSXFeatures/>
      </div>
    );
  }
}
