import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../api';
import { getStates, getCitiesForState } from '../utils/locationData';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state) {
      const cities = getCitiesForState(formData.state);
      setAvailableCities(cities);
      // Reset city if it's not in the new state's cities
      if (formData.city && !cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state, formData.city]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        const userData = result.data;
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          pincode: userData.pincode || '',
          dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''
        });
        setProfilePicture(userData.profilePicture || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data - remove empty strings for optional fields
      const dataToSend = { ...formData };
      if (!dataToSend.phone) delete dataToSend.phone;
      if (!dataToSend.address) delete dataToSend.address;
      if (!dataToSend.city) delete dataToSend.city;
      if (!dataToSend.state) delete dataToSend.state;
      if (!dataToSend.pincode) delete dataToSend.pincode;
      if (!dataToSend.dateOfBirth) delete dataToSend.dateOfBirth;

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (result.success) {
        // Update auth store with new user data
        updateUser({
          ...user,
          name: result.data.name,
          phone: result.data.phone,
          address: result.data.address,
          city: result.data.city,
          state: result.data.state,
          pincode: result.data.pincode,
          dateOfBirth: result.data.dateOfBirth
        });
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Display validation errors if present
        if (result.errors && Array.isArray(result.errors)) {
          console.error('Validation errors:', result.errors);
          const errorMessages = result.errors.map(err => `${err.path || err.param}: ${err.msg}`).join('; ');
          setError(errorMessages);
        } else {
          setError(result.message || 'Failed to update profile');
        }
        console.error('Profile update error:', result);
        console.log('Sent data:', formData);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset form data
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/users/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setProfilePicture(result.data.profilePicture);
        updateUser({
          ...user,
          profilePicture: result.data.profilePicture
        });
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-2">Manage your personal information</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
                    />
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                      <UserCircleIcon className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Image Upload Button */}
                  <label 
                    htmlFor="profilePicture" 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="text-center">
                      <PencilIcon className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-xs">{uploadingImage ? 'Uploading...' : 'Change'}</span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{formData.name || 'User'}</h2>
                  <p className="text-slate-300 flex items-center gap-2 mt-1">
                    <EnvelopeIcon className="h-4 w-4" />
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <PhoneIcon className="h-5 w-5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="10-digit mobile number"
                />
                <p className="text-xs text-slate-500 mt-1">Required for ticket booking confirmation</p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <CalendarIcon className="h-5 w-5" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>

              {/* State, City, Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    <option value="">Select State</option>
                    {getStates().map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing || !formData.state}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.state ? 'Select City' : 'Select State First'}
                    </option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    pattern="[0-9]{6}"
                    maxLength="6"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <MapPinIcon className="h-5 w-5" />
                  Street Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="Street address, building, apartment (optional)"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-400 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <CheckIcon className="h-5 w-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your profile information helps us provide better service. 
            City, State, and Pincode are required to show you nearby cinemas and for ticket delivery. 
            Phone number is required for booking confirmations as per cinema regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
