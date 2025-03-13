import { Link, NavLink } from "react-router-dom";

export default function Navbar(){
    return (
        <ul className="nav-bar">
            <li><NavLink to="/" className={({isActive})=> isActive ? "active-link" : "" }>home</NavLink></li>
            <li><NavLink to="/table" className={({isActive})=> isActive ? "active-link" : "" }>table</NavLink></li>
            <li><NavLink to="/stats" className={({isActive})=> isActive ? "active-link" : "" }>stats</NavLink></li>
        </ul>
    );
}