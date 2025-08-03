import React from 'react';
import Nav from '../components/Nav';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';

const AuthLayout = () => {
    return (
        <div className='bg-base-200  min-h-screen'>
           <header>
           <Nav></Nav>
           </header>


<main className='min-h-[calc(100vh-190px)] w-7/12 mx-auto'>
    <Outlet></Outlet>
</main>

<footer>
    <Footer></Footer>
</footer>
            
        </div>
    );
};

export default AuthLayout;