import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetClient, useUpdateClient } from '../hook/useClientOperations';
import './AddClient.css';
import PageHeader from './Navigation/PageHeader';
import Breadcrumb from './Navigation/Breadcrumb';

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

  // React Query hooks
  const { 
    data: clientData, 
    isLoading, 
    isError, 
    error 
  } = useGetClient(id);

  const updateClientMutation = useUpdateClient();

  // Update form data when client data is loaded
  useEffect(() => {
    if (clientData?.success && clientData?.data) {
      setFormData(clientData.data);
    }
  }, [clientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.clientName.trim()) {
      toast.error('Please enter client name');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('Please enter phone number');
      return;
    }
    if (!formData.requirement) {
      toast.error('Please select requirement');
      return;
    }
    
    try {
      await updateClientMutation.mutateAsync({ 
        id, 
        clientData: formData 
      });
      toast.success('Client updated successfully!');
      navigate(-1);
    } catch (error) {
      toast.error(`Failed to update client: ${error.message}`);
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
          
          toast.success('Contact information imported successfully!');
        } else {
        }
      } else {
        toast.error("Contact selection is not supported on this device/browser");
      }
    } catch (error) {
      
      if (error.name === 'AbortError') {
      } else if (error.name === 'NotSupportedError') {
        toast.error("Contact picker not supported on this browser");
      } else {
        toast.error("Unable to access contacts. Please enter information manually.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="add-client-container">
        <div className="loading">Loading client data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="add-client-container">
        <div className="error">{error?.message || 'Failed to load client data'}</div>
        <button onClick={() => navigate(-1)} className="cancel-btn">
          Back to Client List
        </button>
      </div>
    );
  }

  return (
    <div className="add-client-container">
      <Breadcrumb />
      <PageHeader 
        title="Edit Client" 
        subtitle="Update client information"
        fallbackPath="/client/list"
      />
      
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
          <button type="submit" className="submit-btn" disabled={updateClientMutation.isPending}>
            {updateClientMutation.isPending ? 'Updating Client...' : 'Update Client'}
          </button>
        </div>
      </form>
    </div>
  );
}

export { EditClient };
