import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom'

export default function NavBar(props) {
    return (
        <div className='navBar'>
                <ul>
                    <li><a href='/'>Brooklyn Bev</a></li>
                    <li><a href='/beverages'>Beverages</a></li>
                    <li><a href='/shop'>Shop</a></li>
                    <li><a href='/blog'>Blog</a></li>
                    <li><a href='/contact'>Contact</a></li>
                    <li>{!props.isLoggedIn? <a href='/login'>Login</a> : <a href='/' onClick={props.logOut}>Logout</a>}</li>
                </ul>
        </div>
    )
}
