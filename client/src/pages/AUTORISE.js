import React, {useContext} from 'react';
import {Button, Card, Container, Form} from "react-bootstrap";
import {NavLink, useLocation} from "react-router-dom";
import {Login_Route, Reg_Route} from "../utils/const";

const Autorise = () => {
    const location = useLocation()
    const isLogin = location.pathname === Login_Route

    return (
        <Container className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight-54}}
        >
            <Card style={{width:600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Стань Сантой сейчас!!' : 'Колдуй заклинание и перевоплощайся!))'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-2"
                        placeholder="Введи свой email"
                    />
                    {isLogin ?
                        <Form.Control
                        className="mt-2"
                        placeholder="Введи своё тайное заклинание"
                        />
                    :
                        <Form.Control
                            className="mt-2"
                            placeholder="Придумай своё тайное заклинание"
                        />
                    }
                    <Button className="mt-4" variant="outline-info">
                        Перевратиться в Санту *вжух*</Button>
                    {isLogin ?
                        <div>
                        Ещё не был Сантой?? <NavLink to={Reg_Route}>Создай своё заклинание и скорее превратись в
                        Санту!!</NavLink>
                        </div>
                    :
                        <div>
                            Уже превращался в санту?! <NavLink to={Login_Route}>Тогда вводи своё заклинание!!</NavLink>
                        </div>
                    }

                </Form>
            </Card>
        </Container>
    );
};

export default Autorise;