"use client";
import { useState } from "react";
import styles from "@/styles/Header.module.css";
import Link from "next/link";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>CardHive</div>

            <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
                <Link href="/" onClick={() => setMenuOpen(false)}>
                    Home
                </Link>
                <Link href="/modules" onClick={() => setMenuOpen(false)}>
                    Modules
                </Link>
                <Link href="/about" onClick={() => setMenuOpen(false)}>
                    About
                </Link>
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
