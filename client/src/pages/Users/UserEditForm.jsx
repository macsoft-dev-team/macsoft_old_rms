import { useForm } from "react-hook-form";
import { Modal, Form, Button } from "react-bootstrap";
import useUsers from "../../lib/hooks/user";
import { useEffect } from "react";

export default function UserEditForm() {
    const { isEdit, isCreate, user, setEdit, setUser, setCreate, createUser, updateUser } = useUsers();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const submitHandler = (data) => {
        if (isEdit && user) {
              updateUser(user.id, data);
        } else {
             createUser(data);
        }
    };

    const onCancel = () => {
        setEdit(false);
        setCreate(false);
        setUser(null);
        reset();
    }

    useEffect(() => {
        if (isEdit && user) {
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("phone", user.phone);
            setValue("status", user.status ? "ACTIVE" : "INACTIVE");
        }
    }, [isEdit, user, setValue]);

    return (
        <Modal show={isEdit || isCreate} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-uppercase fs-5 py-0 ">{isEdit ? "Edit User" : "Create User"}</Modal.Title>
            </Modal.Header>
            <Form autoComplete="off" onSubmit={handleSubmit(submitHandler)}>
                <Modal.Body>
                    <Form.Group className="mb-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("phone", { required: "Phone is required" })}
                            isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register("status")}>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
