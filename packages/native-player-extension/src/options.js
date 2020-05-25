import React, { useCallback, useState, useMemo } from 'react'
import { render } from 'react-dom'
import sendNative from './native'
import useOptions from './useOptions'

function Options() {
  const [config] = useOptions()
  const [saved, setSaved] = useState('')

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    const [programPath, args] = Array.from(new FormData(e.target).values())
    const toBeSaved = JSON.stringify({
      programPath,
      args: args ? args.split('\n').filter(Boolean) : []
    })
    await sendNative({ type: 'SET_CONFIG', payload: toBeSaved })

    setSaved('Saved')
    setTimeout(() => setSaved(''), 2000)
  }, [])
  const args = useMemo(() => config.args && config.args.join('\n'), [config.args])

  return (
    <>
      <form method="POST" onSubmit={onSubmit}>
        <div>
          <label htmlFor="path">
            <span>Program path:</span>
          </label>
          <input
            defaultValue={config.programPath}
            name="programPath"
            type="text"
            placeholder="Program path"
          />
        </div>
        <div>
          <label>
            <span>Additional arguments (new line):</span>
          </label>
          <textarea id="args" name="args" defaultValue={args} />
        </div>
        <div>
          <label className="program">
            <span>Native host location:</span>
          </label>
          <input type="text" id="program" defaultValue={config.hostPath} readOnly disabled />
        </div>
        <div>
          <button type="submit">Save</button>
          <span>{saved}</span>
        </div>
      </form>
      <div>
        <p id="message">
          Cannot connect to native host.
          <br />
          Follow this <a href="https://github.com/ReeganExE/native-player/tree/master/bin">
            link
          </a>{' '}
          to download and install the native host.
        </p>
      </div>
    </>
  )
}

render(<Options />, document.querySelector('div'))
