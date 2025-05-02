import React from 'react';

const ProfileModal = ({ 
  showProfileModal, 
  setShowProfileModal, 
  activeProfileTab, 
  setActiveProfileTab,
  userProfile
}) => {
  if (!showProfileModal) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Your Personality Profile</h2>
          <button onClick={() => setShowProfileModal(false)}>×</button>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeProfileTab === 'multipleNatures' ? 'active' : ''}`}
            onClick={() => setActiveProfileTab('multipleNatures')}
          >
            Multiple Natures
          </button>
          <button 
            className={`tab ${activeProfileTab === 'mbti' ? 'active' : ''}`}
            onClick={() => setActiveProfileTab('mbti')}
          >
            MBTI
          </button>
        </div>
        
        <div className="modal-body">
          {/* Multiple Natures Profile */}
          {activeProfileTab === 'multipleNatures' && (
            <div>
              <h3>Your Multiple Natures Profile</h3>
              <p>{userProfile.personalityProfiles.multipleNatures.description}</p>
              
              <h4>Dominant Natures</h4>
              <div className="nature-cards">
                <div className="nature-card">
                  <div className="nature-icon">V</div>
                  <h5>Visionary</h5>
                  <p>You naturally see possibilities and envision new futures.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* MBTI Profile */}
          {activeProfileTab === 'mbti' && (
            <div>
              <div className="mbti-header">
                <div className="mbti-type">{userProfile.personalityProfiles.mbti.type}</div>
                <h3>The Counselor</h3>
              </div>
              
              <p>{userProfile.personalityProfiles.mbti.description}</p>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-primary"
            onClick={() => setShowProfileModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;