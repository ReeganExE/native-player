export default function sendNative(action) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendNativeMessage('org.js.ninh.nplayer', action, (response) => {
      if (chrome.runtime.lastError) {
        const error = new Error(chrome.runtime.lastError.message)

        setTimeout(() => reject(error), 1000)
      } else {
        const { payload = '' } = response
        if (payload.startsWith('{')) {
          response.payload = JSON.parse(payload)
        }

        resolve(response)
      }
    })
  })
}
