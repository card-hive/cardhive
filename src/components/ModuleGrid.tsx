'use client';

import ModuleCard from './ModuleCard';

interface Module {
    code: string;
    image: string;
}

export default function ModuleGrid({ modules }: { modules: Module[] }) {
    if (!modules || modules.length === 0) {
        return <p>No modules found.</p>;
    }

    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center">
            {modules.map((mod) => (
                <ModuleCard key={mod.code} {...mod} />
            ))}
        </section>
    );
}
