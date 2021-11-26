import React from 'react';
import style from './nav.module.css';

const Nav = () => {
    return (
        <nav className={style.nav}>
            <div className={style.logo}>heyapp</div>
        </nav>
    );
};

export default Nav;