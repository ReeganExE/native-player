import debounce from 'lodash.debounce';
import sendNative from './native';

let DISABLED = false;
const CANCEL = { cancel: true };

// eslint-disable-next-line max-len
const SUPPORTED_MEDIA = /\.(webm|mkv|flv|flv|vob|ogv|ogg|drc|gif|gifv|mng|avi|mov|wmv|yuv|rm|rmvb|asf|amv|mp4|m4p|m4v|mpg|mp2|mpeg|mpe|mpv|mpg|mpeg|m2v|m4v|svi|3gp|3g2|mxf|roq|nsv|flv)$/i;

chrome.contextMenus.create({
  title: 'Play',
  contexts: ['link'],
  // documentUrlPatterns: [''],
  targetUrlPatterns: ['*://www.fshare.vn/file/*'],
  onclick: function onClick(info) {
    chrome.browserAction.setBadgeText({ text: '' });
    progress(true);

    let [, id] = info.linkUrl.split('fshare.vn/file/');
    id = id.replace('#', '');

    makeRequest(id);
  }
});

chrome.browserAction.onClicked.addListener(() => {
  setDisable(!DISABLED);
});

let lastRequest = { timeStamp: 0 };

const debouncedSendNative = debounce(sendNative, 10000, { leading: true });

chrome.webRequest.onBeforeRequest.addListener(details => {
  const { url, tabId } = details;

  if (DISABLED || !isSupported(url)) {
    return { cancel: false };
  }

  if (url !== lastRequest.urL) {
    lastRequest = details;
    debouncedSendNative({ type: 'PLAY', payload: url })
      .then(res => chrome.tabs.sendMessage(tabId, res))
      .catch(e => chrome.tabs.sendMessage(tabId, { type: 'ERROR', payload: e.message }));

    return redirect(url);
  }

  return CANCEL;
},
{
  urls: ['http://*.fshare.vn/*']
},
['blocking']
);

function redirect(url) {
  return { redirectUrl: `${chrome.runtime.getURL('redirect.html')}?url=${encodeURIComponent(url)}` };
}

function setDisable(status) {
  DISABLED = status;
  const path = DISABLED ? 'icon-disabled.png' : 'icon.png';
  chrome.browserAction.setIcon({ path });
}

function isSupported(url) {
  return SUPPORTED_MEDIA.test(url);
}

function makeRequest(id) {
  getStorageFile(id)
    .then(link => {
      if (link) {
        sendNative({ type: 'PLAY', payload: link });
      }
    })
    .catch(e => {
      console.log(e);
      chrome.browserAction.setBadgeText({ text: '' + e.status });
    })
    .then(() => progress(false));
}

function progress(yes) {
  const path = yes ? 'icon-2.png' : 'icon.png';
  chrome.browserAction.setIcon({ path });
}


function getStorageFile(id) {
  return getCookie()
    .then(cookie => fetch('https://www.fshare.vn/api/v3/files/download?linkcode=' + id, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${cookie}`
      }
    }))
    .then(res => res.ok ? res : Promise.reject(res))
    .then(res => res.json());
}

function getCookie() {
  return new Promise(resolve => {
    chrome.cookies.get({ name: 'fshare-app', url: 'https://www.fshare.vn/' }, cookie => resolve(cookie.value));
  });
}
