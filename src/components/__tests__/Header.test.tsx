import Header from '../Header';
import { render, screen } from '@testing-library/react';

describe('Header Component', () => {
    // check if rendering
    it('renders the header with logo and navigation links', () => {
        render(<Header />);

        // Check if CardHive appears
        const logo = screen.getByText(/CardHive/i);
        expect(logo).toBeInTheDocument();

        // Check if nav links appear
        const homeLink = screen.getByText(/Home/i);
        const modulesLink = screen.getByText(/Modules/i);
        const allCardSetsLink = screen.getByText(/All Cardsets/i);

        expect(homeLink).toBeInTheDocument();
        expect(modulesLink).toBeInTheDocument();
        expect(allCardSetsLink).toBeInTheDocument();
    });

    // check if links are correct
    it('has correct links for navigation', () => {
        render(<Header />);

        // Check if links are correct
        const homeLink = screen.getByText(/Home/i);
        expect(homeLink.closest('a')).toHaveAttribute('href', '/');

        const modulesLink = screen.getByText(/Modules/i);
        expect(modulesLink.closest('a')).toHaveAttribute('href', '/modules');

        const allCardsetsLink = screen.getByText(/All Cardsets/i);
        expect(allCardsetsLink.closest('a')).toHaveAttribute(
            'href',
            '/all_cardsets',
        );
        const myAccountLink = screen.getByText(/My Account/i);
        expect(myAccountLink.closest('a')).toHaveAttribute(
            'href',
            '/my_account',
        );
    });
});
