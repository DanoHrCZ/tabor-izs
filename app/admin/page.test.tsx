import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminPage from './page';

test('renders admin page', () => {
    render(<AdminPage />);
    const linkElement = screen.getByText(/admin page/i);
    expect(linkElement).toBeInTheDocument();
});