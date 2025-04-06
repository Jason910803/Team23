// pages/ContactPage.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">聯絡我們</h2>
          <p className="text-center text-muted mb-4">
            如果你有任何問題或建議，歡迎填寫以下表單，我們會盡快與你聯絡！
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
