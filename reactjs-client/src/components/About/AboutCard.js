import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, Mình là <span className="purple">Dũng </span>
            sinh viên ngành <span className="purple"> Kỹ thuật máy tính K66.</span>
            <br />
            Đây là Đồ án tốt nghiệp của mình.
            <br />
            Hệ thống giúp giám sát, theo dõi thông số không khí tại văn phòng khoa
            Kỹ Thuật Máy Tính.
            <br />
            <br />
            Mình hi vọng sản phẩm của mình sẽ hữu ích với cộng đồng
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Writing Tech Blogs
            </li>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Adung1703</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
