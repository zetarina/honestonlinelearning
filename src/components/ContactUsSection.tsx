// components/ContactUsSection.tsx
"use client";
import React from "react";
import { Form, Input, Button, Typography, message, Row, Col } from "antd";

const { Title, Text } = Typography;

const ContactUsSection = () => {
  return (
    <div style={{ padding: "60px 20px", backgroundColor: "rgb(0, 21, 41)" }}>
      <Title level={2} style={{ textAlign: "center", color: "white", marginBottom: "40px" }}>
        Contact Us
      </Title>

      <Row
        gutter={[40, 40]}
        justify="center"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap", 
        }}
      >
                <Col
          xs={24} 
          md={12}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center" 
          }} 
        >
          <Form
            layout="vertical"
            style={{
              padding: "40px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              height: "100%", // Ensure full height
            }}
            onFinish={() => message.success("Message sent successfully!")}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="Your Email" />
            </Form.Item>
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <Input.TextArea rows={4} placeholder="Your Message" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </Col>

                <Col
          xs={24} 
          md={12}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center" 
          }} // Flex properties to match height
        >
          <div
            style={{
              padding: "40px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
              height: "100%", // Ensure full height
            }}
          >
            <Title level={4} style={{ color: "rgb(0, 21, 41)" }}>
              Our Location
            </Title>
            <Text>19/B (First Floor), Min Ye Kyaw Swar Rd, Kyauk Kone Rd, Yangon</Text>
            <br />
            <Text>Phone: +959792824522</Text>
            <br />
            <Text>Email: honestonlinelearninghh@gmail.com</Text>

            <div style={{ marginTop: "20px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4692.57839143553!2d96.1655511727486!3d16.831122473419477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1edef226c8615%3A0x84274ec55cef47e0!2sHonest%20Hour!5e0!3m2!1sen!2smm!4v1735809818245!5m2!1sen!2smm"
                width="100%"
                height="300"
                style={{
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ContactUsSection;
