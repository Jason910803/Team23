// ContactForm.jsx
import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();
		alert(
			`感謝聯絡！\n姓名：${form.name}\nEmail：${form.email}\n訊息：${form.message}`,
		);
		// 清空表單
		setForm({ name: "", email: "", message: "" });
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
		</form>
	);
}
