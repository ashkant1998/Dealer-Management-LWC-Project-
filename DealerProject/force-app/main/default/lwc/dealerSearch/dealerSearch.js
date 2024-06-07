import { LightningElement,wire } from 'lwc';
import fetchDealerTypes from '@salesforce/apex/DealerSearchClass.getAllDealerTypes';
import { NavigationMixin } from 'lightning/navigation';

export default class DealerSearch extends NavigationMixin(LightningElement) {
     
    appDecrp = 'To locate the Dealer closest to you, go to state then go to city and reach to your nearest Dealer.';
    
    dealerTypes; //to hold all dealer to bind in combobox

    value = '';

    handleChange(event) {
        this.value = event.detail.value;
        const dealerTypeId = event.detail.value;  //get selected channel dealer Type Id
        //create and dispatch custom event so that selected channel dealer type id send to master container
        const dealerTypeSelectedChangeEvent = new CustomEvent('selecteddealertype', {detail: dealerTypeId});
        this.dispatchEvent(dealerTypeSelectedChangeEvent);
        }

    @wire(fetchDealerTypes)
    processoutput({data,error}){
        if (data) {
            console.log('Before - Dealer Type:- '+JSON.stringify(data));
            this.dealerTypes = [{label:'-- Select Dealer Type --', value: ''}];

            //loop the data and change object keys
            data.forEach(item => {
                const dealerData = {};
                dealerData.label = item.Name;
                dealerData.value = item.Id;

                this.dealerTypes.push(dealerData);
            });
            console.log('After - Dealer Type:- '+JSON.stringify(this.dealerTypes));
        }else if (error) {
            console.log('Error:- '+error.body.message);
        }
    }

    openNewDealerTypeStdPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Dealer_Type__c',
                actionName: 'new'
            },
        });
    }
    openNewAccountStdPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            },
        });
    }
    openNewContactStdPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
        });
    }
}