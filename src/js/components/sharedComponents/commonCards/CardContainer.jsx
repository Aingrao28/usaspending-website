/**
 * CardContainer.jsx
 * Created by Andrea Blackwell  09/09/2022
 */

import React from 'react';
import PropTypes from "prop-types";

const propTypes = {
    variant: PropTypes.string, // elevated, outline, or none
    size: PropTypes.string, // sm, md, or lg
    fill: PropTypes.string,
    height: PropTypes.number
};

const CardContainer = ({
    variant, size, children, fill, height
}) => (
    <div className={`${variant} ${size} card-container`} style={{ backgroundColor: `${fill}`, height: `${height}` }}>
        { children }
    </div>
);

CardContainer.propTypes = propTypes;
CardContainer.defaultProps = { size: 'md' };
export default CardContainer;
