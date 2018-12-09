import { parse } from 'query-string';
import { useEffect, useState } from 'react';
import { render } from 'react-dom';

function App() {
  const [installed, setInstalled] = useState(true);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const onMessage = message => {
      console.log(message);

      if (message.type === 'ERROR') {
        setInstalled(false);
      }
    };

    const { url } = parse(window.location.search);

    const label = document.title = decodeURIComponent(url).split('/').pop();

    setLabel(label);
    setUrl(url);
    chrome.runtime.onMessage.addListener(onMessage);

    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, [window.location.search]);

  return (
    <>
        <h1>Captured link:</h1>
        <a href={url}>{label}</a>
        <p>
          <a href={url}>{url}</a>
        </p>
        <p>
          <button onClick={() => window.close() }>Close</button>
        </p>
        <div>
          {
            installed || (
              <p>
                Cannot connect to the native host.<br/>
                Follow this <a href="https://github.com/ReeganExE/native-player/tree/master/bin">link</a> to download and install the native host.
              </p>
            )
          }
        </div>
    </>
  );
}

render(<App />, document.body.appendChild(document.createElement('div')));
