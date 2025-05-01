import React from 'react';
import { NavLink } from 'react-router-dom';
import { DollarSign, Users } from 'react-feather';

export function Navigation() {
  const linkClass = "flex items-center space-x-2 px-12 py-2 rounded-md transition-colors";
  const activeLinkClass = "bg-gray-1500 text-white";
  const inactiveLinkClass = "text-gray-400 hover:text-white hover:bg-gray-1500";

  return (
    <nav className="flex items-center space-x-4 py-12">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
        }
      >
        <DollarSign className="w-5 h-5" />
        <span>MRR</span>
      </NavLink>
      <NavLink
        to="/clients"
        className={({ isActive }) =>
          `${linkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
        }
      >
        <Users className="w-5 h-5" />
        <span>Clients</span>
      </NavLink>
    </nav>
  );
}