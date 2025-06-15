import { BrowserRouter as Router, Routes, Route } from "react-router"
import RegisterPage from './pages/Auth/RegisterPage'
import { ToastContainer } from 'react-toastify';
import SuccessPage from "./pages/Auth/SuccessPage";
import LoginPage from "./pages/Auth/LoginPage";
import Root from "./pages/Root";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatMain from "./pages/ChatMain";
import NewChat from "./pages/NewChat";
import NewGroup from "./pages/NewGroup";
import MainLayout from "./pages/MainLayout";
import SettingsPage from "./pages/setting/SettingsPage";
import ProfileSettings from "./pages/setting/ProfileSettings";
import AccountSettings from "./pages/setting/AccountSettings.jsx";
import SupportHelp from "./pages/setting/SupportHelp.jsx";
import AboutPage from "./pages/setting/AboutPage.jsx";
import ChattingMain from "./pages/ChattingMain.jsx";
import SingleChat from "./pages/SingleChat.jsx";
import GroupChat from "./pages/GroupChat.jsx";
import UserPage from "./pages/UserPage.jsx";
import AddMembers from "./components/AddMembers.jsx";

function App() {

  return (
    <>
      <Router>
        <Routes>
          
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/registration-success' element={<SuccessPage />} />
          <Route path='/login' element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute ><Root /></ProtectedRoute>}  >
            <Route element={<MainLayout />}>
              <Route path="chats" element={<ChatMain />} />
              <Route path="calls" element={<div>Calls Page</div>} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/chat/:chatId" element={<ChattingMain />} >
                <Route path="single-chat" element={<SingleChat />} />
                <Route path="group-chat" element={<GroupChat />} />
            </Route>

            <Route path="/users"  element={<UserPage />}/>

            <Route path="/chats/new" element={<NewChat />} />
            <Route path="/chats/new-group" element={<NewGroup />} />

            <Route path="/chat/:groupId/add-members" element={<AddMembers />} />


<Route path="settings/profile" element={<ProfileSettings />}/>
<Route path="settings/account" element={<AccountSettings />}/>
<Route path="settings/support" element={<SupportHelp />}/>
<Route path="settings/about" element={<AboutPage />}/>



          </Route>

        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
