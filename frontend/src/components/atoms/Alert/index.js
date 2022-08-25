import React from 'react';
import './style.css';

export const Alert = ({
  type = 'info',
  title,
  children,
  onAlertClose = null,
}) => (
  <div role="alert" className={`fr-alert fr-alert--${type}`}>
    {title && <p className="fr-alert__title">{title}</p>}
    {children}
    {onAlertClose && (
      <button className="fr-link--close fr-link" onClick={onAlertClose}>
        Masquer le message
      </button>
    )}
  </div>
);

export default Alert;
