import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
 
// Component
import { Card, Button, Row} from "antd";
 
// Topic
var temperatureTopic = "home/hall/temp";
var lightTopic = "home/hall/light";
 

const Subscriber = (props) => {
  const { url, mqttOptions } = props;
 
  // State
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [tempPayload, setTempPayload] = useState("");
  const [lightPayload, setLightPayload] = useState("");
  //const topic = "home/hall/temp";
 
  // On connect to broker
  const will = {
    topic: temperatureTopic,
    payload: `Something went wrong with ${props.title}`,
    qos: 2,
    retain: false,
  };
   
  useEffect(() => {
    if (client) {
      console.log(client);
 
      client.on("connect", () => {
        setConnectStatus("Connected");
      });
 
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end(() => {
          setConnectStatus("Connect");
        });
      });
 
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
 
      client.subscribe(props.topic, { qos: 1 });
 
      client.on("message", (topic, message) => {
        const data = { topic, message: message.toString() };

        console.log(topic);
        if(topic.split('/')[2] == "temp")
          setTempPayload(data);
        else if(topic.split('/')[2] == "light")
          setLightPayload(data);
        console.log('Recieved', topic, message.toString());
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
    };
  };
 
  return (
    <Card className="equal-width" title ={props.title}>
        <div>Topic: {props.topic}</div>
       
          <div>Temp: {tempPayload?.message }</div>
          <div>Light: {lightPayload?.message }</div>
        
        <div>Status: {connectStatus}</div>
        {connectStatus === "Connected" ? (
            <Button onClick={disconnectToBroker}>Disconnect</Button>
        ) : (
            <Button onClick={connectToBroker}>Connect</Button>
        )}
    </Card>
  );
};
 
export default Subscriber;
