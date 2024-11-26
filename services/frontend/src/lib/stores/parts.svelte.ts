import { faker } from '@faker-js/faker';

export type Part = {
    id: number;
    name: string;
    image: string;
    selected: boolean;
};

class PartsStore {
    parts = $state<Part[]>([
        { id: 1, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }), selected: false },
        { id: 2, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }), selected: false },
        { id: 3, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }), selected: false },
        { id: 4, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }), selected: false }
    ]);

    newPart: Part = $state({id: this.parts.length + 1, image: '', name: '', selected: false})

    selectedParts = $derived(this.parts.filter(({ selected }) => selected));
    
    addPart() {
        this.parts.push(this.newPart);
        this.newPart = {id: this.parts.length + 1, image: '', name: '', selected: false}
    }

    remove(id: number) {
        this.parts = this.parts.filter(part => part.id !== id);
    }

    toggle(id: number) {
        this.parts = this.parts.map(part =>
            part.id === id ? { ...part, selected: !part.selected } : part
        );
    }
}

export const partsStore = new PartsStore();