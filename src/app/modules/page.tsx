import Header from "@/components/Header";
import ModuleGrid from "@/components/ModuleGrid";
import styles from "@/styles/ModulePage.module.css";

export default function Modules() {
    return (
        <main className={styles.container}>
            <div className={styles.mainContent}>
                <h2 className={styles.sectionTitle}>Modules</h2>
                <input
                    type="text"
                    placeholder="Search for Modules..."
                    className={styles.searchInput}
                />
                <ModuleGrid />
                <footer className={styles.footerNote}>Alroy and Damien</footer>
            </div>
        </main>
    );
}
