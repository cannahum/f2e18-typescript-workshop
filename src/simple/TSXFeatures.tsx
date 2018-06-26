import React from 'React';

interface IFeatureProps {
  firstName: string;
  lovesTypeScript: boolean;
}

export default class TSXFeatures extends React.Component<IFeatureProps> {
  render() {
    const {firstName, lovesTypeScript} = this.props;
    return (
      <div>
        Welcome {firstName}!
        You currently {lovesTypeScript ? 'love' : 'does not love'} TS.
      </div>
    );
  }
}
