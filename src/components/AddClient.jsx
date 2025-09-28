import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../hooks/useToast';
import './AddClient.css';

function AddClient() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    requirement: '',
    budgetMin: '',
    budgetMax: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Client Data:', formData);
    
    // Form validation
    if (!formData.clientName.trim()) {
      error('Please enter client name');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      error('Please enter phone number');
      return;
    }
    if (!formData.requirement) {
      error('Please select requirement');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:3000/api/clients', formData);
      
      if (response.data.success) {
        success('Client added successfully!');
        
        // Reset form
        setFormData({
          clientName: '',
          phoneNumber: '',
          requirement: '',
          budgetMin: '',
          budgetMax: '',
          description: ''
        });
        
        // Navigate back to client page
        navigate('/client');
      } else {
        error('Failed to add client. Please try again.');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      error('Failed to add client. Please try again.');
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

        // Contact selected successfully

        if (contacts.length > 0) {
          const contact = contacts[0];
          // Processing contact details
          
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
          
          success('Contact information imported successfully!');
        } else {
          // No contacts selected
        }
      } else {
        error("Contact selection is not supported on this device/browser");
      }
    } catch (error) {
      console.error("Error accessing contacts:", error);
      
      if (error.name === 'AbortError') {
        // User cancelled contact selection
      } else if (error.name === 'NotSupportedError') {
        error("Contact picker not supported on this browser");
      } else {
        error("Unable to access contacts. Please enter information manually.");
      }
    }
  };

  return (
    <div className="add-client-container">
      <h2>Add New Client</h2>
      
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
              {/* <option value="Sale">Sale</option> */}
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
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Client...' : 'Add Client'}
          </button>
          <button type="button" onClick={() => navigate('/client')} className="cancel-btn">
            Cancel
          </button>
         
        </div>
      </form>
    </div>
  );
}

export { AddClient };
