import { applyEach, required, SchemaPathTree, validate, validateTree } from '@angular/forms/signals';
import { MaterialPriceModel } from '../../schemas/material-model.schema';
import { positiveNumericString } from 'src/app/library';

export function materialPrice(path: SchemaPathTree<MaterialPriceModel>) {
    required(path.min);
    positiveNumericString(path.min);
    required(path.price);
    positiveNumericString(path.price);
}

export function materialPrices(path: SchemaPathTree<MaterialPriceModel[]>) {
    applyEach(path, (p) => {
        materialPrice(p);
    });
    validateTree(path, ({ value, fieldTree }) => {
        const values = value();
        const duplicates = values.map((el, idx, a) => (a.findIndex((m) => m.min === el.min) !== idx) ? fieldTree[idx].min : null).filter((idx) => idx !== null);
        if (duplicates.length === 0) {
            return null;
        }
        return duplicates.map(f => ({ kind: 'duplicate', message: `Vērtība atkārtojas`, fieldTree: f }));

    });

}