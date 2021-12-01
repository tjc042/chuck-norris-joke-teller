import { LightningElement, api } from 'lwc';
import getCategories from '@salesforce/apex/ChuckNorrisJokeTellerCntrl.getCategories';
import getJoke from '@salesforce/apex/ChuckNorrisJokeTellerCntrl.getJoke';

export default class ChuckNorrisJokeTellerEditor extends LightningElement {

    categories = [];
    showPreview = false;

    _joke;
    _jokeCurationList = null;
    _inputVariables = [];

    @api
    get inputVariables() {
        return this._inputVariables;
    }

    set inputVariables(variables) {
        this._inputVariables = variables || [];
    }

    get runRunTypeOptions(){
        return [
            {label:'Auto', value:'Auto'},
            {label:'Curated', value:'Curated'}
        ]
    }

    get isCuratedRunType(){
        return this.runType == 'Curated' 
    }

    get isCurationEmpty(){
        return this._jokeCurationList == 0;
    }

    // Get the value of the volume input variable.
    get jokeCurationList() {

        if(  this._jokeCurationList ){

            return this._jokeCurationList

        }

        else {

            const param = this.inputVariables.find(({name}) => name === 'curatedJokeJson');
            console.log('param', param);

            let jokeCurationList = param ? JSON.parse(param.value) : [];
    
            this._jokeCurationList = jokeCurationList;
            return jokeCurationList;

        }
    }

    connectedCallback(){
        this.getCategories();
        this.getJoke();
    }

    get curatedJokeJson(){
        if(this._jokeCurationList){
            return JSON.stringify(this._jokeCurationList);
        }

        else {
            return null;
        }
    }

    getCategories(){
        getCategories()
        .then((result) => {
            const parsedResult = JSON.parse(result);
            let categories = parsedResult.map(item=>{
                return { label: item, value: item };
            });

            categories.unshift({
                label: 'All', 
                value: null 
            })

            this.categories = categories;

        }).catch((err) => {
            console.error(err);
            alert('An error occured');
        });
    }
    
    getJoke(){
        return new Promise(
            (resolve, reject) => {
                getJoke({
                    category: this.category
                })
                .then((result) => {
        
                    const parsedResult = JSON.parse(result);
                    this._joke = parsedResult.value;
                    resolve('Success');

                }).catch((err) => {
                    console.error(err);
                    alert('An error occured');
                    reject(err);
                });
            }

        );
    }

    // Get the value of the volume input variable.
    get runType() {
        const param = this.inputVariables.find(({name}) => name === 'runType');
        if(  param ){
            return param.value;
        }
        
        else {
            return 'Auto';
        };
    }

    // Get the value of the volume input variable.
    get category() {
        const param = this.inputVariables.find(({name}) => name === 'category');
        if(  param ){
            return param.value;
        }
        
        else {
            return null;
        };
    }

    handleCategoryChange(event){
        const category = event.detail.value;
        this.getJoke();
        this.handleVariableChange(category, 'category', 'String')
    }

    handleVariableChange(newValue, variableName, dataType) {
        const valueChangedEvent = new CustomEvent(
            'configuration_editor_input_value_changed', {
                    bubbles: true,
                    cancelable: false,
                    composed: true,
                    detail: {
                        name: variableName,
                        newValue,
                        newValueDataType: dataType
                    }
            }
        );
        this.dispatchEvent(valueChangedEvent);
    }

    handleRefreshClick(){
        this.getJoke();
    }

    async handleAddClick(){
        const joke = this._joke;
        await this.getJoke();

        this.addItemToJokeCurationList(joke);
        console.log('Success');
    }

    handleDeleteJokeClick(event){
        let index = parseInt(event.target.dataset.index);
        this.removeItemToJokeCurationList(index);
    }

    handleShowPreviewClick(){
        this.showPreview = true;
    }

    handleCloseClick(){
        this.showPreview = false;
    }

    handleRunTypeChange(event){
        const value = event.detail.value;
        this.handleVariableChange( value, 'runType', 'String')
    }

    handleRemoveAll(){
        this._jokeCurationList = [];
        this.handleVariableChange(JSON.stringify(this._jokeCurationList), 'curatedJokeJson', 'String')
    }


    removeItemToJokeCurationList(index){
        const jokeCurationList = [...this._jokeCurationList];
        jokeCurationList.splice(index,1);
        this._jokeCurationList = jokeCurationList;
        this.handleVariableChange(JSON.stringify(this._jokeCurationList), 'curatedJokeJson', 'String')
    }

    async addItemToJokeCurationList(joke){
        const key = this._jokeCurationList.length ? this._jokeCurationList.length : 0;
        const jokeCurationList = [...this._jokeCurationList];
        jokeCurationList.push(
            { key: key, value: joke}
        )
        this._jokeCurationList = jokeCurationList;
        this.handleVariableChange(JSON.stringify(this._jokeCurationList), 'curatedJokeJson', 'String')
    }

}