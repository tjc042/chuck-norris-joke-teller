import { LightningElement, api } from 'lwc';

export default class FormattingExampleEditor extends LightningElement {

    showPreview = false;

    _inputVariables = [];
    _builderContext = [];

    @api
    get builderContext() {
        return this._builderContext;
    }

    set builderContext(value) {
        console.log(value);
        this._builderContext = value;
    }

    @api
    get inputVariables() {
        return this._inputVariables;
    }

    set inputVariables(variables) {
        this._inputVariables = variables || [];
    }

    get options() {
        return [
            { label: 'xx-small', value: 'slds-var-m-around_xx-small' },
            { label: 'x-small', value: 'slds-var-m-around_x-small' },
            { label: 'small', value: 'slds-var-m-around_small' },
            { label: 'medium', value: 'slds-var-m-around_medium' },
            { label: 'large', value: 'slds-var-m-around_large' },
            { label: 'x-large', value: 'slds-var-m-around_x-large' }
        ];
    }

    // Get the value of the volume input variable.
    get margins() {
        const param = this.inputVariables.find(({name}) => name === 'margins');
        if(  param ){
            return param.value;
        }
        
        else {
            return 'slds-var-m-around_xx-small'
        };
    }

    handleMarginChange(event) {
        if (event && event.detail) {
            const newValue = event.detail.value;
            const valueChangedEvent = new CustomEvent(
                'configuration_editor_input_value_changed', {
                     bubbles: true,
                     cancelable: false,
                     composed: true,
                     detail: {
                         name: 'margins',
                         newValue,
                         newValueDataType: 'String'
                     }
                }
            );
            this.dispatchEvent(valueChangedEvent);
        }
    }

    handleShowPreviewClick(){
        this.showPreview = true;
    }

    handleCloseClick(){
        this.showPreview = false;
    }
    

}