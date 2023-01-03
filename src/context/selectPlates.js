import { createContext } from 'react';

const PlateContext = createContext({
    plates: [],
    setPlate: (i) => {
        this.cartPrice = i;
    }
});

export default PlateContext;