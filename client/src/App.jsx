import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Protected from './components/Protected';
import Posts from './pages/Posts';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';


export default function App(){
return (
<>
<NavBar />
<Routes>
<Route path="/" element={<Posts />} />
<Route path="/post/:id" element={<PostDetail />} />
<Route path="/insights" element={<Insights />} />
<Route path="/new" element={<Protected><NewPost /></Protected>} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="*" element={<NotFound />} />
</Routes>
</>
);
}