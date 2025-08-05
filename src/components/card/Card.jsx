import React from 'react';
import { assets } from "../../assets/assets";
import './card.css'; // import the CSS styles
// import LanguageIcon from '@mui/icons-material/Language';
// import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
 
const Card = ({ size = 'medium',iconLeft,iconRight, header, footer, children,onClick={onClick} }) => {
 return (
<div className={`card card-${size}`}>
     {header && <div className="card-header">{header}</div>}
     <div className="card-header">
        <button className="image-button">{iconLeft}</button>
        <button className="image-button box-arrow" onClick={onClick}>{iconRight}</button>
      </div>
   
    <div className="card-content">{children}</div>
     {footer && <div className="card-footer">{footer}</div>}
</div>
 );
};

export default Card;