import { Container, Spinner } from 'react-bootstrap';

const LoadingView = ({ isConnected, loading }) => {
  return (
   <Container className="mainSection text-center py-5">
      <Spinner animation="border" variant="danger" />
      <h2 className="mt-3">
        {!isConnected
          ? "Conectando al servidor... 🔌"
          : "Cargando partida... 🎲"}
      </h2>
    </Container>
  );
};

export default LoadingView;