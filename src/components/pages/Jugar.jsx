import { Button, Container } from 'react-bootstrap';

const Jugar = () => {
    return (
        <Container className='mainSection'>
            <section className='my-5'>
                <h1 className='text-center my-3'>Juego</h1>
                <h4 className='text-center my-3'>Elija el nivel en el que quiere jugar</h4>
              <Button className='btn btn-dark m-2'>Nivel 1</Button>  
              <Button className='btn btn-dark m-2'>Nivel 2</Button>  
              <Button className='btn btn-dark m-2'>Nivel 3</Button>  
              <Button className='btn btn-dark m-2'>Nivel 4</Button>  
              <Button className='btn btn-dark m-2'>Nivel 5</Button>  
              <Button className='btn btn-dark m-2'>Nivel 6</Button>  
              <Button className='btn btn-dark m-2'>Nivel 7</Button>  
              <Button className='btn btn-dark m-2'>Nivel 8</Button>  
              <Button className='btn btn-dark m-2'>Nivel 9</Button>  
              <Button className='btn btn-dark m-2'>Nivel 10</Button>  
            </section>
        </Container>
    );
};

export default Jugar;