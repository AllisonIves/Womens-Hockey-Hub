import React from "react";
import "/src/styles/contactform.css";

const ContactForm = () => {
  return (
    <div className="contact-form-page">
      <h1 className="contact-title">Contact Us</h1>

      <div className="contact-form-container">
        <p>
          We're here to help! Please fill out the form below to get in touch
          with the Women's Hockey Hub team.
        </p>

        <div className="contact-form-placeholder">
          <p><iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfAS04gn2LQn3FCHOsW7XuG0aG8Suz9JNqMALaSF6vgS2o-Lw/viewform?embedded=true" width="640" height="1556" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe></p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
