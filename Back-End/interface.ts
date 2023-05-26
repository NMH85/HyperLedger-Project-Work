import { Animal, Owner } from "../Back-End/entity";

export interface AnimalContractServiceInterface {
   
    createanimal(owner: Owner): Promise<string>;
    
    updateanimal(id: string, owner: Owner): Promise<string>;
    
    updateanimalname(id: string, name: string): Promise<string>;
    
    deleteanimal(id: string): Promise<void>;
    
    getallanimal(): Promise<string>;
    
    readanimal(id: string): Promise<string>;
    
    animalexist(id: string): Promise<string>;
    
    getanimalhistory(id: string): Promise<string>;
    
    getanimalbyname(animalName: string): Promise<Animal>;
    
    getanimalbyowner(ownerId: string): Promise<Animal>;
   
    changeowner(
        
        id: string,
        OwnerId: string,
        OwnerLastname: string,
        OwnerName: string
    ): 
    Promise<string>;

}