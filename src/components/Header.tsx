'use client';
import { useState } from 'react';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>CardHive</div>
            <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
                <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className={styles.navLink}
                >
                    Home
                </Link>
                <Link
                    href="/modules"
                    onClick={() => setMenuOpen(false)}
                    className={styles.navLink}
                >
                    Modules
                </Link>
                <Link
                    href="/all_cardsets"
                    onClick={() => setMenuOpen(false)}
                    className={styles.navLink}
                >
                    All Cardsets
                </Link>
                <Link
                    href="/my_account"
                    onClick={() => setMenuOpen(false)}
                    className={styles.navLink}
                >
                    My Account{' '}
                </Link>
                {/* <buttonAdd commentMore actions
                    className="text-white text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button> */}
            </nav>

            {/* <button
                className={styles.menuButton}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button> */}
        </header>
    );
}
