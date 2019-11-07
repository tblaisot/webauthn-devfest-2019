import React, {useEffect, useRef} from "react";


export const Camera = () => {
  const videoRef = useRef();
  useEffect(() => {
    const videoElement = videoRef.current;
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices()
        .then(deviceInfos => {
          console.log(deviceInfos);
          const selectedDevice = deviceInfos.find(info => {
            return info.kind === "videoinput" && info.label === "Microsoft® LifeCam HD-3000 (045e:0810)"
          });
          console.log(selectedDevice);
          return selectedDevice.deviceId
        }).then(videoSelect => {
        const constraints = {
          video: {
            deviceId: {exact: videoSelect}
          }
        };
        // Not adding `{ audio: true }` since we only want video now
        return navigator.mediaDevices.getUserMedia(constraints)
      })
        .then(stream => {
          //video.src = window.URL.createObjectURL(stream);
          videoElement.srcObject = stream;
          videoElement.play();
        });

    }
  }, []);

  return (
    <video ref={videoRef} style={{display: 'block'}}></video>
  );
};
