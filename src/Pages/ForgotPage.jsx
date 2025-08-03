import React, { use } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import Swal from 'sweetalert2'
const ForgotPage = () => {
    const { resetPassword, email, setEmail } = use(AuthContext)

    

    const handleResetPassword = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        resetPassword(email)
            .then(() => {
                window.location.href = 'https://gmail.com'
            })
                Swal.fire({
                    title: "Good Job",
                    text: "We receive your Password Reset request. Check your email for the the reset link. Check your Spam section in email",
                    icon: "success"
                })
            .catch(() => {
                Swal.fire({
                    title: "Ooops Sorry",
                    text: "Please Provide a Valid Email Address",
                    icon: "error"
                });

            });

    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value); 
      };

    return (
        <div className="w-full max-w-md mx-auto p-10 space-y-3 rounded-xl bg-gray-600 text-gray-100 mb-5 shadow-2xl">
            <h1 className="text-2xl font-bold text-center mb-5">Reset Your Password
            </h1>
            <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-1 text-sm">
                    <label htmlFor="email" className="block dark:text-gray-100 mb-3">Email</label>
                    <input value={email} 
            onChange={handleEmailChange} type="email" name="email" id="email" placeholder="Email" className="w-full px-4 py-3 rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800 focus:dark:border-violet-600" />
                </div>

                <button type='submit' className="block w-full p-3 text-center rounded-sm cursor-pointer text-gray-50 bg-blue-600">Reset Password</button>

            </form>
        </div>
    );
};

export default ForgotPage;