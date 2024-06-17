
chrome.runtime.onInstalled.addListener(async (details) => {

    if (details.reason == "install") {

        let url = chrome.runtime.getURL("webpages/welcome.html");
        chrome.tabs.create({ url });

    } else if (details.reason == "update") {

        let url = chrome.runtime.getURL("webpages/updated.html");
        chrome.tabs.create({ url });

    }

});

async function captureStream(tabId) {

    await navigator.mediaDevices.getUserMedia({video: true})
    .then(mediaStream => {
      //document.querySelector('video').srcObject = mediaStream;
  
      const track = mediaStream.getVideoTracks()[0];
      var imageCapture = new ImageCapture(track);
  
      if(imageCapture!=undefined){

        window.imageCapture=imageCapture;
        window.postMessage({ type: "IMAGE_CAPTURE_READY" }, "*");
        
      }
     

    })
    .catch(error => console.log(error));
  }
  
  async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    
    console.log(tab);
  
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      args:[tab.id],
      world: 'MAIN',
      func: captureStream,
    });
  }
  

  chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
  
    console.log(msg);
  
    await getCurrentTab();
  
  
  });