import { parse } from 'query-string';

document.addEventListener('DOMContentLoaded', () => {
  const { url } = parse(window.location.search);
  Object.assign(document.getElementById('link'), { href: url, textContent: url });
  document.title = decodeURIComponent(url).split('/').pop();
  document.getElementById('close').addEventListener('click', () => {
    window.close();
  });
});
