import { EventEmitter } from 'fbemitter';

class ModalChildEmitter extends EventEmitter {
    private static instance: EventEmitter | null = null; 

    constructor() {
        super();

        if (!ModalChildEmitter.instance) {
            ModalChildEmitter.instance = new EventEmitter();
        }
        
        return ModalChildEmitter.instance;
    }
}

export default new ModalChildEmitter()