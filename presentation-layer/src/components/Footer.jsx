import { useAuth } from "../context/AuthContext.jsx";
import React, { useState } from "react";


const footerStyle = {
  bottom: 0,
  left: 0,
  width: "100%",
  padding: "10px",
  textAlign: "center",
  backgroundColor: "#1461b485",
  fontSize: "14px",
  borderTop: "1px solid #000000ff",
  zIndex: 1000
};
const faqs = [
  {
    question: "How can I donate items?",
    answer: "You can donate clothes, books, and other items using our donation form.",
  },
  {
    question: "Do I need an account to donate?",
    answer: "No, you can donate as a visitor, but creating an account helps track your donations.",
  },
  {
    question: "How do I know my donation is received?",
    answer: "All donations are recorded and you can get confirmation via email if provided.",
  },
];

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { user} = useAuth();

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
   <footer style={footerStyle}
    
    className="bg-dark text-light pt-2">
      <div className="container">
        <div className="row">

          {/* FAQ */}
          
          <div>
            {user?.role === "donor" && (
            <div className="accordion">
              <h5>FAQs</h5>
              {faqs.map((faq, index) => (
                <div className="card mb-1" key={index}>
                  <div
                    className="card-header"
                    style={{ cursor: "pointer", backgroundColor: "#343a408b", color: "#fff" }}
                    onClick={() => toggleIndex(index)}
                  >
                    <h6 className="mb-0">{faq.question}</h6>
                  </div>
                  {activeIndex === index && (
                    <div className="card-body bg-secondary text-white">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

        </div>

        <div className="text-center py-3 mt-2 border-top">
          &copy; {new Date().getFullYear()} Aidify. All rights reserved. 
          Himasha Semini
        </div>
      </div>
    </footer>
  );
};

export default Footer;
