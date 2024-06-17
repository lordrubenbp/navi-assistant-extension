var version = document.getElementById("version");

version.innerHTML =chrome.runtime.getManifest().version;

var closeButton=document.getElementById("closeButton");

closeButton.addEventListener('click', function() {
   
    window.close();

});
