import React, { Component } from 'react';
import ExampleSimpleForm from './components/ExampleSimpleForm';
import ExampleValidation from './components/ExampleValidation';
import ExampleCustomValidation from './components/ExampleCustomValidation';
import ExamplePreFilledForm from './components/ExamplePreFilledForm';
import ExampleDynamicForm from './components/ExampleDynamicForm';
import ExampleCustomErrors from './components/ExampleCustomErrors';
import ExampleAllFields from './components/ExampleAllFields';
import ExampleValuesDiff from './components/ExampleValuesDiff';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="lead">
          <h1>React uForms</h1>
          <a className="repo" href="https://github.com/summerua/react-uforms" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <p>
            Simple and elegant forms for your <a href="https://github.com/facebook/react">React</a> application.
            <br />
            <small>
              React uForms based on <a href="https://reactjs.org/docs/context.html">Context API</a> (React v16.6 or
              higher).
            </small>
          </p>
        </div>
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
        <ExampleSimpleForm />
        <hr />
        <ExampleValidation />
        <hr />
        <ExampleCustomValidation />
        <hr />
        <ExamplePreFilledForm />
        <hr />
        <ExampleDynamicForm />
        <hr />
        <ExampleCustomErrors />
        <hr />
        <ExampleAllFields />
        <hr />
        <ExampleValuesDiff />
        <hr />
        <footer>
          <p>
            React uForms is <a href="https://github.com/summerua/react-uforms/blob/master/LICENSE">MIT licensed</a>
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
