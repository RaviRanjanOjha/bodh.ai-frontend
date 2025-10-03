import PropTypes from "prop-types";
import classNames from "classnames";
import "./button.css";

const Button = ({
  text,
  icon,
  variant = "primary",
  shape = "rectangle",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const btnClass = classNames(
    "btn",
    `btn-${variant}`,
    `btn-${shape}`,
    { "btn-icon-only": !text && icon },
    className
  );

  return (
    <button
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {text && <span className="btn-text">{text}</span>}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "success"]),
  shape: PropTypes.oneOf(["rectangle", "round"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
