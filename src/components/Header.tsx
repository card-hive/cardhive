"use client";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>MyLogo</div>

            <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
                <a href="#home" onClick={() => setMenuOpen(false)}>
                    Home
                </a>
                <a href="#about" onClick={() => setMenuOpen(false)}>
                    About
                </a>
                <a href="#services" onClick={() => setMenuOpen(false)}>
                    Services
                </a>
                <a href="#contact" onClick={() => setMenuOpen(false)}>
                    Contact
                </a>
            </nav>

            <button
                className={styles.menuButton}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button>
        </header>
    );
}
