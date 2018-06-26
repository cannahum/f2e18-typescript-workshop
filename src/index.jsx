import React from 'react';
import {render} from 'react-dom';
// import {SimpleFeatures} from './SimpleFeatures';
// import {ComplexFeatures} from './ComplexFeatures.tsx';

class App extends React.Component {
    render() {
        return <div>
            <h2>Simple Features</h2>
            <hr/>
            {/*<SimpleFeatures/>*/}
            <br/>
            <h2>Advanced Features</h2>
            <hr/>
            {/*<ComplexFeatures/>*/}
        </div>;
    }
}

render(<App/>, document.getElementById('target'));
