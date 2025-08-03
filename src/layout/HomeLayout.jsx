import React from 'react';
import { Outlet, useNavigation } from 'react-router';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Loading from '../components/Loading';


const HomeLayout = () => {
 const {state}=useNavigation()
    return (
        <div>
            <header>
            <Nav></Nav>
            </header>
            <div className='bg-gradient-to-br from-[#f8faff] to-[#e0f2fe]'>

            <main className=' min-h-[calc(100vh-190px)] w-11/12 md:w-9/12 lg:w-7/12 mx-auto'>
               {state=='loading' ?<Loading/>:<Outlet></Outlet>} 
            </main>
            </div>
         <footer>
           <Footer></Footer>
         </footer>
        </div>
    );
};

export default HomeLayout;