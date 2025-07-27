'use client';

import ModuleCard from './ModuleCard';

interface Module {
    code: string;
    image: string;
    add_cardset?: boolean;
}

export default function ModuleGrid({
    modules,
    add_cardset,
}: {
    modules: Module[];
    add_cardset?: boolean;
}) {
    if (!modules || modules.length === 0) {
        return <p>No modules found.</p>;
    }

    return (
        <section className="grid grid-cols-3 gap-6 justify-items-center">
            {modules.map((mod) => (
                <ModuleCard key={mod.code} {...mod} add_cardset={add_cardset} />
            ))}
        </section>
    );
}
