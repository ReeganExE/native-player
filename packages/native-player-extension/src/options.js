import sendNative from './native';

const $ = i => document.querySelector(i);

document.addEventListener('DOMContentLoaded', async () => {
  const info = $('#info');
  try {
    const res = await sendNative({ type: 'GET_CONFIG' });
    const { payload } = res;

    const args = payload.args || [];

    $('#path').value = payload.programPath;
    $('#args').value = args.join('\n');

    $('form').style.display = 'block';

    $('form').addEventListener('submit', async e => {
      e.preventDefault();
      const config = JSON.stringify({ programPath: $('#path').value, args: $('#args').value.split('\n').filter(Boolean) });
      await sendNative({ type: 'SET_CONFIG', payload: config });

      info.textContent = 'Saved';
      setTimeout(() => {
        $('#info').textContent = '';
      }, 2000);
    });
  } catch (error) {
    document.body.classList.add('error');
  }

  document.body.classList.remove('loading');
});
