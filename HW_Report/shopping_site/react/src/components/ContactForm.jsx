// ContactForm.jsx
import { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [responseMessage, setResponseMessage] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/contact_form/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (data.success) {
                setResponseMessage('感謝聯絡！您的訊息已送出。');
                setForm({ name: '', email: '', message: '' });
            } else {
                setResponseMessage(`發生錯誤：${data.error}`);
            }
        } catch (error) {
            setResponseMessage(`發生錯誤：${error.message}`);
        }
    }

    return (
        <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="name">姓名</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message">訊息</label>
                <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                />
            </div>

            <button type="submit">送出</button>
            {responseMessage && <p>{responseMessage}</p>}
        </form>
    );
}
