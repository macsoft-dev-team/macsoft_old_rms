import React from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";

function SearchForm(props) {
  const { register, handleSubmit, watch, reset } = useForm();
  const { onSubmit, onClear } = props;

  const filter = watch("filter");

  const handleClear = () => {
    onClear();
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup style={{ minWidth: "300px" }}  >
        <Form.Group className="flex-grow-1 position-relative" controlId="formBasicEmail">
          <Form.Control
            type="text"
            placeholder="Search"
            name="search"
            {...register("filter")}
            className="shadow-none rounded-0"
          />
          {filter && (
            <Button onClick={handleClear} variant="none" type="button" className="position-absolute top-0 end-0 border-0">
              x
            </Button>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          <FaSearch />
        </Button>

      </InputGroup>
    </Form>
  );
}

export default React.memo(SearchForm);