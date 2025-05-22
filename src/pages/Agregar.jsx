import { Container, FormGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { crearPreguntaAPI } from "../helpers/queries";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Agregar = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const { id } = useParams();

  const crearPregunta = async (pregunta) => {
    const respuesta = await crearPreguntaAPI(pregunta);
    if (respuesta.status === 201) {
      Swal.fire({
        title: "Pregunta creada",
        text: `La pregunta fue creada correctamente`,
        icon: "success",
      });
      reset();
    } else {
      Swal.fire({
        title: "Ocurrió un error",
        text: `La pregunta no pudo ser creada`,
        icon: "error",
      });
    }
  };

  return (
    <Container className="mainSection">
      <h1 className="text-center my-5">AGREGAR</h1>
      <section>
        <h4 className="text-center my-3">Agregar preguntas</h4>
        <div className="d-flex justify-content-center my-5">
          <Form className="w-50" onSubmit={handleSubmit(crearPregunta)}>
            <FormGroup className="mb-3" controlId="formNivel">
              <Form.Label>Nivel</Form.Label>
              <Form.Select
                aria-label="Selector de niveles"
                {...register("nivel", {
                  required: "Seleccione un nivel",
                })}
              >
                <option value="">
                  Seleccione el nivel al que quiere agregar la pregunta
                </option>
                <option value="1">Uno</option>
                <option value="2">Dos</option>
                <option value="3">Tres</option>
                <option value="4">Cuatro</option>
                <option value="5">Cinco</option>
                <option value="6">Seis</option>
                <option value="7">Siete</option>
                <option value="8">Ocho</option>
                <option value="9">Nueve</option>
                <option value="10">Diez</option>
              </Form.Select>
              <Form.Text className="text-danger">
                {errors.nivel?.message}
              </Form.Text>
            </FormGroup>

            <Form.Group className="mb-3" controlId="formPregunta">
              <Form.Label>Pregunta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese una pregunta"
                {...register("pregunta", {
                  required: "La pregunta es obligatoria",
                  minLength: {
                    value: 5,
                    message: "La pregunta debe tener como mínimo 5 caracteres",
                  },
                  maxLength: {
                    value: 150,
                    message:
                      "La pregunta debe tener como máximo 150 caracteres",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.pregunta?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionUno">
              <Form.Label>Opción 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Opción uno"
                {...register("opcionUno", {
                  required: "La opción es obligatoria",
                  minLength: {
                    value: 1,
                    message: "La opción debe tener como mínimo 1 caracter",
                  },
                  maxLength: {
                    value: 100,
                    message: "La opción debe tener como máximo 100 caracteres",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.opcionUno?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionDos">
              <Form.Label>Opción 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Opción dos"
                {...register("opcionDos", {
                  required: "La opción es obligatoria",
                  minLength: {
                    value: 1,
                    message: "La opción debe tener como mínimo 1 caracter",
                  },
                  maxLength: {
                    value: 100,
                    message: "La opción debe tener como máximo 100 caracteres",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.opcionDos?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionTres">
              <Form.Label>Opción 3</Form.Label>
              <Form.Control
                type="text"
                placeholder="Opción tres"
                {...register("opcionTres", {
                  required: "La opción es obligatoria",
                  minLength: {
                    value: 1,
                    message: "La opción debe tener como mínimo 1 caracter",
                  },
                  maxLength: {
                    value: 100,
                    message: "La opción debe tener como máximo 100 caracteres",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.opcionTres?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionCorrecta">
              <Form.Label>Respuesta Correcta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Respuesta correcta"
                {...register("opcionCorrecta", {
                  required: "La opción es obligatoria",
                  minLength: {
                    value: 1,
                    message: "La opción debe tener como mínimo 1 caracter",
                  },
                  maxLength: {
                    value: 100,
                    message: "La opción debe tener como máximo 100 caracteres",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.opcionCorrecta?.message}
              </Form.Text>
            </Form.Group>
            <div className="text-center">
              <Button variant="dark" type="submit">
                Agregar
              </Button>
            </div>
          </Form>
        </div>
      </section>
    </Container>
  );
};

export default Agregar;
