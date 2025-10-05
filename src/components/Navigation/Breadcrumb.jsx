import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Navigation.css';

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

  const getBreadcrumbName = (segment, index) => {
    const breadcrumbMap = {
      'sold': 'Sold Properties',
      'abilable': 'Available Properties',
      'add-property': 'Add Property',
      'client': 'Client Management',
      'SellAvaliable': 'Sell Available',
      'rentAvaliable': 'Rent Available',
      'leaseAvailable': 'Lease Available',
      'sellSold': 'Sell Sold',
      'rentSold': 'Rent Sold',
      'leaseSold': 'Lease Sold',
      'add': 'Add Client',
      'list': 'Client List',
      'edit': 'Edit Client'
    };

    // Handle dynamic segments (like IDs)
    if (index === pathSegments.length - 1 && !isNaN(segment)) {
      return `Edit Client #${segment}`;
    }

    return breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const getBreadcrumbPath = (index) => {
    const segments = pathSegments.slice(0, index + 1);
    return '/' + segments.join('/');
  };

  if (pathSegments.length === 0) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-home">
        <span className="breadcrumb-icon">🏠</span>
        Home
      </Link>
      
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = getBreadcrumbPath(index);
        const name = getBreadcrumbName(segment, index);

        return (
          <React.Fragment key={index}>
            <span className="breadcrumb-separator">›</span>
            {isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {name}
              </span>
            ) : (
              <Link to={path} className="breadcrumb-link">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
