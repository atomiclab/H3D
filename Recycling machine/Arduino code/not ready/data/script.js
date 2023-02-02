var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
window.addEventListener('load', onload);
var direction;
var temperatura;

function onload(event) {
    initWebSocket();
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
}

function onClose(event) {
    console.log('Connection closed');
    document.getElementById("motor-state").innerHTML = "motor pausado"
    setTimeout(initWebSocket, 2000);
}

function submitForm(){
    const rbs = document.querySelectorAll('input[name="direction"]');
    direction;
    for (const rb of rbs) {
        if (rb.checked) {
            direction = rb.value;
            break;
        }
    }

    document.getElementById("motor-state").innerHTML = "motor funcionando";
    document.getElementById("motor-state").style.color = "blue";
    if (direction=="CW"){
        document.getElementById("gear").classList.add("spin");
    }
    else{
        document.getElementById("gear").classList.add("spin-back");
    }

    var steps = document.getElementById("steps").value;
    var temperatura = document.getElementById("temperatura").value;
    var calentar="1";
    websocket.send(steps+"&"+direction+"&"+calentar+"&"+temperatura);
}
function largo(){
    rbs = document.querySelectorAll('input[name="direction"]');
    direction;
    for (const rb of rbs) {
        if (rb.checked) {
            direction = rb.value;
            break;
        }
    }

    document.getElementById("motor-state").innerHTML = "motor funcionando";
    document.getElementById("motor-state").style.color = "blue";
    if (direction=="CW"){
        document.getElementById("gear").classList.add("spin");
    }
    else{
        document.getElementById("gear").classList.add("spin-back");
    }

    var steps = 1000;
    var temperatura = document.getElementById("temperatura").value;
    var calentar="1";
    websocket.send(steps+"&"+direction+"&"+calentar+"&"+temperatura);

}
function pausa(){
    rbs = document.querySelectorAll('input[name="direction"]');
    direction;
    for (const rb of rbs) {
        if (rb.checked) {
            direction = rb.value;
            break;
        }
    }

    document.getElementById("motor-state").innerHTML = "pausando";
    document.getElementById("motor-state").style.color = "blue";
    if (direction=="CW"){
        document.getElementById("gear").classList.add("spin");
    }
    else{
        document.getElementById("gear").classList.add("spin-back");
    }

    var steps = "0";
    var temperatura = "0";
    var calentar="0";
    websocket.send(steps+"&"+direction+"&"+calentar+"&"+temperatura);

}

function calentar(){

    document.getElementById("machine").innerHTML = "Calentando";
    document.getElementById("machine").style.color = "red";
    var temperatura = document.getElementById("temperatura").value;
    var calentar="1";
    websocket.send(0+"&"+0+"&"+calentar+"&"+temperatura);
}

function enfriar(){

    document.getElementById("machine").innerHTML = "Enfriando";
    document.getElementById("machine").style.color = "green";

    var calentar="0";
    var temperatura="0";
    websocket.send(0+"&"+0+"&"+calentar+"&"+temperatura);
}

function onMessage(event) {
    console.log(event.data);
    direction = event.data;
    temperatura=event.data.split("&");
    if (direction=="stop"){
      document.getElementById("motor-state").innerHTML = "motor pausado"
      document.getElementById("motor-state").style.color = "red";
      document.getElementById("gear").classList.remove("spin", "spin-back");
    }
    else if(direction=="CW" || direction=="CCW"){
        document.getElementById("motor-state").innerHTML = "motor andando...";
        document.getElementById("motor-state").style.color = "blue";
        if (direction=="CW"){
            document.getElementById("gear").classList.add("spin");
        }
        else{
            document.getElementById("gear").classList.add("spin-back");
        }
    }
  /*  if (direction>="20") {
      document.getElementById("temp").innerHTML=direction;
    }*/
    if (temperatura[4]>=0) {
      document.getElementById("temp").innerHTML=temperatura[4];
    }
    if (temperatura[3]>=0) {
      document.getElementById("desiretemp").innerHTML=temperatura[3];
    }
}
//actualizar estado cada 5 segs
setInterval(() => websocket.send(""+"&"+""+"&"+""+"&"+""+"&"+"1"), 5000);
