import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { Animal } from './animal';

export class AnimalContract extends Contract {
    @Transaction()
    public async InitLedger(ctx: Context): Promise<void>{

    }


@Transaction()
public async CreateAnimal(ctx: Context, id: string, name: string, type: string, breed: string, birthDate: string, description: string, imgUrl: string, pedigree:boolean): Promise<void> {
    const exists = await this.AnimalExists(ctx, id);
    if (exists) {
        throw new Error(`The animal ${id} already exists`);
    }
    
    const animal : Animal = {
        ID: id,
        name: name,
        type: type,
        breed: breed,
        birthDate: birthDate,
        description: description,
        imgUrl: imgUrl,
        pedigree: pedigree
    }
        
    await ctx.stub.putState(id, Buffer.from(stringify(animal)));
}
    


@Transaction()
public async UpdateAnimalName(ctx: Context, id: string, newname: string, ): Promise<void> {
    const exists = await this.AnimalExists(ctx, id);
    if (!exists) {
        throw new Error(`The animal with id:${id} does not exist`);
    }

    const animalString = await this.ReadAnimal(ctx, id);
    const animal = JSON.parse(animalString) as Animal;
    animal.name=newname

    
    // we insert data in the world state
    return ctx.stub.putState(id, Buffer.from(stringify(animal)));
}


@Transaction(false)
public async ReadAnimal(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id); // get the animal from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The animal with id:${id} does not exist`);
    }
    return assetJSON.toString();
}

@Transaction(false)
@Returns('boolean')
public async AnimalExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
}



@Transaction()
public async UpdateAnimal(ctx: Context, id: string, name: string, type: string, breed: string, birthDate: string, description: string, imgUrl: string, pedigree:boolean): Promise<void> {
    const exists = await this.AnimalExists(ctx, id);
    if (!exists) {
        throw new Error(`The animal with id:${id} does not exist`);
    }

    
    const updatedAnimal:Animal = {
       ID: id,
        name: name,
        type: type,
        breed: breed,
        birthDate: birthDate,
        description: description,
        imgUrl: imgUrl,
        pedigree: pedigree
    };
    
    return ctx.stub.putState(id, Buffer.from(stringify(updatedAnimal)));
}


@Transaction()
public async DeleteAnimal(ctx: Context, id: string): Promise<void> {
    const exists = await this.AnimalExists(ctx, id);
    if (!exists) {
        throw new Error(`The animal with id:${id} does not exist`);
    }
    return ctx.stub.deleteState(id);

}


@Transaction(false)
@Returns('string')
public async GetAllAnimals(ctx: Context): Promise<string> {
    const allAnimals: Animal[] = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();
    while (!result.done) {
        const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
        } catch (err) {
            console.log(err);
            record = strValue;
        }
        allAnimals.push(record);
        result = await iterator.next();
    }
    return JSON.stringify(allAnimals);
}
}
