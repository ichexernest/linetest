import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
        return (
        <>
        <span>Welcome</span>
        <p>this is a welcome page, can display some activity rule, policy, or something</p>
        <Link to={`/canva`}> <button> start </button></Link>
        <Link to={`/share`}> <button> share </button></Link>
        </>);
    }
export default Welcome;