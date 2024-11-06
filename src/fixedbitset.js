


export default class FixedBitSet {

    constructor(entries){
        this.fixedbitset = Array.from({length: entries}, (v, i) => false);
    }

    static with_capacity(entries){
        let f = new FixedBitSet(entries);
        return f;
    }

     set(n, value){
        this.fixedbitset[n] = value ;
    }


     clear(){
       this.fixedbitset.fill(0);
     }


     toggle(n){
        this.fixedbitset[n] = this.fixedbitset[n]==false;
     }

     get(n){
        return this.fixedbitset[n];
     }

}
