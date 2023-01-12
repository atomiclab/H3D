#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <WiFiClient.h>//Import WiFi library

#ifndef STASSID
#define STASSID "wifired"
#define STAPSK "wifipass"
#endif

const int led = 2;


#include <ESPAsyncWebServer.h>
#include "LittleFS.h"
#include <AccelStepper.h>

#define pinStep 2
#define pinDirection 5

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
String direction ="STOP";
String steps;
String calentar;

int temp = 30;

bool notifyStop = false;

// Initialize LittleFS
void initFS() {
  if (!LittleFS.begin()) {
    Serial.println("An error has occurred while mounting LittleFS");
  }
  else{
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

    steps = message.substring(0, message.indexOf("&"));
    direction = message.substring(message.indexOf("&")+1, message.length());
    calentar = message.substring(message.indexOf("&")+1, message.length());
    Serial.println("steps: " + steps);

    Serial.println("direction: " + direction);

    Serial.println("calentar: " + calentar);


 if (calentar=="1"){
      digitalWrite(led,1); //logica del hotend
      temp=temp+1;

    }
 if (calentar=="0"){
     digitalWrite(led,0);
      temp=temp-1;

    }


    notifyClients(direction);
    notifyStop = true;
    if (direction == "CW"){
      Serial.print("CW");
      stepper.move(steps.toInt());
    }
    else{
      Serial.print("CCW");
      stepper.move(-steps.toInt());
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

void setup() {

//pines
 pinMode(led,OUTPUT);



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
  stepper.setMaxSpeed(1000);
  stepper.setAcceleration(100);

  // Web Server Root URL
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(LittleFS, "/index.html", "text/html");
  });

  server.serveStatic("/", LittleFS, "/");

  server.begin();
}

void loop() {
  ArduinoOTA.handle();
  if (stepper.distanceToGo() == 0 && notifyStop == true){
    direction = "stop";
    notifyClients(direction);
    notifyClients(String(temp));
    notifyStop = false;
  }
  ws.cleanupClients();
  stepper.run();
}
