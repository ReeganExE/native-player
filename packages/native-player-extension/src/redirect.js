import { parse } from 'query-string'
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'

function App() {
  const [installed, setInstalled] = useState(true)
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    const onMessage = (message) => {
      console.log(message)

      if (message.type === 'ERROR') {
        setInstalled(false)
      }
    }

    const { url: original } = parse(window.location.search)

    const fileName = decodeURIComponent(url).split('/').pop()
    document.title = fileName

    setLabel(fileName)
    setUrl(original)
    chrome.runtime.onMessage.addListener(onMessage)

    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [url])

  return (
    <>
      <h1>Captured link:</h1>
      Filename: <a href={url}>{label}</a>
      <p>
        <a href={url}>{url}</a>
      </p>
      <p>
        <button type="button" onClick={() => window.close()}>
          Close
        </button>
      </p>
      <div>
        {installed || (
          <p>
            Cannot connect to the native host.
            <br />
            Follow this
            <a href="https://github.com/ReeganExE/native-player/tree/master/bin">link</a>
            to download and install the native host.
          </p>
        )}
      </div>
    </>
  )
}

render(<App />, document.body.appendChild(document.createElement('div')))
