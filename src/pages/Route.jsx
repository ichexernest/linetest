import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from '/images/title.png';
import Share from './Share';
import Welcome from './Welcome';
import Canva from './Canva';
import Award from './Award';

import { useRoute } from '../provider/routeProvider';
const Route = () => {
    const { Route } = useRoute()


    return (
        <>
            {Route.routeNum === 1 && <Welcome />}
            {Route.routeNum === 2 && <Canva />}
            {Route.routeNum === 3 && <Share />}
            {Route.routeNum === 4 && <Award />}
        </>
    );
}

export default Route;
