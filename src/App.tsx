import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Authentication/Login/Login';
import Admin from './Components/Admin/Admin';
import { AuthProvider, useAuth } from './Components/Contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Blogs from './Components/Admin/Blogs/Blogs';
import Architecture from './Components/Admin/Architecture/Architecture';
import ITBlogs from './Components/Admin/IT/ITBlogs';


const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { checkToken } = useAuth();

  return checkToken() ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path='/admin' element={<PrivateRoute element={<Admin />} />}/>
          <Route path="/blogs" element={<Blogs />}/>
          <Route path="/architect" element={<Architecture />}/>
          <Route path='/itblogs' element={<ITBlogs />}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
