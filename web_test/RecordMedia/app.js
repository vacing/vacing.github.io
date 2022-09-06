`use strict`
const playVideoElm = document.querySelector("#player");
const audioInSelectElm = document.querySelector("#audioInputDevices");
const audioOutSelectElm = document.querySelector("#audioOutputDevices");
const videoInSelectElm = document.querySelector("#videoInputDevices");
var devicesInfosCache = []

navigator.mediaDevices.getUserMedia({audio: true, video: true})
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError)
function gotDevices(deviceInfos) {
    devicesInfosCache = deviceInfos;
    for (ind in deviceInfos) {
        const device = deviceInfos[ind];
        const option = document.createElement("option");
        option.value = ind;
        option.text = device.label;
        switch (device.kind) {
            case "audioinput": {
                audioInSelectElm.appendChild(option);
                break;
            }
            case "audiooutput": {
                audioOutSelectElm.appendChild(option);
                break;
            }
            case "videoinput": {
                videoInSelectElm.appendChild(option);
                break;
            }
            default:
                console.error("unknown device kind " + device.kind);
        }
    }
}

function handleError(error) {
  console.error(error.message, error.name);
}

function start() {
    console.log(devicesInfosCache)
    const audioInInd = audioInSelectElm.value;
    const videoInInd = videoInSelectElm.value;
    let constraints = {
            audio: true,
            video: true
    };
    if (devicesInfosCache.length > 0) {
        constraints = {
            audio: {deviceId: devicesInfosCache[audioInInd].deviceId},
            video: {deviceId: devicesInfosCache[videoInInd].deviceId}
        };
    }
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function gotStream(stream) {
     playVideoElm.srcObject = stream;
}

audioInSelectElm.onchange = start;
videoInSelectElm.onchange = start;
start();
