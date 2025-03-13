import { Outlet } from "react-router-dom";
import Schedule from './homeComponents/Schedule';
import Teams from './homeComponents/Teams';
import Match from './homeComponents/Match';

export default function Home(){

    return(
        <>

            <div className='home-div'>   
                <Schedule />
                <Teams />
            </div>
        </>
    );
}





