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
          display: "flex", // Enable Flexbox
          flexWrap: "wrap", // Ensure responsiveness
        }}
      >
                <Col
          xs={24} 
          md={12}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center" 
          }} // Flex properties to match height
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
            <Text>123 Main Street, City, Country</Text>
            <br />
            <Text>Phone: +123-456-7890</Text>
            <br />
            <Text>Email: info@example.com</Text>

            <div style={{ marginTop: "20px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434508541!2d144.95373531531698!3d-37.816279279751576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577b29911779c72!2sVictoria%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sus!4v1602158588182!5m2!1sen!2sus"
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
