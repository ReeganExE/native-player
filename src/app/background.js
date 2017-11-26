let lastError;
let TOKEN = '';
const NOT_FOUND = {status: 404, statusText: 'Not found'};
const CANCEL = {cancel: true};

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
  const error = getLastError();
  error && alert(error);
  chrome.browserAction.setBadgeText({text: ''});
});

let lastRequest = { timeStamp: 0 };

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  // console.log(details);

  if (details.url !== lastRequest.url) {
    sendNative(details.url);
    // $.get('http://localhost:3000/play?url='+encodeURIComponent(details.url));
  } else if (details.timeStamp - lastRequest.timeStamp > 10000) {
    sendNative(details.url);
    // $.get('http://localhost:3000/play?url='+encodeURIComponent(details.url));
  }
  lastRequest = details;

  return CANCEL;
},
  {
    urls: ["http://*.fshare.vn/*"]
  },
  ["blocking"]
);

function makeRequest(id, tried = false) {
  getStorageFile([id])
    .then(([link]) => {
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
  const path = yes ? '158131-201.png' : '158131-200.png';
  chrome.browserAction.setIcon({path});
}


function getStorageFile(items) {
  var postData = {
    items,
    token: TOKEN
  };

  return fetch('https://www.fshare.vn/api/session/downloadsidebyside', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
  .then(res => res.ok ? res :Promise.reject(res))
  .then(res => res.json())
  .then(a => a.map(a => a.split('|')[0]));
}

function sendNative(link) {
  chrome.runtime.sendNativeMessage('org.js.ninh.nplayer', { Link: link }, function(response) {
    console.log("Received ", response);
  });
}