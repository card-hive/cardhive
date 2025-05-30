import Image from "next/image";
import styles from "../styles/ModulePage.module.css";

interface ModuleCardProps {
    code: string;
    image: string;
}

export default function ModuleCard({ code, image }: ModuleCardProps) {
    return (
        <div className={styles.moduleCard}>
            <div className={styles.moduleImageWrapper}>
                <Image
                    src={image}
                    alt={code}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="100vw"
                />
            </div>
            <div className={styles.moduleLabel}>{code}</div>
        </div>
    );
}
