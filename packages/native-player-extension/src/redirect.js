import qs from 'query-string';

document.addEventListener('DOMContentLoaded', () => {
  const { url } = qs.parse(location.search);
  document.getElementById('code').textContent = url;
  document.getElementById('link').href = url;
  document.getElementById('close').addEventListener('click', () => {
    window.close();
  });
});
