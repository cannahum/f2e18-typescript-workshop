import React from 'react';
import {render} from 'react-dom';
import SimpleFeatures from './SimpleFeatures';
import ComplexFeatures from './ComplexFeatures';

class App extends React.Component {
  render() {
    return <div>
      <h2>Simple Features</h2>
      <hr/>
      <SimpleFeatures lovesTypeScript={true}/>
      <br/>
      <h2>Complex Features</h2>
      <hr/>
      <ComplexFeatures lovesTypeScript={true}/>
    </div>;
  }
}

render(<App/>, document.getElementById('target'));
