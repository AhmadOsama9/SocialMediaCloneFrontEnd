import { useState, useEffect } from 'react';
import { useProfileInfo } from '../hooks/useProfile';
import { useProfileContext } from "../hooks/useProfileContext";

import Loader from "../helperComponent/Loader";

import { avatar1, avatar2, avatar3, avatar4, avatar0 } from "../assets/avatar";

import "../CSS/profile.css";
import notification from '../helperComponent/notification';

const Profile = () => {
  const { isLoading, error, updateNickname, updateAge, updateGender, updateBio, updateImage, checkPassword, updatePassword } = useProfileInfo();
  const { profile } = useProfileContext();

  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);

  const [isAgeEditing, setIsAgeEditing] = useState(false);
  const [age, setAge] = useState(profile.age);

  const [isGenderEditing, setIsGenderEditing] = useState(false);
  const [gender, setGender] = useState(profile.gender);

  const [isBioEditing, setIsBioEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isNewPasswordEditing, setIsNewPasswordEditing] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState(profile.image);

  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  useEffect(() => {
    setNickname(profile.nickname);
    setAge(profile.age);
    setGender(profile.gender);
    setBio(profile.bio);
    setSelectedAvatar(profile.image);
  }, [profile]);

  const handleUpdateNickname = async () => {
    await updateNickname(nickname);
    setIsNicknameEditing(false);
  };

  const handleUpdateAge = async () => {
    await updateAge(age);
    setIsAgeEditing(false);
  };

  const handleUpdateGender = async () => {
    await updateGender(gender);
    setIsGenderEditing(false);
  };

  const handleUpdateBio = async () => {
    await updateBio(bio);
    setIsBioEditing(false);
  };

  const handleUpdateAvatar = async (avatarNum) => {
    setSelectedAvatar(avatarNum);
    setShowAvatarSelection(false);
    await updateImage(avatarNum);
  }

  const handleCheckOldPassword = async () => {
    setIsPasswordEditing(false);
    const match = await checkPassword(oldPassword);
    if (match) {
      setIsNewPasswordEditing(true);
    }
  }

  const handleSaveNewPassword = async () => {
    const update = await updatePassword(password);
    if (update) {
      notification.success("The password has been updated");
      setIsNewPasswordEditing(false);
    }
  }

  const handleCancelUpdatePassword = () => {
    setIsNewPasswordEditing(false);
    setIsPasswordEditing(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>;
  }

  const avatars = [
    { id: "0", src: avatar0, alt: "Avatar 0" },
    { id: "1", src: avatar1, alt: "Avatar 1" },
    { id: "2", src: avatar2, alt: "Avatar 2" },
    { id: "3", src: avatar3, alt: "Avatar 3" },
    { id: "4", src: avatar4, alt: "Avatar 4" }
  ];

  return (
    <div className="profile">
      <h3>Profile Page</h3>
      
      {showAvatarSelection ? (
        <div className="avatar-selection">
          <h4>Select your Avatar:</h4>
          <div className="avatar-grid">
            {avatars.map((avatar) => (
              <div 
                key={avatar.id} 
                className={`avatar-container ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                onClick={() => handleUpdateAvatar(avatar.id)}
              >
                <img 
                  src={avatar.src} 
                  alt={avatar.alt} 
                  className="avatar-image"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="selected-avatar">
          <img
            src={
              selectedAvatar === "1"
                ? avatar1
                : selectedAvatar === "2"
                ? avatar2
                : selectedAvatar === "3"
                ? avatar3
                : selectedAvatar === "4"
                ? avatar4
                : avatar0
            }
            alt={`Avatar ${selectedAvatar}`}
            className="selected-avatar-image"
          />
          <button 
            className="btn btn-update"
            onClick={() => setShowAvatarSelection(true)}
          >
            Change Avatar
          </button>
        </div>
      )}
      
      <div className="profile-info">
        <div className="profile-attribute">
          <label>Nickname:</label>
          <div className="attribute-content">
            {isNicknameEditing ? (
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            ) : (
              <span>{nickname}</span>
            )}
            <div className="edit-actions">
              {isNicknameEditing ? (
                <>
                  <button className="btn btn-save" onClick={handleUpdateNickname}>Save</button>
                  <button className="btn btn-cancel" onClick={() => setIsNicknameEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-edit" onClick={() => setIsNicknameEditing(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-attribute">
          <label>Age:</label>
          <div className="attribute-content">
            {isAgeEditing ? (
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            ) : (
              <span>{age}</span>
            )}
            <div className="edit-actions">
              {isAgeEditing ? (
                <>
                  <button className="btn btn-save" onClick={handleUpdateAge}>Save</button>
                  <button className="btn btn-cancel" onClick={() => setIsAgeEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-edit" onClick={() => setIsAgeEditing(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-attribute">
          <label>Gender (male - female):</label>
          <div className="attribute-content">
            {isGenderEditing ? (
              <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
            ) : (
              <span>{gender}</span>
            )}
            <div className="edit-actions">
              {isGenderEditing ? (
                <>
                  <button className="btn btn-save" onClick={handleUpdateGender}>Save</button>
                  <button className="btn btn-cancel" onClick={() => setIsGenderEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-edit" onClick={() => setIsGenderEditing(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-attribute">
          <label>Bio:</label>
          <div className="attribute-content">
            {isBioEditing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            ) : (
              <span className="bio-text">{bio}</span>
            )}
            <div className="edit-actions">
              {isBioEditing ? (
                <>
                  <button className="btn btn-save" onClick={handleUpdateBio}>Save</button>
                  <button className="btn btn-cancel" onClick={() => setIsBioEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-edit" onClick={() => setIsBioEditing(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-attribute">
          <label>Password:</label>
          <div className="attribute-content">
            {isPasswordEditing ? (
              <div className="password-input">
                <label>Enter the old password</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                />
                <div className="edit-actions">
                  <button className="btn btn-save" onClick={handleCheckOldPassword}>Verify</button>
                  <button className="btn btn-cancel" onClick={() => setIsPasswordEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {isNewPasswordEditing ? (
                  <div className="password-input">
                    <label>Enter the new password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                    <div className="edit-actions">
                      <button className="btn btn-save" onClick={handleSaveNewPassword}>Save</button>
                      <button className="btn btn-cancel" onClick={handleCancelUpdatePassword}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span>••••••••••</span>
                    <div className="edit-actions">
                      <button className="btn btn-edit" onClick={() => setIsPasswordEditing(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                        Change Password
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {error && <h4 className="error">Error: {error}</h4>}
    </div>
  );
};

export default Profile;
