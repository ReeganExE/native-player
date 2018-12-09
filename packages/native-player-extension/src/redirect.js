import { parse } from 'query-string';
import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  state = { installed: true, url: '', label: '' }

  componentDidMount() {
      const { url } = parse(window.location.search);

      const label = document.title = decodeURIComponent(url).split('/').pop();

      this.setState({ url, label });
      chrome.runtime.onMessage.addListener(this.onMessage);
  }

  componentWillMount() {
    chrome.runtime.onMessage.removeListener(this.onMessage);
  }

  onMessage = message => {
    console.log(message);

    if (message.type === 'ERROR') {
      this.setState({ installed: false });
    }
  }

  render() {
    const { url, installed, label } = this.state;
    return (
      <>
          <h1>Captured link:</h1>
          <a id="link" href={url}>{label}</a>
          <p>
            <a id="link" href={url}>{url}</a>
          </p>
          <p>
            <button id="close" onClick={() => window.close() }>Close</button>
          </p>
          <div>
            {
              installed || (
                <p id="message">
                  Cannot connect to native host.<br/>
                  Follow this <a href="https://github.com/ReeganExE/native-player/tree/master/bin">link</a> to download and install the native host.
                </p>
              )
            }
          </div>
      </>
    );
  }
}


render(<App />, document.body.appendChild(document.createElement('div')));
