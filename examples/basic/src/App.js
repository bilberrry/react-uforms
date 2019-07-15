import React, { Component } from 'react';
import ExampleSimpleForm from './components/ExampleSimpleForm';
import ExampleValidation from './components/ExampleValidation';
import ExampleCustomValidation from './components/ExampleCustomValidation';
import ExamplePreFilledForm from './components/ExamplePreFilledForm';
import ExampleDynamicForm from './components/ExampleDynamicForm';
import ExampleCustomErrors from './components/ExampleCustomErrors';
import ExampleAllFields from './components/ExampleAllFields';
import ExampleValuesDiff from './components/ExampleValuesDiff';
import ExampleCustomField from './components/ExampleCustomField';
import Menu from './components/Menu';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="header">
              <h1>react-uforms</h1>
              <span className="d-block d-md-none nav-mobile">
                <Menu />
              </span>
              <span>&nbsp;&nbsp;</span>
              <a
                className="repo"
                href="https://github.com/summerua/react-uforms"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt="GitHub" src="https://img.shields.io/badge/GitHub--%20.svg?logo=github&style=social" />
              </a>
            </div>
            <p className="lead">
              Simple and elegant forms for your <a href="https://github.com/facebook/react">React</a> application.
            </p>
            <h2>Installation</h2>
            <p>Using Yarn</p>

            <pre className="language-bash">
              <code className="language-bash">yarn add react-uforms</code>
            </pre>
            <p>Or NPM</p>
            <pre className="language-bash">
              <code className="language-bash">npm install react-uforms --save</code>
            </pre>
            <h2>Usage</h2>
            <ExampleSimpleForm id={1} />
            <ExampleValidation id={2} />
            <ExampleCustomValidation id={3} />
            <ExamplePreFilledForm id={4} />
            <ExampleDynamicForm id={5} />
            <ExampleCustomErrors id={6} />
            <ExampleAllFields id={7} />
            <ExampleValuesDiff id={8} />
            <ExampleCustomField id={9} />
            <footer>
              <p>
                React uForms is <a href="https://github.com/summerua/react-uforms/blob/master/LICENSE">MIT licensed</a>
              </p>
            </footer>
          </div>
          <div className="col-md-3 d-none d-md-block nav-desktop">
            <Menu />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
