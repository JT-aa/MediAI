import React, { useState } from "react";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: "Jimmy",
        age: 30,
        gender: "Male",
        height: "5'9\"",
        weight: "160 lbs",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <div className="profile-container">
            <img src="/profile-placeholder.png" alt="Profile" className="profile-photo" />
            {isEditing ? (
                <>
                    <input type="text" name="name" value={user.name} onChange={handleChange} />
                    <input type="text" name="age" value={user.age} onChange={handleChange} />
                    <input type="text" name="gender" value={user.gender} onChange={handleChange} />
                    <input type="text" name="height" value={user.height} onChange={handleChange} />
                    <input type="text" name="weight" value={user.weight} onChange={handleChange} />
                </>
            ) : (
                <>
                    <p>{user.name}</p>
                    <p>Age: {user.age}</p>
                    <p>Gender: {user.gender}</p>
                    <p>Height: {user.height}</p>
                    <p>Weight: {user.weight}</p>
                </>
            )}
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Save" : "Edit"}
            </button>
        </div>
    );
};

export default UserProfile;