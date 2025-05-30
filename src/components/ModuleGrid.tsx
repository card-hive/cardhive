import ModuleCard from "./ModuleCard";
import styles from "../styles/ModulePage.module.css";

const modules = [
    { code: "LAJ1201", image: "/japan.jpg" },
    { code: "CS1101S", image: "/matrix.jpg" },
    { code: "MA1521", image: "/math.jpeg" },
    { code: "LAJ2201", image: "/japan.jpg" },
    { code: "CS2040S", image: "/matrix.jpg" },
    { code: "MA1522", image: "/math.jpeg" },
];

export default function ModuleGrid() {
    return (
        <section className={styles.moduleGrid}>
            {modules.map((mod) => (
                <ModuleCard key={mod.code} {...mod} />
            ))}
        </section>
    );
}
