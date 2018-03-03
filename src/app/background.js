let lastError;
let TOKEN = '';
let DISABLED = false;
const NOT_FOUND = {status: 404, statusText: 'Not found'};
const CANCEL = {cancel: true};
const SUPPORTED_MEDIA = /\.(webm|mkv|flv|flv|vob|ogv|ogg|drc|gif|gifv|mng|avi|mov|wmv|yuv|rm|rmvb|asf|amv|mp4|m4p|m4v|mpg|mp2|mpeg|mpe|mpv|mpg|mpeg|m2v|m4v|svi|3gp|3g2|mxf|roq|nsv|flv)$/i;

chrome.contextMenus.create({
  title: 'Play',
  contexts: ['link'],
  // documentUrlPatterns: [''],
  targetUrlPatterns: ['*://www.fshare.vn/file/*'],
  onclick: function onClick(info) {
    chrome.browserAction.setBadgeText({text: ''});
    progress(true);

    let [, id] = info.linkUrl.split('fshare.vn/file/');
    id = id.replace('#', '');

    makeRequest(id);
  }
});

chrome.browserAction.onClicked.addListener(() => {
  setDisable(!DISABLED);
  // const error = getLastError();
  // error && alert(error);
  // chrome.browserAction.setBadgeText({text: ''});
});

let lastRequest = { timeStamp: 0 };

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  const { url } = details;

  if (DISABLED || !isSupported(url)) {
    return { cancel: false };
  }

  if (url !== lastRequest.urL) {
    sendNative(url);
  } else if (timeStamp - lastRequest.timeStamp > 10000) {
    sendNative(url);
  }

  lastRequest = details;

  return CANCEL;
},
  {
    urls: ["http://*.fshare.vn/*"]
  },
  ["blocking"]
);

function setDisable(status) {
  DISABLED = status;
  const path = DISABLED ? 'icon-disabled.png' : 'icon.png';
  chrome.browserAction.setIcon({path});
}

function isSupported(url) {
  return SUPPORTED_MEDIA.test(url);
}

function makeRequest(id, tried = false) {
  getStorageFile(id)
    .then(link => {
      if (link) {
        sendNative(link);
      }
    })
    .catch(e => {
      console.log(e);
      if (e.status === 400 && !tried) { // Bad request -> maybe token
        // try again
        refreshToken().then(() => makeRequest(id, true));
        return;
      }

      lastError = e.statusText;
      chrome.browserAction.setBadgeText({text: '' + e.status})
    })
    .then(() => progress(false));
}

function refreshToken() {
  return fetch('https://www.fshare.vn/folder/Y915D46AM1XD', {credentials: 'include'})
    .then(res => res.text())
    .then(doc => (TOKEN = doc.match(/data-token="([^"]+)"/)[1]));
}

function getLastError() {
  const error = lastError;
  lastError = '';
  return error;
}

function progress(yes) {
  const path = yes ? 'icon-2.png' : 'icon.png';
  chrome.browserAction.setIcon({path});
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
    .then(res => res.ok ? res :Promise.reject(res))
    .then(res => res.json());
}

function sendNative(link) {
  chrome.runtime.sendNativeMessage('org.js.ninh.nplayer', { Link: link }, function(response) {
    console.log("Received ", response);
  });
}

function getCookie(name) {
  return new Promise(resolve => {
    chrome.cookies.get({ name: 'fshare-app', url: 'https://www.fshare.vn/' }, cookie => resolve(cookie.value))
  });
}