// @/pages/sensor/utils/codeTemplate.ts
import { URL_BACK } from "@/config";

export const InterfaceTemplateCode = (): string => `// hermes.h
#ifndef hermes_H
#define hermes_H

#include <Arduino.h>

bool connectToWiFi(const char* ssid, const char* password);
bool hermesControl(const char* sensorId, const char* teamId, const char* token, const char* serverUrl, String value);

#endif
`;

export const ClassTemplateCode = (): string => `// hermes.cpp
#include "hermes.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

bool connectToWiFi(const char* ssid, const char* password) {
  WiFi.disconnect(true);
  delay(1000);
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.setSleep(false);

  Serial.printf("Conectando a: ", ssid);
  WiFi.begin(ssid, password);

  int maxRetries = 20;
  for (int retries = 0; retries < maxRetries; retries++) {
    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("Conectado! IP: ");
      Serial.println(WiFi.localIP());
      return true;
    }
    Serial.print(".");
    delay(500);
  }

  Serial.printf("Falló la conexión. Código: %d", WiFi.status());
  return false;
}

String buildJsonPayload(const char* teamId, const char* token, const char* sensorId, String value) {
  StaticJsonDocument<512> doc;
  doc["credentials"]["publicKey"] = teamId;
  doc["credentials"]["secretKey"] = token;
  doc["data"]["sensorId"] = sensorId;
  doc["data"]["value"] = value;

  String jsonPayload;
  serializeJson(doc, jsonPayload);
  return jsonPayload;
}

bool hermesControl(const char* sensorId, const char* teamId, const char* token, const char* serverUrl, String value) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi desconectado. Intentando reconectar...");
    return false;
  }

  HTTPClient http;
  WiFiClientSecure client;

  // Desactivar la verificación de certificados SSL
  client.setInsecure();

  if (!http.begin(client, serverUrl)) {
    Serial.println("Error al iniciar conexión HTTP");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  String jsonPayload = buildJsonPayload(teamId, token, sensorId, value);
  //Serial.print("Enviando comando: ");
  //Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("Código de respuesta: ");
    Serial.println(httpResponseCode);

    // Obtener la respuesta como String
    String response = http.getString();

    // Parsear el JSON para extraer el campo "message"
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error) {
      const char* message = doc["message"];
      Serial.print("Mensaje del servidor: ");
      Serial.println(message);
    } else {
      Serial.print("Error al parsear JSON: ");
      Serial.println(error.c_str());
    }

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

#define trig 12
#define echo 14

const char* ssid = "MiRedWiFi";
const char* password = "MiClaveSecreta";
const char* serverUrl = "${URL_BACK}/api/sensor/data";
const char* sensorId = "${sensorId}";
const char* teamId = "${teamId}";
const char* token = "${token}";

float distancia;

void setup() {
  Serial.begin(115200);

  // Configurar pines
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  digitalWrite(trig, LOW);

  // Conectar a WiFi con mÃ¡s intentos
  bool conectado = connectToWiFi(ssid, password);
}

void loop() {
  distancia = CalcularDistancia();
  Serial.print("Distancia: ");
  Serial.print(distancia);
  Serial.println(" cm");
  hermesControl(sensorId, teamId, token, serverUrl, String(distancia));
  delay(5000);
}

float CalcularDistancia() {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  unsigned long tiempo = pulseIn(echo, HIGH, 30000);
  if (tiempo == 0) return -1.0;

  return (tiempo * 0.0343) / 2;
}
`;

export const JavaScriptTemplateCode = (sensorId: string): string => `// Ejemplo de cómo obtener datos de un sensor usando fetch en JavaScript
// Función para obtener datos del sensor
async function fetchSensorData(sensorId, options = {}) {
  try {
    // Construir la URL con parámetros
    const baseUrl = "${URL_BACK}/api/sensor/data/${sensorId}";
    const queryParams = new URLSearchParams();

    // Agregar parámetros opcionales si existen
    if (options.limit) queryParams.append("limit", options.limit);
    if (options.startDate) queryParams.append("startDate", options.startDate);
    if (options.endDate) queryParams.append("endDate", options.endDate);

    const url = \`${URL_BACK}?\${queryParams.toString()}\`;

    // Hacer la solicitud GET
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Ejemplo de autenticación (descomentar si es necesario):
        // "Authorization": "Bearer tu-token-aqui"
      },
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(\`Error HTTP: \${response.status} \${response.statusText}\`);
    }

    // Parsear la respuesta JSON
    const result = await response.json();

    // Verificar si la solicitud fue exitosa
    if (!result.success) {
      throw new Error(result.message || "Error al obtener los datos del sensor");
    }

    // Retornar los datos
    return result.data;
  } catch (error) {
    console.error("Error al obtener datos del sensor:", error.message);
    throw error;
  }
}

// Ejemplo de uso
async function main() {
  try {
    // Parámetros de ejemplo
    const sensorId = "${sensorId}";
    const options = {
      limit: 10, // Límite de 10 registros
      startDate: "2025-05-01", // Fecha de inicio (formato YYYY-MM-DD)
      endDate: "2025-05-17", // Fecha de fin (formato YYYY-MM-DD)
    };

    // Llamar a la función
    const sensorData = await fetchSensorData(sensorId, options);

    // Mostrar los datos en consola
    console.log("Datos del sensor:", sensorData);

    // Procesar los datos (ej. mostrar en una tabla o gráfica)
    sensorData.forEach((data) => {
      console.log(\`Fecha: \${data.createdAt}, Valor: \${data.value}\`);
    });
  } catch (error) {
    console.error("Error en la ejecución:", error.message);
  }
}

// Ejecutar el ejemplo
main();
`;
