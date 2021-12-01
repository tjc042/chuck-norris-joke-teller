import { api, LightningElement } from 'lwc';

export default class FormattingExample extends LightningElement {

    @api margins;

    get containerClass(){
        return 'slds-box ' + this.margins;
    }
    
}