//
//
// Libraries required:
// - NTC_Thermister (Yurii Salimov) [Source: Arduino Library Manager]
// - PID (Brett Beuuregard) [Source: Arduino Library Manager]

//cambiar la funcion ReadTemp por la del NTCThermistor lib

#include <Arduino.h>

///////wifi
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <WiFiClient.h>//Import WiFi library
/////////////
#include <TaskScheduler.h>

void heaterFc();
Scheduler runner;
Task heaterTask(500, TASK_FOREVER, &heaterFc);
////////////Temp config ////////////

#include <NTC_Thermistor.h>
#include <SmoothThermistor.h>
#include <PID_v2.h>

#define SMOOTHING_WINDOW 6
#define MOSFET_GATE_PIN 5
#define THERMISTOR_PIN A0

#define KP 19.83
#define KI 1.33
#define KD 73.73

NTC_Thermistor* thermistor = new NTC_Thermistor(THERMISTOR_PIN, 10000, 100000, 25, 4060);
SmoothThermistor* sthermistor = new SmoothThermistor(thermistor, SMOOTHING_WINDOW);
bool pOnM = false;
double pwmOut, curTemp, setTemp = 220;
PID pid(&curTemp, &pwmOut, &setTemp, KP, KI, KD, P_ON_E, DIRECT);
///////////////////////

///web server
#include <ESPAsyncWebServer.h>
#include "LittleFS.h"
#include <AccelStepper.h>
/////

////other things
#include <math.h>
#include <String.h>



#ifndef STASSID
#define STASSID "@TheAtomicLab 3"
#define STAPSK "superheroes1"
#endif

//#define led 5
#define ENA 0 //enable or disable stepper

//termistor
#define therm_pin A0
int Vo;
float R1 = 10000;
float logR2, R2, T, Tc;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;


//stepper
#define PIN_D2 16  //usa el bendito GPIO no las Digitales del arduino ide es el 2 y por eso los vuelvo a declarar 
#define PIN_D5 14 // es el 5 

#define pinStep PIN_D2 // Motor X en el CNC Shield
#define pinDirection PIN_D5 // Motor X en el CNC Shield

AccelStepper stepper(1, pinStep, pinDirection);


String message = "";

// Replace with your network credentials
const char* ssid = "@TheAtomicLab 3";
const char* password = "superheroes1";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Create a WebSocket object
AsyncWebSocket ws("/ws");

//Variables to save values from HTML forms
String direction = "STOP";
String steps;
String calentar;

int temp = 30;
String displaytemp;

int desiretemp = 0;
String displaydesiretemp;
String otro; //errores, comentarios, pedidos, etc

bool notifyStop = false;

// Initialize LittleFS
void initFS() {
  if (!LittleFS.begin()) {
    Serial.println("An error has occurred while mounting LittleFS");
  }
  else {
    Serial.println("LittleFS mounted successfully");
  }
}

// Initialize WiFi
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}

void notifyClients(String state) {
  ws.textAll(state);
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    message = (char*)data;
    Serial.println("llega: " + message);

    String parts[10];
    int count = 0;
    int pos = message.indexOf('&');
    while (pos != -1) {
      parts[count] = message.substring(0, pos);
      message = message.substring(pos + 1);
      count++;
      pos = message.indexOf('&');
    }
    parts[count] = message;

    Serial.println("en 0 " + parts[0]);
    Serial.println("en 1 " + parts[1]);
    Serial.println("en 2 " + parts[2]);
    Serial.println("en 3 " + parts[3]);
    Serial.println("en 4 " + parts[3]);
   
    if (parts[0]>="0"){
    steps = parts[0];
    direction = parts[1];
    calentar = parts[2];
    displaydesiretemp = parts[3];
    }
    otro = parts[4];

    Serial.println("steps: " + steps);
    Serial.println("direction: " + direction);
    Serial.println("calentar: " + calentar);
    Serial.println("desiretemp: " + displaydesiretemp);

    temp = tempread();

    notifyClients(steps + "&" + direction);
    notifyStop = true;
    if (direction == "CW") {
      Serial.print("CW");
      stepper.move(steps.toInt());
    }
    else {
      Serial.print("CCW");
      stepper.move(-steps.toInt());
    }

    if (calentar == "1") {

      if ((temp >= 0) && (temp <= 250))
      {
        setTemp = 230;
      } else {
        setTemp = 0;
      }
      notifyClients(steps + "&" + direction + "&" + calentar + "&" + displaydesiretemp + "&" + String(temp));

    }
    if (calentar == "0") {
      setTemp = 0;
      notifyClients(steps + "&" + direction + "&" + calentar + "&" + displaydesiretemp + "&" + String(temp));

    }
    if (otro == "1") { //pregunto por el codigo de temp e imprimo solo la temperatura
      notifyClients(steps + "&" + direction + "&" + calentar + "&" + displaydesiretemp + "&" + String(temp));
    }

  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      //Notify client of motor current state when it first connects
      notifyClients(direction);
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      handleWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
      break;
  }
}

void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}

float tempread() {

  //logica temp

  Vo = analogRead(therm_pin);
  R2 = R1 * (1023.0 / (float)Vo - 1.0);
  logR2 = log(R2);
  T = (1.0 / (c1 + c2 * logR2 + c3 * logR2 * logR2 * logR2));
  Tc = T - 273.15;
  //Serial.print("Temperatura");
  // Serial.print(Tc);
  // Serial.println(" C");
  return sthermistor->readCelsius();
}

void heaterFc() {

  if (calentar == "1") {

    curTemp = sthermistor->readCelsius();


    if (!pOnM && abs(curTemp - setTemp) <= max(curTemp, setTemp) * 0.2) {
      pOnM = true;
      pid.SetTunings(KP, KI, KD, P_ON_M);
      Serial.println("P_ON_M activated.");
    }
    // Prevent thermal overrun in case of PID malfunction
    pid.Compute();
    if (curTemp < 260) {
      analogWrite(MOSFET_GATE_PIN, pwmOut);
    }
    else {
      Serial.println("Thermal overrun detected!");
      analogWrite(MOSFET_GATE_PIN, 0);
    }
    // Display stats
    Serial.print("pwmOut = "); Serial.print(pwmOut); Serial.print(", ");
    Serial.print("diff = "); Serial.print(setTemp - curTemp); Serial.print(", ");
    Serial.print("curTemp = "); Serial.print(round(curTemp));
    Serial.print(" / "); Serial.println(round(setTemp));
  }

}

void setup() {

  //pines
  //pinMode(led, OUTPUT);
  pinMode(ENA, OUTPUT);

  pinMode(therm_pin, INPUT);
  analogReference(EXTERNAL);

  /// PID y Temp configs
  // pinMode(LED_BUILTIN, OUTPUT);
  pinMode(MOSFET_GATE_PIN, OUTPUT);
  // digitalWrite(LED_BUILTIN, LOW);
  pid.SetMode(AUTOMATIC);

  ////Task
  runner.addTask(heaterTask);
  heaterTask.enable();

  //arduino OTA
  ArduinoOTA.setPassword("admin");

  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else {  // U_FS
      type = "filesystem";
    }

    // NOTE: if updating FS this would be the place to unmount FS using FS.end()
    Serial.println("Start updating " + type);
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) {
      Serial.println("Auth Failed");
    } else if (error == OTA_BEGIN_ERROR) {
      Serial.println("Begin Failed");
    } else if (error == OTA_CONNECT_ERROR) {
      Serial.println("Connect Failed");
    } else if (error == OTA_RECEIVE_ERROR) {
      Serial.println("Receive Failed");
    } else if (error == OTA_END_ERROR) {
      Serial.println("End Failed");
    }
  });
  ArduinoOTA.begin();

  // Serial port for debugging purposes
  Serial.begin(115200);


  initWiFi();
  initWebSocket();
  initFS();
  stepper.setMaxSpeed(300);
  stepper.setAcceleration(50);

  // Web Server Root URL
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(LittleFS, "/index.html", "text/html");
  });

  server.serveStatic("/", LittleFS, "/");

  server.begin();


}


void loop() {


  ArduinoOTA.handle();
  digitalWrite(ENA, LOW); //logica del hotend
  if (stepper.distanceToGo() == 0 && notifyStop == true) {
    direction = "stop";
    notifyClients(direction);
    // notifyClients(String(temp));
    notifyStop = false;
  }
  ws.cleanupClients();
  /*stepper.setSpeed(400);
    stepper.runSpeed();*/
  stepper.run();
  runner.execute();

  /*/Temp
    // Turn on LED if we are within 1% of target temperature

    //digitalWrite(LED_BUILTIN, abs(curTemp - setTemp) / setTemp <= 0.01);

    // To speed things up, only switch to proportional-on-measurement when we are near target temperature
    // See: http://brettbeauregard.com/blog/2017/06/introducing-proportional-on-measurement/
  */



  //temp=tempread();
  //logicatemperatura
  // notifyClients(steps+ "&" + direction + "&" + calentar + "&" + displaydesiretemp + "&" + String(temp));
}
