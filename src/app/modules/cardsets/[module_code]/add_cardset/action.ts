'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function submitCardSet(
    moduleCode: string,
    title: string,
    flashcards: { front: string; back: string }[],
) {
    const supabase = await createClient();

    // 1. Get module_id by module code
    const { data: module, error: moduleError } = await supabase
        .from('modules')
        .select('module_id')
        .eq('code', moduleCode)
        .single();

    if (moduleError || !module) {
        throw new Error('Module not found');
    }

    // 2. Insert individual cards and get their ids
    const { data: insertedCards, error: insertCardsError } = await supabase
        .from('cards')
        .insert(
            flashcards.map((card) => ({
                front: card.front,
                back: card.back,
            })),
        )
        .select('card_id'); // make sure to return ids

    if (insertCardsError || !insertedCards) {
        throw new Error('Failed to insert individual cards 1');
    }

    // Extract card_ids into an array
    const cardIds = insertedCards.map((c) => c.card_id);

    // 3. Now create the flashcard_set linking to these card ids
    const { data: newSet, error: setError } = await supabase
        .from('flashcard_sets')
        .insert({
            title,
            modules: [module.module_id],
            cards: cardIds,
            owner: null, // set to user id if applicable
            description: '',
            public: false,
        })
        .select()
        .single();

    if (setError || !newSet) {
        throw new Error('Failed to create flashcard set 2');
    }

    // get current cardsets
    const { data: moduleData, error: getModuleError } = await supabase
        .from('modules')
        .select('cardsets')
        .eq('module_id', module.module_id)
        .single();

    if (getModuleError || !moduleData) {
        throw new Error('Could not fetch existing cardsets array');
    }

    // append new cardset id
    const updatedCardsets = [...(moduleData.cardsets || []), newSet.cardset_id];

    // update the module record
    const { error: updateModuleError } = await supabase
        .from('modules')
        .update({ cardsets: updatedCardsets })
        .eq('module_id', module.module_id);

    if (updateModuleError) {
        throw new Error('Failed to update module cardsets array');
    }

    // 4. Redirect to the new cardset page
    redirect(`/modules/cardsets/${moduleCode}/${newSet.cardset_id}`);
}
