import {Context, Contract, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import { Animal } from './animal';

export class AnimalContract extends Contract {
    
    @Transaction()
    
    public async InitLedger ( ctx : Context): Promise<void>{

    }


@Transaction()

public async createanimal (ctx: Context, id: string, name: string, type: string, breed: string, 
    birthDate: string, description: string, imgUrl: string, pedigree:string,
    OwnerId: string, OwnerLastname: string, OwnerName: string ): 
    Promise<void> {
    
    const exists = await this.animalexists(ctx, id);
    
    if (exists) {
        throw new Error(`The animal ${id} already exists`);
    }
    
    const animal = {
        
        ID: id,
        name: name,
        type: type,
        breed: breed,
        birthDate: birthDate,
        description: description,
        imgUrl: imgUrl,
        pedigree: pedigree,
        OwnerId: OwnerId,
        OwnerName: OwnerName,
        OwnerLastname: OwnerLastname
    
    }
        
    await ctx.stub.putState (id, Buffer.from(stringify(animal)));

}
    

@Transaction()

public async updateanimalname (ctx: Context, id: string, newname: string, ): Promise<void> {
    
    const exists = await this.animalexists(ctx, id);
   
    if (!exists) {
        throw new Error(`The animal with id:${id} does not exist`);

    }

    const animalString = await this.readanimal(ctx, id);
    const animal = JSON.parse(animalString) as Animal;
    
    animal.name=newname

    
    return ctx.stub.putState(id, Buffer.from(stringify(animal)));

    }


@Transaction(false)

public async readanimal (ctx: Context, id: string): Promise<string> {
    
    const assetJSON = await ctx.stub.getState(id); 
   
    if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The animal with id:${id} does not exist`);

    }
 
    return assetJSON.toString();

}

@Transaction(false)

@Returns('boolean')

public async animalexists (ctx: Context, id: string): Promise<boolean> {
    
    const assetJSON = await ctx.stub.getState(id);
    
    return assetJSON && assetJSON.length > 0;

}


@Transaction()

public async updateanimal (ctx: Context, id: string, name: string, type: string, breed: string, 
   birthDate: string, description: string, imgUrl: string, pedigree:string,
   OwnerId: string, OwnerLastname: string, OwnerName: string ): 
   Promise<void> {
    
    const exists = await this.animalexists(ctx, id);
    
    if (!exists) {
        throw new Error(`The animal with id:${id} does not exist`);
   
    }

    
    const updatedAnimal = {
       
        ID: id,
        name: name,
        type: type,
        breed: breed,
        birthDate: birthDate,
        description: description,
        imgUrl: imgUrl,
        pedigree: pedigree,
        OwnerId: OwnerId,
        OwnerName: OwnerName,
        OwnerLastname: OwnerLastname,
   
    };
    
    return ctx.stub.putState (id, Buffer.from(stringify(updatedAnimal)));

}


@Transaction()

public async deleteanimal (ctx: Context, id: string): Promise<void> {
    
    const exists = await this.animalexists(ctx, id);
    
    if (!exists) {
        throw new Error(`The animal with id:${id} does not exist`);

    }

    return ctx.stub.deleteState(id);

}


@Transaction(false)

@Returns('string')

public async getallanimals (ctx: Context): Promise<string> {

    const allAnimals: Animal[] = [];

    const iterator = await ctx.stub.getStateByRange('', '');
    
    let result = await iterator.next();
    
    while (!result.done) {
   
        const strValue = Buffer.from (result.value.value.toString()).toString('utf8');
        let record;
       
        try {
            record = JSON.parse(strValue);
        
        } 
        
        catch (er) {
            console.log(er);
            record = strValue;
        
        }
       
        allAnimals.push(record);
        
        result = await iterator.next();
    
    }
    
    return JSON.stringify(allAnimals);

}


@Transaction(false)
    
    public async getanimalhistory (ctx: Context, id: string) {
        
        let resultsIterator = await ctx.stub.getHistoryForKey(id);
        let results = await this._getallresults(resultsIterator, true);

        return JSON.stringify(results);

    }

    public async _getallresults (iterator, isHistory) {
        
        let allResults = [];
        let res = await iterator.next();
        
        while (!res.done) {
            
            if (res.value && res.value.value.toString()) {
                
                let jsonRes: any = {};
                console.log(res.value.value.toString("utf-8"));
                
                if (isHistory && isHistory === true) {
                    
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    
                    try {
                        jsonRes.value = JSON.parse(res.value.value.toString("utf-8"));
                    } 
                    
                    catch (er) {
                        console.log(er);
                        jsonRes.value = res.value.value.toString("utf-8");
                    }
                }
                
                else {
                    jsonRes.Key = res.value.key;
                    
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString("utf-8"))
                    }
                   
                    catch (er) {
                        console.log(er);
                        jsonRes.Record = res.value.value.toString("utf-8");
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        
        return allResults;
    }


    @Transaction(false)
    
    public async getanimalbyname (ctx: Context, name: string): Promise<string> {
    
        const allResults = [];
        const iterator = await ctx.stub.getQueryResult(name);
        let result = await iterator.next();
    
        while (!result.done) {
    
            const strValue = Buffer.from(result.value.value.toString()).toString(
                "utf8"
            );
            let record;
    
            try {
                record = JSON.parse(strValue);
            } 
            
            catch (er) {
                console.log(er);
                record = strValue;
            }
            
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

     @Transaction(false)
    
     public async getanimalbyowner(
    
        ctx: Context,
        OwnerId: string
    ): 
    Promise<string> {
        const allResults = [];

        const iterator = await ctx.stub.getQueryResult(OwnerId);
        let result = await iterator.next();
    
        while (!result.done) {
    
            const strValue = Buffer.from (result.value.value.toString()).toString(
                "utf8"
            );
    
            let record;
    
            try {
                record = JSON.parse(strValue);
            } 
            
            catch (er) {
                console.log(er);
                record = strValue;
            }
            
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    @Transaction()
    
    public async changeowner(
    
        ctx: Context,
        id: string,
        newId: string,
        newOwnerName: string,
        newOwnerLastname: string
    
    ): Promise<void> {
    
        const exists = await this.animalexists(ctx, id);
    
        if (!exists) {
            throw new Error(`The animal ${id} does not exist`);
        }

        const updatedOwner = {
            OwnerId: newId,
            OwnerName: newOwnerName,
            OwnerLastname: newOwnerLastname,
        };

        return ctx.stub.putState (id, Buffer.from(stringify(updatedOwner)));
    }



}
