import React from 'react';
import {Card, Container} from "react-bootstrap";

const Rules = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Card  text="light" bg="success" border="danger" style={{ width: '70rem', height: '42rem'}}>

                <Card.Body>
                    <Card.Title>Правила!!! Это очень важно! Если ты их нарушишь, заклинание превратит тебя из Санты в Сатану)) хе хе</Card.Title>
                    <Card.Text>
                        Санта не Сатана, но подарок может не принести((
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Rules;