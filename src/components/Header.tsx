"use client";
import { useState } from "react";
import styles from "@/styles/Header.module.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>CardHive</div>

            <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
                <a href="/" onClick={() => setMenuOpen(false)}>
                    Home
                </a>
                <a href="/modules" onClick={() => setMenuOpen(false)}>
                    Modules
                </a>
                <a href="/about" onClick={() => setMenuOpen(false)}>
                    About
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
