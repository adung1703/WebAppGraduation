import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">About Me</h1>
        <p className="text-lg text-gray-700 mb-4">
          👋 Hello! My name is <span className="font-semibold">[Your Name]</span>. I'm a final-year Computer Engineering student at Hanoi University of Science and Technology.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          💼 I'm passionate about IoT, Embedded Systems, and full-stack web development. Currently, I'm working on a graduation project about environmental monitoring using ESP32 and web technologies.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          📚 GPA: <span className="font-semibold">3.76 / 4.0</span>. Internship experience at Samsung R&D and Viettel High Tech.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          ✨ I enjoy learning new technologies and building real-world projects. Outside of tech, I love football and often organize events for the Bayern Munich fan club in Vietnam.
        </p>
        <p className="text-lg text-gray-700">
          📫 Feel free to reach out via email: <span className="font-semibold">your.email@example.com</span>
        </p>
      </div>
    </div>
  );
}
