import { useState, useEffect } from 'react';
import { useProfileInfo } from '../hooks/useProfile';
import { useProfileContext } from "../hooks/useProfileContext";

import Loader from "../helperComponent/Loader";

import { avatar1, avatar2, avatar3, avatar4 } from "../assets/avatar";


import "../CSS/profile.css";

const Profile = () => {
  const { isLoading, error, updateNickname, updateAge, updateGender, updateBio, updateImage } = useProfileInfo();
  const { profile } = useProfileContext();
  


  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);

  const [isAgeEditing, setIsAgeEditing] = useState(false);
  const [age, setAge] = useState(profile.age);

  const [isGenderEditing, setIsGenderEditing] = useState(false);
  const [gender, setGender] = useState(profile.gender);

  const [isBioEditing, setIsBioEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);

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


  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>;
  }


  return (
    <div className="profile">
      <h3>Profile Page</h3>
        {showAvatarSelection ? (
          <div className="avatar-selection">
            <h3>Select your Avatar:</h3>
            <div>
              <label>
                <input
                  type="radio"
                  name="avatar"
                  value="1"
                  onClick={() => handleUpdateAvatar("1")}
                />
                <img src={avatar1} alt="Avatar 1" className="avatar-image"/>
              </label>
              <label>
                <input
                  type="radio"
                  name="avatar"
                  value="2"
                  onClick={() => handleUpdateAvatar("2")}
                />
                <img src={avatar2} alt="Avatar 2" className="avatar-image"/>
              </label>
              <label>
                <input
                  type="radio"
                  name="avatar"
                  value="3"
                  onClick={() => handleUpdateAvatar("3")}
                />
                <img src={avatar3} alt="Avatar 3" className="avatar-image"/>
              </label>
              <label>
                <input
                  type="radio"
                  name="avatar"
                  value="4"
                  onClick={() => handleUpdateAvatar("4")}
                />
                <img src={avatar4} alt="Avatar 4" className="avatar-image"/>
              </label>
              
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
                  : null
              }
              alt={`Avatar ${selectedAvatar}`}
              className="selected-avatar-image"
            />
            <button onClick={() => setShowAvatarSelection(true)}
            >
              Update Avatar
            </button>
          </div>
        )}
      <div className="profile-info">
        <div key="nickname" className="profile-attribute">
          <label>Nickname:</label>
          {isNicknameEditing ? (
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          ) : (
            <span>{nickname}</span>
          )}
          {isNicknameEditing ? (
            <button onClick={handleUpdateNickname}>Save</button>
          ) : (
            <button onClick={() => setIsNicknameEditing(true)}>Edit</button>
          )}
        </div>
        <div key="age" className="profile-attribute">
          <label>Age:</label>
          {isAgeEditing ? (
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          ) : (
            <span>{age}</span>
          )}
          {isAgeEditing ? (
            <button onClick={handleUpdateAge}>Save</button>
          ) : (
            <button onClick={() => setIsAgeEditing(true)}>Edit</button>
          )}
        </div>
        <div key="gender" className="profile-attribute">
          <label>Gender(male - female):</label>
          {isGenderEditing ? (
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
          ) : (
            <span>{gender}</span>
          )}
          {isGenderEditing ? (
            <button onClick={handleUpdateGender}>Save</button>
          ) : (
            <button onClick={() => setIsGenderEditing(true)}>Edit</button>
          )}
        </div>
        <div key="bio" className="profile-attribute">
          <label>Bio:</label>
          {isBioEditing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          ) : (
            <span>{bio}</span>
          )}
          {isBioEditing ? (
            <button onClick={handleUpdateBio}>Save</button>
          ) : (
            <button onClick={() => setIsBioEditing(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
