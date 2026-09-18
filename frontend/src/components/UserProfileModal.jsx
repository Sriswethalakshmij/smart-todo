import { useEffect, useState } from "react";
import { X, User, Mail, Phone, AtSign, Save, Check } from "lucide-react";

function UserProfileModal({ user, onClose }) {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("smart_todo_profile");

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
        return;
      } catch {
        // Ignore invalid saved profile data
      }
    }

    setProfile({
      name: user?.name || user?.username || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      "smart_todo_profile",
      JSON.stringify(profile)
    );

    setSaved(true);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div
        className="profile-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {saved ? (
          <div className="profile-success">
            <div className="profile-success-icon">
              <Check size={30} />
            </div>

            <h2>Profile Updated!</h2>

            <p>
              Your profile details have been saved successfully.
            </p>
          </div>
        ) : (
          <>
            <div className="profile-modal-header">
              <div>
                <p className="profile-modal-label">
                  YOUR PROFILE
                </p>

                <h2>Personal Details</h2>
              </div>

              <button
                type="button"
                className="profile-close-button"
                onClick={onClose}
                aria-label="Close profile"
              >
                <X size={20} />
              </button>
            </div>

            <div className="profile-avatar">
              <User size={30} />
            </div>

            <div className="profile-form">
              <div className="profile-field">
                <label htmlFor="profile-name">
                  Name
                </label>

                <div className="profile-input-wrapper">
                  <User size={17} />

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="profile-username">
                  Username
                </label>

                <div className="profile-input-wrapper">
                  <AtSign size={17} />

                  <input
                    id="profile-username"
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    placeholder="Your username"
                    disabled
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="profile-email">
                  Email
                </label>

                <div className="profile-input-wrapper">
                  <Mail size={17} />

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="profile-phone">
                  Phone Number
                </label>

                <div className="profile-input-wrapper">
                  <Phone size={17} />

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleSave}
              >
                <Save size={17} />
                Save Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfileModal;