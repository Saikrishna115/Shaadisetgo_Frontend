import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = ({ initialData, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    preferences: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        preferences: initialData.preferences || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="rounded shadow p-4">
        <h1 className="mb-4">Profile Information</h1>

        {error && <div className="message message-error mb-3">{error}</div>}
        {success && <div className="message message-success mb-3">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="d-flex flex-wrap">
            <div className="w-50 p-2">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-50 p-2">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-50 p-2">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-50 p-2">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-100 p-2">
              <div className="form-group">
                <label htmlFor="preferences">Preferences</label>
                <textarea
                  id="preferences"
                  className="form-control"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;