
var socket = io.connect('https://XXXXXXX.com', {
    //var socket = io.connect('https://26c5-84-122-159-51.ngrok.io', {
    transports: ['polling'],
    path: '/socket.io'
});


function normalizeExpressionCapture(expressions){
    let normalized = [];
    expressions.forEach((x)=>{
         
      // Checking if there is any object in arr2
      // which contains the key value
       if(normalized.some((val)=>{ return val["expression"] == x["expression"] })){
           
         // If yes! then increase the occurrence by 1
         normalized.forEach((k)=>{
           if(k["expression"] === x["expression"]){ 
             k["percent"]++
             k["avg"]+= x["probability"]

           }
        })
           
       }else{
         // If not! Then create a new object initialize 
         // it with the present iteration key's value and 
         // set the occurrence to 1
         let a = {}
         a["expression"] = x["expression"]
         a["percent"] = 1
         a["avg"]=x["probability"]
         normalized.push(a);
       }
    })

    normalized.forEach((x)=>{

       
        x["avg"]=Math.round((x["avg"]/x["percent"])* 100) / 100;
        x["percent"]= Math.round(((x["percent"]*100)/expressions.length) * 100) / 100;
    })
      
    return normalized;
  }


window.addEventListener("message", async function (event) {

    if (event.source != window)
        return;
    if (event.data.type && (event.data.type == "SEND_TO_SERVER")) {

        if (window.captureFaceExpression != undefined) {

            const detections = await window.captureFaceExpression();

            var register = Object.assign(new Register(), event.data.msg);
            var element = Object.assign(new Element(), register.element);

            if (detections.length > 0) {

                let expressions = detections[0].expressions.asSortedArray();

                expressions.sort((a, b) => b.probability - a.probability);

                //window.expressions.push(expressions[0].expression);
                window.expressions.push(expressions[0]);


            }
             
                //console.log(normalizeExpressionCapture(window.expressions));
               
                element.data.push(new ElementData("faceDetectionExpression", normalizeExpressionCapture(window.expressions)));
                window.expressions=[];
                register.element = element;


        } else {


            var register = Object.assign(new Register(), event.data.msg);

        }

        console.debug("Registro enviado al servidor...");
        console.debug(register);
        socket.emit('from_extension', register);

    }

});

socket.on("from_server", function (data) {

    //console.log(data);

    window.postMessage({ type: "FROM_SERVER", msg: data }, "*");

    console.debug("Mensaje recibido desde el servidor...");
    console.debug(data);

});