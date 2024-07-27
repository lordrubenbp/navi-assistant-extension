window.expressions=[];

window.addEventListener("message", function (event) {

    if (event.source != window)
        return;
    if (event.data.type && (event.data.type == "INIT_FACE_RECOGNITION")) {

        Promise.all(
            [
                faceapi.nets.tinyFaceDetector.loadFromUri(event.data.msg.models),
                faceapi.nets.faceRecognitionNet.loadFromUri(event.data.msg.models),
                faceapi.nets.faceExpressionNet.loadFromUri(event.data.msg.models),

            ]
        ).then(

            window.postMessage({ type: "INIT_IMAGE_CAPTURE" }, "*")
        );

    }


    if (event.data.type && (event.data.type == "IMAGE_CAPTURE_READY")) {


        window.captureFaceExpression = async function captureFaceExpression() {

            try {
        
                return window.imageCapture.takePhoto().then(async function (blob) {
            
                    img = document.createElement("img");
                    img.src = URL.createObjectURL(blob);
                        
                    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            
                    return detections;
                        
                }).catch(function (error) {
                    console.error('takePhoto() error: ', error);
                });
        
            } catch (error) {
        
                console.warn(error);
        
            }
           
        
        
        }

        setInterval(async function () {


            const detections = await window.captureFaceExpression();

           

            if (detections != undefined && detections.length > 0) {

        
                let expressions = detections[0].expressions.asSortedArray();

                expressions.sort((a, b) => b.probability - a.probability);

                console.debug(expressions[0]);

                window.expressions.push(expressions[0]);
                
            }

        
        }, 2000);

    }

});






