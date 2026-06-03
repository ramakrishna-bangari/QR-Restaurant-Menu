import React from 'react'
import '../App.css'

const Navbar = ({ showLoginHandler, showRegisterHandler, showlogout, logoutHandler, restaurant }) => {

    return (
        <div className='navbarSection'>
            <h3>Welcome {restaurant?.restaurantName || ""}</h3>
            <div>
                {!showlogout ?
                    <>
                        <span onClick={showLoginHandler}>Login/</span>
                        <span onClick={showRegisterHandler}>Register</span>
                    </> :
                    <span onClick={logoutHandler}> Logout</span>
                }
            </div>




        </div>
    )
}

export default Navbar