// @/pages/sensor/utils/codeTemplate.ts
import { URL_BACK } from '@/config';

export const codeTemplate = (sensorId: string, teamId: string, token: string): string => `
#include <ESP8266WiFi.h>   // Usa ESP32WiFi.h si usas ESP32
#include <WiFiClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>    // Asegúrate de tener instalada esta librería

// Datos de conexión Wi-Fi
const char* ssid = "TuSSID";
const char* password = "TuContraseña";

// Suponiendo que estás usando un sensor analógico, por ejemplo un sensor de temperatura
// Asegúrate de conectar el sensor en el pin A0 si usas un sensor analógico
const int sensorPin = A0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  // Esperar hasta conectar a la red Wi-Fi
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a Wi-Fi...");
  }
  Serial.println("Conectado a Wi-Fi!");

  // Crear el objeto HTTPClient para hacer la petición
  HTTPClient http;
  http.begin("${URL_BACK}/api/sensor/data");  // URL del servidor

  // Configurar el encabezado para JSON
  http.addHeader("Content-Type", "application/json");

  // Crear el objeto JSON usando ArduinoJson
  StaticJsonDocument<512> doc;  // Asegúrate de tener suficiente espacio

  // Asumimos que 'sensorValue' es el valor leído del sensor
  float sensorValue = analogRead(sensorPin) * (5.0 / 1023.0);  // Leer el valor del sensor (ajustar según tu sensor)
  
  doc["credentials"]["publicKey"] = "${teamId}";
  doc["credentials"]["secretKey"] = "${token}";
  doc["data"]["sensorId"] = "${sensorId}";
  doc["data"]["value"] = sensorValue;  // El valor del sensor se asigna aquí

  // Convertir el objeto JSON a un string
  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // Enviar la solicitud POST con el JSON como cuerpo
  int httpResponseCode = http.POST(jsonPayload);

  // Mostrar la respuesta del servidor en el monitor serial
  Serial.println(httpResponseCode);
  String response = http.getString();
  Serial.println(response);

  http.end();  // Finalizar la solicitud
}

void loop() {}
`;
