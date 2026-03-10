import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout';
import TaskDetail from './pages/TaskDetail/TaskDetail';
import AddTask from './pages/AddTask/AddTask';
import './App.css';


function App() {
  return (
    <Router> 
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/add" element={<AddTask />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;