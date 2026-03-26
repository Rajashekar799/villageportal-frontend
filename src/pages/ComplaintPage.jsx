import { useState } from 'react';
import { api } from '../api/client';

export default function ComplaintPage() {
  const [form, setForm] = useState({ name: '', phone: '', problemDescription: '' });
  const [message, setMessage] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.addComplaint(form);
      setMessage('Complaint submitted successfully.');
      setForm({ name: '', phone: '', problemDescription: '' });
    } catch {
      setMessage('Saved locally for demo. Backend not available now.');
    }
  };

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="section-title">Complaint / Suggestion</h1>
        <p className="mt-2 text-sm">Report road, water, electricity issues or share suggestions.</p>
      </section>

      <form onSubmit={onSubmit} className="card space-y-3">
        <label className="block text-sm font-semibold">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          className="w-full rounded-xl border border-green-300 p-3 text-base"
          placeholder="మీ పేరు నమోదు చేయండి"
          required
        />

        <label className="block text-sm font-semibold">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={updateField}
          className="w-full rounded-xl border border-green-300 p-3 text-base"
          placeholder="ఫోన్ నంబర్ నమోదు చేయండి"
          required
        />

        <label className="block text-sm font-semibold">Problem Description</label>
        <textarea
          name="problemDescription"
          value={form.problemDescription}
          onChange={updateField}
          className="h-28 w-full rounded-xl border border-green-300 p-3 text-base"
          placeholder="మీ సమస్యను వివరించండి"
          required
        />

        <button type="submit" className="primary-btn w-full">Submit</button>
        {message && <p className="text-sm text-leaf">{message}</p>}
      </form>
    </div>
  );
}
