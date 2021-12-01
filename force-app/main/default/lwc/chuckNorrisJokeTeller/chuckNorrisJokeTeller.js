import { api, LightningElement } from 'lwc';
import getJoke from '@salesforce/apex/ChuckNorrisJokeTellerCntrl.getJoke';

export default class ChuckNorrisJokeTeller extends LightningElement {

    @api category;
    @api curatedJokeJson;
    @api runType;

    _curationLength;
    _currentIdx = 0;
    _curatedJokeLst;
    _joke;

    connectedCallback(){
        if( this.curatedJokeJson ){
            this._curatedJokeLst = JSON.parse(this.curatedJokeJson);
            this._curationLength = this._curatedJokeLst.length - 1;
        }

        if( this.runType=='Curated' && this._curatedJokeLst ){
            this._joke = this._curatedJokeLst[this._currentIdx].value;
        } else {
            this.getJoke();
        }
    }

    getJoke(){
        getJoke({
            category: this.category
        })
        .then((result) => {

            const parsedResult = JSON.parse(result);
            this._joke = parsedResult.value;

        }).catch((err) => {
            console.error(err);
            alert('An error occured');
        });
    }


    handlePreviousClick(){
        if(this.runType == 'Curated'){
            this.iteratePreviousJoke();
        }

        else{
            this.getJoke();
        }
    }

    handleNextClick(){

        if(this.runType == 'Curated'){
            this.iterateNextJoke();
        }

        else{
            this.getJoke();
        }
    }

    iteratePreviousJoke(){ 
        if(this._currentIdx > 0){
            this._currentIdx = this._currentIdx - 1;
            this._joke = this._curatedJokeLst[this._currentIdx].value;
        } else {
            this._currentIdx = this._curationLength;
            this._joke = this._curatedJokeLst[this._currentIdx].value;
        }
    }

    iterateNextJoke(){
        if( this._currentIdx < this._curationLength){
            this._currentIdx = this._currentIdx + 1;
            this._joke = this._curatedJokeLst[this._currentIdx].value;
        } else {
            this._currentIdx = 0;
            this._joke = this._curatedJokeLst[this._currentIdx].value;
        }
    }

}