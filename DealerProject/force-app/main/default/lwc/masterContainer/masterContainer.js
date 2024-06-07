import { LightningElement } from 'lwc';

export default class MasterContainer extends LightningElement {
    selecteddealertypeId = '';
    handleselecteddealertypeevent(event){
        this.selecteddealertypeId = event.detail;
        console.log('selected dealer type id is '+this.selecteddealertypeId);
    }
}