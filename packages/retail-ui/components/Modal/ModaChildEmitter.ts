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

export const Emitter = new ModalChildEmitter();
export enum ChildrenActions {
    HeaderMount = 'header_mount',
    HeaderUnmount = 'header_unmount',
    FooterMount = 'footer_mount',
    FooterUnmount = 'footer_unmount'
}
