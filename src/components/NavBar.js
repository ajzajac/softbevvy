import React from 'react'
import '../App.css';

export default function NavBar() {
    return (
        <div className='navBar'>
                <ul>
                    <li><a href='/'>Brooklyn Bev</a></li>
                    <li><a href='/about'>About</a></li>
                    <li><a href='/shop'>Shop</a></li>
                    <li><a href='/blog'>Blog</a></li>
                    <li><a href='/contact'>Contact</a></li>
                </ul>
        </div>
    )
}
