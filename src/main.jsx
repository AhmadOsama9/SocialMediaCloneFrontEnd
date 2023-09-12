import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ProfileContextProvider } from './context/ProfileContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'
import { ReceivedRequestsProvider } from './context/ReceivedRequestsContext.jsx'
import { CommunityRelationProvider } from './context/CommunityRelation.jsx'
import { UserPostsContextProvider } from './context/UserPostsContext.jsx'
import { CreateCommunityPostContextProvider } from './context/CreateCommunityPostContext.jsx'
import { CreatePagePostContextProvider } from './context/CreatePagePostContext.jsx'
import { ActiveSectionContextProvider } from './context/ActiveSectionContext.jsx'
import { ForgotPasswordContextProvider } from './context/ForgotPasswordContext.jsx'

import './index.css'
import { OtherUserPostsContextProvider } from './context/OtherUserPosts.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProfileContextProvider>
        <ChatContextProvider>
          <ReceivedRequestsProvider>
            <CommunityRelationProvider>
              <UserPostsContextProvider>
                <OtherUserPostsContextProvider>
                  <CreateCommunityPostContextProvider>
                    <CreatePagePostContextProvider>
                      <ActiveSectionContextProvider>
                        <ForgotPasswordContextProvider>
                          <App />
                        </ForgotPasswordContextProvider>
                      </ActiveSectionContextProvider>
                    </CreatePagePostContextProvider>
                  </CreateCommunityPostContextProvider>
                </OtherUserPostsContextProvider>
              </UserPostsContextProvider>
            </CommunityRelationProvider>
          </ReceivedRequestsProvider>
        </ChatContextProvider>
      </ProfileContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
