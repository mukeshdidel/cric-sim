import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';

import Navbar from './components/Navbar.jsx';
import Table from './components/Table.jsx';
import Home from './components/Home.jsx';
import Stats from './components/Stats.jsx';
import Match from './components/homeComponents/Match.jsx';
import Draft from './components/homeComponents/Draft.jsx';
import Team from './components/homeComponents/Team.jsx'


const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="container">
          <Navbar />
          <Home />
        </div>
      ),
    },
    {
      path: "/stats",
      element: (
        <div className="container">
          <Navbar />
          <Stats />
        </div>
      ),
    },
    {
      path: "/table",
      element: (
        <div className="container">
          <Navbar />
          <Table />
        </div>
      ),
    },
    {
      path: "*", 
      element: <h1>404 - Page Not Found</h1>,
    },
    {
      path: "/match/:id",

      element: (
        <div className="container">
          <Navbar />
          <Match />
        </div>        
      ),

    },
    {
      path: "/draft",

      element: (
        <div className="container">
          <Draft/>
        </div>
      )
    },
    {
      path: "/team/:id",

      element: (
        <div className="container">
          <Navbar/>
          <Team/>
        </div>
      )
    }

]);

function App() {

    return ( 
        <RouterProvider router={router} />
    );

}

export default App;
