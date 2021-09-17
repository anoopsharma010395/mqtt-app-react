import React from "react";

import './App.css';
 
// Component
//import { Row } from "antd";
 
import { Card, Button, Row } from "antd";

import Publisher from './Publisher';
import Subscriber from './Subscriber';
 
const mqttOptions = {
  keepalive: 30,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  rejectUnauthorized: false,
};
 
const MQTTApp = () => {
  const host = "broker.mqttdashboard.com"; // "broker.emqx.io";
  const port = 8000; // 8083;
  const url = `ws://${host}:${port}/mqtt`;
 
  return (
    <Card title="MQTT Using React"  className="background-color">
        <Row className="flex-box">
            <div className="content-align-center first">
                <Publisher url={url} mqttOptions={mqttOptions}  retain={true} temperatureTopic="home/hall/temp" lightTopic="home/hall/light" title="Hall Publisher" />
                <Publisher url={url} mqttOptions={mqttOptions}  retain={true} temperatureTopic="home/kitchen/temp" lightTopic="home/kitchen/light" title="Kitchen Publisher" />
                {/* <HallPublisher url={url} mqttOptions={mqttOptions} /> */}
            </div>
         
                <div className="content-align-center second">
                    <Subscriber url={url} mqttOptions={mqttOptions} title="Subscriber A" topic="home/hall/#"  />
                    <Subscriber url={url} mqttOptions={mqttOptions} title="Subscribr B" topic="home/kitchen/#" />
            </div>
        </Row>
    </Card>
  );
};
 
export default MQTTApp;
