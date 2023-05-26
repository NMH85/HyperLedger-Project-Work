/*
SPDX-License-Identifier: Unlicensed
*/

import  {Object, Property} from 'fabric-contract-api';

@Object()
export class Animal{

    @Property()
    public docType?:  string;

    @Property()
    public ID: string;
    
    @Property()
    public name: string;

    @Property()
    public type: string;

    @Property()
    public breed: string;

    @Property()
    public birthDate: string;

    @Property()
    public description: string;

    @Property()
    public imgUrl: string;

    @Property()
    public pedigree: string;


}

@Object()
export class Owner extends Animal  {

  @Property()
  public docType?: string;

  @Property()
  public OwnerId: string;

  @Property()
  public OwnerName: string;

  @Property()
  public OwnerLastname: string;

}
