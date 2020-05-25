import React, { useCallback, useEffect, useState } from 'react'
import { render } from 'react-dom'
import sendNative from './native'
import useOptions from './useOptions'

function Options() {
  // const [config, setConfig] = useState({
  //   args: [],
  //   hostPath: '',
  //   programPath: ''
  // });

  const [config, { setPath }] = useOptions()
  const [saved, setSaved] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const toBeSaved = JSON.stringify({
      programPath: config.programPath,
      args: config.args.filter(Boolean)
    })
    await sendNative({ type: 'SET_CONFIG', payload: toBeSaved })

    // setPath('' + Date.now());
    setSaved('Saved')
    setTimeout(() => setSaved(''), 2000)
  }

  return (
    <>
      <form method="POST" onSubmit={onSubmit}>
        <div>
          <label htmlFor="path">
            <span>Program path:</span>
          </label>
          <input
            value={config.programPath}
            onChange={(e) => setPath(e.target.value)}
            type="text"
            placeholder="Program path"
          />
        </div>
        <div>
          <label>
            <span>Additional arguments (new line):</span>
          </label>
          <textarea id="args" />
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

// const $ = i => document.querySelector(i);

// document.addEventListener('DOMContentLoaded', async () => {
//   const info = $('#info');
//   try {
//     const res = await sendNative({ type: 'GET_CONFIG' });
//     const { payload } = res;

//     const args = payload.args || [];

//     $('#path').value = payload.programPath;
//     $('#args').value = args.join('\n');
//     $('#program').value = payload.hostPath || '';

//     $('form').style.display = 'block';

//     $('form').addEventListener('submit', async e => {
//       e.preventDefault();
//       const config = JSON.stringify({ programPath: $('#path').value, args: $('#args').value.split('\n').filter(Boolean) });
//       await sendNative({ type: 'SET_CONFIG', payload: config });

//       info.textContent = 'Saved';
//       setTimeout(() => {
//         $('#info').textContent = '';
//       }, 2000);
//     });
//   } catch (error) {
//     document.body.classList.add('error');
//   }

//   document.body.classList.remove('loading');
// });
