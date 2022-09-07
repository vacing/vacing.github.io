`use strict`
const playVideoElm = document.querySelector("#player");
const audioInSelectElm = document.querySelector("#audioInputDevices");
const audioOutSelectElm = document.querySelector("#audioOutputDevices");
const videoInSelectElm = document.querySelector("#videoInputDevices");
var devicesInfosCache = []

function gotDevices(deviceInfos) {
    devicesInfosCache = deviceInfos;
    for (ind in deviceInfos) {
        const device = deviceInfos[ind];
        const option = document.createElement("option");
        option.value = ind;
        switch (device.kind) {
            case "audioinput": {
                option.text = device.label || `microphone ${audioInSelectElm.length + 1}`;
                audioInSelectElm.appendChild(option);
                break;
            }
            case "audiooutput": {
                option.text = device.label || `speaker ${audioOutSelectElm.length + 1}`;
                audioOutSelectElm.appendChild(option);
                audioOutSelectElm.value = option.value;
                break;
            }
            case "videoinput": {
                option.text = device.label || `camera ${videoInSelectElm.length + 1}`;
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
    console.log(devicesInfosCache);
    const audioInInd = audioInSelectElm.value;
    const videoInInd = videoInSelectElm.value;
    let constraints = { audio: {deviceId: undefined}, video: {deviceId: undefined} };
    if (devicesInfosCache.length > 0) {
        if (audioInInd) {
            constraints.audio.deviceId = devicesInfosCache[audioInInd].deviceId;
        } else {
            constraints.audio = false;
        }
        if (videoInInd) {
            constraints.video.deviceId = devicesInfosCache[videoInInd].deviceId;
        } else {
            constraints.video = false;
        }
    }
    console.log(constraints)
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function gotStream(stream) {
     playVideoElm.srcObject = stream;
}

audioInSelectElm.onchange = start;
videoInSelectElm.onchange = start;
start();
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError)
