import { Container, FormGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { editarPreguntaAPI, obtenerPreguntaAPI } from "../helpers/queries";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useEffect } from "react";

const Editar = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { id } = useParams();

  const cargarDatosPregunta = async () => {
    try {
      const preguntaEncontrada = await obtenerPreguntaAPI(id);
      reset({
        pregunta: preguntaEncontrada.pregunta,
        opcionUno: preguntaEncontrada.opcionUno,
        opcionDos: preguntaEncontrada.opcionDos,
        opcionTres: preguntaEncontrada.opcionTres,
        opcionCorrecta: preguntaEncontrada.opcionCorrecta,
        nivel: preguntaEncontrada.nivel,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) cargarDatosPregunta();
  }, [id]);

  const editarPregunta = async (pregunta) => {
    const respuesta = await editarPreguntaAPI(pregunta, id);
    if (respuesta.status === 200) {
      Swal.fire({
        title: "Pregunta editada",
        text: `La pregunta fue editada correctamente`,
        icon: "success",
      });
      reset();
      navigate("/preguntas");
    } else {
      Swal.fire({
        title: "Ocurrió un error",
        text: `La pregunta no pudo ser editada`,
        icon: "error",
      });
    }
  };

  return (
    <Container className="mainSection">
      <h1 className="text-center my-5">EDITAR</h1>
      <section>
        <h3 className="my-3">Editar la pregunta</h3>
        <div className="d-flex justify-content-center my-5">
          <Form className="w-50" onSubmit={handleSubmit(editarPregunta)}>
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
              <Form.Label>Opción Correcta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Opción correcta"
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
                Guardar
              </Button>
            </div>
          </Form>
        </div>
      </section>
    </Container>
  );
};

export default Editar;
