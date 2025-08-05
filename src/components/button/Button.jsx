// import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
// import './button.css';

// const Button = () => {
//   const Button = ({
//   text,
//   icon,
//   variant = 'primary',
//   shape = 'rectangle',
//   onClick,
//   disabled = false,
//   className = '',
//   ...props
// }) => {
//   const btnClass = classNames(
//     'btn',
//     `btn-${variant}`,
//     `btn-${shape}`,
//     { 'btn-icon-only': !text && icon },
//     className
//   );
//   return (
//     <button
//       className={btnClass}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {icon && <span className="btn-icon">{icon}</span>}
//       {text && <span className="btn-text">{text}</span>}
//     </button>
//   );
// };
// Button.propTypes = {
//   text: PropTypes.string,
//   icon: PropTypes.element,
//   variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
//   shape: PropTypes.oneOf(['rectangle', 'round']),
//   onClick: PropTypes.func,
//   disabled: PropTypes.bool,
//   className: PropTypes.string
// };
// }

// export default Button

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./button.css"; // Optional: External CSS or Tailwind classes

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

// •   Icons only
//     •   Text only
//     •   Icon + text
//     •   Variations (like primary, secondary, danger, etc.)
//     •   Different shapes (like round, rectangle)
//     •   Custom handlers (e.g., onClick)
// --
// Button.jsx (Reusable Component)
// import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
// import './Button.css'; // Optional: External CSS or Tailwind classes
// const Button = ({
//   text,
//   icon,
//   variant = 'primary',
//   shape = 'rectangle',
//   onClick,
//   disabled = false,
//   className = '',
//   ...props
// }) => {
//   const btnClass = classNames(
//     'btn',
//     `btn-${variant}`,
//     `btn-${shape}`,
//     { 'btn-icon-only': !text && icon },
//     className
//   );
//   return (
//     <button
//       className={btnClass}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {icon && <span className="btn-icon">{icon}</span>}
//       {text && <span className="btn-text">{text}</span>}
//     </button>
//   );
// };
// Button.propTypes = {
//   text: PropTypes.string,
//   icon: PropTypes.element,
//   variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
//   shape: PropTypes.oneOf(['rectangle', 'round']),
//   onClick: PropTypes.func,
//   disabled: PropTypes.bool,
//   className: PropTypes.string
// };
// export default Button;
// —
// plain CSS
// .btn {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 500;
//   padding: 0.5rem 1rem;
//   border: none;
//   cursor: pointer;
//   transition: 0.3s all ease-in-out;
// }
// .btn-icon-only {
//   padding: 0.5rem;
// }
// .btn-primary {
//   background-color: #007bff;
//   color: white;
// }
// .btn-secondary {
//   background-color: #6c757d;
//   color: white;
// }
// .btn-danger {
//   background-color: #dc3545;
//   color: white;
// }
// .btn-success {
//   background-color: #28a745;
//   color: white;
// }
// .btn-round {
//   border-radius: 50px;
// }
// .btn-rectangle {
//   border-radius: 4px;
// }
// .btn-icon {
//   display: inline-flex;
//   margin-right: 0.5rem;
// }
// .btn-icon-only .btn-icon {
//   margin-right: 0;
// }
// —
// Calling button component
// import React from 'react';
// import Button from './Button';
// import { FaSearch, FaTrash } from 'react-icons/fa';
// const App = () => {
//   return (
//     <div>
//       <Button
//         icon={<FaSearch />}
//         shape="round"
//         variant="primary"
//         onClick={() => alert('Icon Only')}
//       />
//       <Button
//         text="Search"
//         icon={<FaSearch />}
//         variant="success"
//         shape="rectangle"
//         onClick={() => alert('Text + Icon')}
//       />
//       <Button
//         text="Delete"
//         icon={<FaTrash />}
//         variant="danger"
//         onClick={() => alert('Danger Button')}
//       />
//       <Button
//         text="Submit"
//         variant="secondary"
//         shape="round"
//         onClick={() => alert('Round Text Only')}
//       />
//     </div>
//   );
// };
// export default App;
