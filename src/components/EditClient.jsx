import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api-client.js';
import './AddClient.css';

function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    requirement: '',
    budgetMin: '',
    budgetMax: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client data on component mount
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.getClient(id);
        
        if (response.data.success) {
          setFormData(response.data.data);
        } else {
          setError('Failed to load client data');
        }
      } catch (err) {
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClient();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client data validated and ready for update
    
    // Form validation
    if (!formData.clientName.trim()) {
      alert('❌ Please enter client name');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      alert('❌ Please enter phone number');
      return;
    }
    if (!formData.requirement) {
      alert('❌ Please select requirement');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.updateClient(id, formData);
      
      if (response.data.success) {
        alert('✅ Client updated successfully!');
        navigate(-1);
      } else {
        alert('❌ Failed to update client. Please try again.');
      }
    } catch (error) {
      alert('❌ Failed to update client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectFromContacts = async () => {
    // Contact picker functionality
    
    try {
      if ("contacts" in navigator && "ContactsManager" in window) {
        const props = ["name", "tel", "email"];
        const opts = { multiple: false };
        const contacts = await navigator.contacts.select(props, opts);


        if (contacts.length > 0) {
          const contact = contacts[0];
          
          // Extract phone number
          if (contact.tel && contact.tel.length > 0) {
            let phoneNumber = contact.tel[0].replace(/\D/g, "");
            
            // Handle different phone number formats
            if (phoneNumber.length === 11 && phoneNumber.startsWith('1')) {
              phoneNumber = phoneNumber.substring(1);
            } else if (phoneNumber.length === 12 && phoneNumber.startsWith('91')) {
              phoneNumber = phoneNumber.substring(2);
            } else if (phoneNumber.length > 10) {
              phoneNumber = phoneNumber.slice(-10);
            }
            
            setFormData(prev => ({
              ...prev,
              phoneNumber
            }));
          }
          
          // Extract email
          if (contact.email && contact.email.length > 0) {
            setFormData(prev => ({
              ...prev,
              email: contact.email[0]
            }));
          }
          
          // Extract name
          if (contact.name && contact.name.length > 0) {
            setFormData(prev => ({
              ...prev,
              clientName: contact.name[0]
            }));
          }
          
          alert('✅ Contact information imported successfully!');
        } else {
        }
      } else {
        alert("Contact selection is not supported on this device/browser");
      }
    } catch (error) {
      
      if (error.name === 'AbortError') {
      } else if (error.name === 'NotSupportedError') {
        alert("Contact picker not supported on this browser");
      } else {
        alert("Unable to access contacts. Please enter information manually.");
      }
    }
  };

  if (loading) {
    return (
      <div className="add-client-container">
        <div className="loading">Loading client data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="add-client-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate(-1)} className="cancel-btn">
          Back to Client List
        </button>
      </div>
    );
  }

  return (
    <div className="add-client-container">
      <h2>Edit Client</h2>
      
      <form onSubmit={handleSubmit} className="add-client-form">
        {/* Client Information */}
        <div className="form-section">
          <h3>Client Information</h3>
          
          <label>
            Client Name:
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              required
            />
          </label>
          
          <label>
            Phone Number:
            <div className="phone-input-container">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
              <button
                type="button"
                onClick={handleSelectFromContacts}
                className="contact-btn"
                title="Select from contacts"
              >
                📞
              </button>
            </div>
          </label>
          
          <label>
            What they want:
            <select
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              required
            >
              <option value="">Select requirement</option>
              <option value="Sale">Sale</option>
              <option value="Purchase">Purchase</option>
              <option value="Rent">Rent</option>
              <option value="Lease">Lease</option>
            </select>
          </label>
          
          <div className="budget-range">
            <label>
              Budget Range:
              <div className="budget-inputs">
                <input
                  type="text"
                  name="budgetMin"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  placeholder="Min (e.g., ₹30,00,000)"
                />
                <span className="budget-separator">to</span>
                <input
                  type="text"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  placeholder="Max (e.g., ₹70,00,000)"
                />
              </div>
            </label>
          </div>
          
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe client requirements, preferences, or any additional notes..."
              rows="4"
            />
          </label>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Updating Client...' : 'Update Client'}
          </button>
        </div>
      </form>
    </div>
  );
}

export { EditClient };
