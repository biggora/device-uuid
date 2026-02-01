import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DeviceInfo } from '../../examples/react-example';
import React from 'react';

describe('DeviceInfo React Component', () => {
  it('displays device UUID', () => {
    render(<DeviceInfo />);
    expect(screen.getByText(/UUID:/)).toBeInTheDocument();
  });

  it('displays browser info', () => {
    render(<DeviceInfo />);
    expect(screen.getByText(/Browser:/)).toBeInTheDocument();
  });

  it('displays OS info', () => {
    render(<DeviceInfo />);
    expect(screen.getByText(/OS:/)).toBeInTheDocument();
  });

  it('generates a valid UUID format', () => {
    render(<DeviceInfo />);
    const uuidText = screen.getByText(/UUID:/).textContent;
    const uuid = uuidText?.replace('UUID: ', '');
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});
