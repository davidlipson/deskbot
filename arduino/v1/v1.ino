#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoJson.h>

int status = WL_IDLE_STATUS;
WiFiClient client;

char ssid[] = "downlow";    // your network SSID (name)
char pass[] = "blueberry";  // your network password (use for WPA, or use as key for WEP)
const char* host = "deskbot-941f08cbf899.herokuapp.com";

DynamicJsonDocument* httpToJson () {
  String jsonString = client.readString();
  const char* httpResponse = jsonString.c_str();

  // Find the start of the JSON body
  char* jsonStart = strstr(httpResponse, "\r\n\r\n");
  if (jsonStart != NULL) {
    jsonStart += 4;  // Skip past the "\r\n\r\n"

    // Parse the JSON body
    DynamicJsonDocument* doc = new DynamicJsonDocument(200);
    DeserializationError error = deserializeJson(*doc, jsonStart);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      Serial.print(jsonString);
      delete doc;
      return nullptr;
    }

    return doc;
  }

  return nullptr;
}

DynamicJsonDocument* getRequest (const char* endpoint) {
  if (client.connect(host, 80)) {
    client.println((String)"GET " + endpoint + " HTTP/1.1");
    client.println((String)"Host: " + host);
    client.println("Connection: close");
    client.println();
  }
  return httpToJson();
}

void getStatus () {
  DynamicJsonDocument* status = getRequest("/status");
  if(status != nullptr){
    JsonObject root = status->as<JsonObject>();
    Serial.println(root["song"]["message"].as<String>());
    Serial.println(root["calendar"]["message"].as<String>());
    Serial.println(root["github"]["message"].as<String>());
  }
  else{
    Serial.println("Error getting current status...");
  }
}


void setup() {
  Serial.begin(9600);  // initialize serial communication

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);  // print the network name (SSID);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(10000);
  }

}


void loop() {
  getStatus();
  delay(5000);

  // if the server's disconnected, stop the client:
  /*if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting from server.");
    client.stop();
    // do nothing forevermore:
    while (true)
      ;
  }*/
}
