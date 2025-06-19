import{ NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
export default function LinkButton({ to, text, variant }) {
    return (
        <NavLink to={to} className="text-white text-decoration-none">
            <Button variant={variant} size="sm" className="text-uppercase">
                {text}
            </Button>
        </NavLink>
    );
}