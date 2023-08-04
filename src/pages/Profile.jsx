import React, { useState, useEffect } from 'react';
import { useProfileInfo } from '../hooks/useProfile';
import { useProfileContext } from "../hooks/useProfileContext";

import { usePost } from '../hooks/usePost';

import "../CSS/profile.css";

const Profile = () => {
  const { isLoading, error, updateNickname, updateAge, updateGender, updateBio } = useProfileInfo();
  const { profile } = useProfileContext();
  const { posts, postLoading, postError } = usePost();
  const [noPosts, setNoPosts] = useState(false);

  // Separate state and handlers for each attribute
  const [isNicknameEditing, setIsNicknameEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);

  const [isAgeEditing, setIsAgeEditing] = useState(false);
  const [age, setAge] = useState(profile.age);

  const [isGenderEditing, setIsGenderEditing] = useState(false);
  const [gender, setGender] = useState(profile.gender);

  const [isBioEditing, setIsBioEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);

  useEffect(() => {
    setNickname(profile.nickname);
    setAge(profile.age);
    setGender(profile.gender);
    setBio(profile.bio);
    setNoPosts(posts.length === 0);
  }, [profile, posts]);

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (postLoading) {
    return <p>Loading Posts</p>
  }

  if (postError) {
    return <p>Error in posts: {error}</p>
  }

  return (
    <div className="profile">
      <h3>Profile Page</h3>
      <div>
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
          <label>Gender:</label>
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
      {!noPosts && <div className="posts">
        {posts.map((post, index) => (
          <div
            key={index}
            classname="post"
          >
            <p>{post._id}</p>
          </div>
        ))}
      </div>
      }
      {noPosts && <h4>You didn't create any posts</h4>}
    </div>
  );
};

export default Profile;
