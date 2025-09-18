import React, { useState, useEffect } from "react";

function PatientProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    //  load user from localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // save updated user to localStorage (dummy update)
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PatientProfile;
