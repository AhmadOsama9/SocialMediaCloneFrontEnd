import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ProfileContextProvider } from './context/ProfileContext.jsx'
import { ChatProvider } from './context/chatContext.jsx'
import { ReceivedRequestsProvider } from './context/ReceivedRequestsContext.jsx'
import { CommunityRelationProvider } from './context/communityRelation.jsx'
import { UserPostsContextProvider } from './context/UserPostsContext.jsx'
import { CreateCommunityContextProvider } from './context/createCommunityContext.jsx'

import './index.css'
import { OtherUserPostsContextProvider } from './context/OtherUserPosts.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProfileContextProvider>
        <ChatProvider>
          <ReceivedRequestsProvider>
            <CommunityRelationProvider>
              <UserPostsContextProvider>
                <OtherUserPostsContextProvider>
                  <CreateCommunityContextProvider>
                    <App />
                  </CreateCommunityContextProvider>
                </OtherUserPostsContextProvider>
              </UserPostsContextProvider>
            </CommunityRelationProvider>
          </ReceivedRequestsProvider>
        </ChatProvider>
      </ProfileContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
