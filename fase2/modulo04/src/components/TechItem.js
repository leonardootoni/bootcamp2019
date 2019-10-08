import React from 'react';
import PropTypes from 'prop-types';

function TechItem({ tech, onDelete }) {
  return (
    <li>
      {tech}
      <button type='button' onClick={onDelete}>
        x
      </button>
    </li>
  );
}

// define component default props
TechItem.defaultProps = {
  tech: 'Oculto'
};

// define Component prop types
TechItem.propTypes = {
  tech: PropTypes.string,
  onDelete: PropTypes.func.isRequired
};

export default TechItem;
