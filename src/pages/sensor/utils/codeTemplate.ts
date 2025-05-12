// @/pages/sensor/utils/codeTemplate.ts
import { URL_BACK } from "@/config";

export const InterfaceTemplateCode = (): string => `// hermes.h
#ifndef hermes_H
#define hermes_H

#include <Arduino.h>

bool connectToWiFi(const char* ssid, const char* password);
String buildJsonPayload(const char* teamId, const char* token, const char* sensorId, bool state);
bool hermesControl(const char* sensorId, const char* teamId, const char* token, bool state, const char* serverUrl);

#endif
`;

export const ClassTemplateCode = (): string => `// hermes.cpp
#include "hermes.h"
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

bool connectToWiFi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a Wi-Fi...");

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(1000);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConectado a Wi-Fi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("\nFallo al conectar a Wi-Fi.");
    return false;
  }
}

String buildJsonPayload(const char* teamId, const char* token, const char* sensorId, bool state) {
  StaticJsonDocument<512> doc;
  doc["credentials"]["publicKey"] = teamId;
  doc["credentials"]["secretKey"] = token;
  doc["data"]["sensorId"] = sensorId;
  doc["data"]["state"] = state;

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  return jsonPayload;
}

bool hermesControl(const char* sensorId, const char* teamId, const char* token, bool state, const char* serverUrl) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi desconectado. Intentando reconectar...");
    return false;
  }

  HTTPClient http;
  WiFiClient client;

  if (!http.begin(client, serverUrl)) {
    Serial.println("Error al iniciar conexión HTTP");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  String jsonPayload = buildJsonPayload(teamId, token, sensorId, state);
  Serial.print("Enviando comando: ");
  Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("Código de respuesta: ");
    Serial.println(httpResponseCode);
    Serial.println(http.getString());
    http.end();
    return true;
  } else {
    Serial.print("Error en la solicitud HTTP: ");
    Serial.println(httpResponseCode);
    http.end();
    return false;
  }
}
`;

export const MainTemplateCode = (
  sensorId: string,
  teamId: string,
  token: string
): string => `// main.ino 
#include <hermes.h>

const char* ssid = "MiRedWiFi";
const char* password = "MiClaveSecreta";
const char* serverUrl = "${URL_BACK}/api/sensor/control";
const char* sensorId = "${sensorId}";
const char* teamId = "${teamId}";
const char* token = "${token}";

void setup() {
  Serial.begin(115200);
  connectToWiFi(ssid, password);
  hermesControl(sensorId, teamId, token, true, serverUrl);
}

void loop() {
  // lógica del loop
}
`;
