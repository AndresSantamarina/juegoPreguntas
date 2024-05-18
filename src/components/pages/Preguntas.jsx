import { Button, Container } from "react-bootstrap";
import CardPreguntaEditDelete from "../CardPreguntaEditDelete";

const Preguntas = () => {
    return (
        <Container className='mainSection'>
            <section className="my-5">
                <h1 className='text-center'>Listado de preguntas</h1>
                <h4 className='text-center my-3'>Editar o eliminar preguntas según el nivel</h4>
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
            <section className="my-5">
                <CardPreguntaEditDelete></CardPreguntaEditDelete>
            </section>
        </Container>
    );
};

export default Preguntas;