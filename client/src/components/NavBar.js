import React, {useContext} from 'react';
import {Context} from "../index";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {Rules_Route} from "../utils/const";
import {observer} from "mobx-react-lite";

const NavBar = observer(() => {
    const {user} = useContext(Context)
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <NavLink style={{color:'white'}} to={Rules_Route}>
                    Secret Santa!!
                </NavLink>
                {user.isAuth ?
                <Nav className="ml-auto">
                    <Button variant="outline-danger">Админ Панель</Button>
                    <Button variant="outline-danger" className="ms-4">Стать Сантой))</Button>
                    <Button variant="outline-danger" className="ms-4">Снять с себя заклинание((</Button>
                </Nav>
                :
                <Nav className="ml-auto">
                    <Button variant="outline-danger" onClick={() => user.setIsAuth(true)}>Стать Сантой))</Button>
                </Nav>
                }
            </Container>
        </Navbar>
    );
});

export default NavBar;