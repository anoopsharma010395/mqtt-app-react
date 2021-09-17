import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
 
// Component
import { Card, Button, Row } from "antd";
 

 
const Publisher = (props) => {
  const { url, mqttOptions } = props;
 
  // State
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState("Disconnected");
  const [tempPayload, setTempPayload] = useState("");
  const [lightPayload, setLightPayload] = useState("");

  // Topic
var temperatureTopic = "home/hall/temp";
var lightTopic = "home/hall/light";

var temperatureTopic = props.temperatureTopic;
var lightTopic = props.lightTopic;
 
// Last will and testament
var will = {
  topic: temperatureTopic,
  payload: "Something went wrong with Hall",
  qos: 2,
  retain: false,
};
 
  // On connect to broker
  useEffect(() => {
    if (client) {
      console.log(client);
 
      client.on("connect", () => {
        startSensors();
        setConnectStatus("Connected");
      });
 
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end(() => {
          setConnectStatus("Disconnected");
        });
      });
 
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
    }
  }, [client]);
 
  const connectToBroker = () => {
    console.log("connectToBroker");
    const mo = {
      ...mqttOptions,
      clientId: `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`,
      will,
    };
    setClient(mqtt.connect(url, mo));
  };
 
  const disconnectToBroker = () => {
    console.log("disconnectToBroker");
    if (client) {
      client.end(() => {
        setConnectStatus("Disconnected");
      });
    }
  };
 
  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
 
  const startSensors = () => {
    plublishLight();
    setTimeout(plublishTemp, 2000);
  };
 
  const plublishTemp = () => {
    if (client) {
      const temp = getRandomIntInclusive(20, 45).toString();
      client.publish(temperatureTopic, temp, { qos: 2 }, (error) => {
        const data = { lightTopic, message: temp };
        setTempPayload(data);
 
        if (error) {
          console.log("Temp Publish error: ", error);
        }
      });
 
      setTimeout(plublishTemp, 4000);
    }
  };
 
  const plublishLight = () => {
    if (client) {
      const light = getRandomIntInclusive(100, 200).toString();
      client.publish(lightTopic, light, { qos: 2 }, (error) => {
        const data = { lightTopic, message: light };
        setLightPayload(data);
 
        if (error) {
          console.log("Publish error: ", error);
        }
      });
 
      setTimeout(plublishLight, 4000);
    }
  };
 
  return (
    <Card className="equal-width" title ={props.title}>
        <div>Topic:
        {props.temperatureTopic},
        <div>{props.lightTopic}</div>
        </div>
        <div>Temp: {tempPayload?.message || 0}</div>
        <div>Light: {lightPayload?.message || 0}</div>
      
      <div>Status: {connectStatus}</div>
      {connectStatus === "Connected" ? (
        <Button onClick={disconnectToBroker}>Disconnect</Button>
      ) : (
        <Button onClick={connectToBroker}>Connect</Button>
      )}
    </Card>
  );
};
 
export default Publisher;
