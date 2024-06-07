import { LightningElement,wire,api } from 'lwc';
import fetchDealerType from '@salesforce/apex/dealerSearchResultController.getDealers';

export default class DealerSearchResult extends LightningElement {
    // accountData = {
    //     Id: '0x111',
    //     userImg: '',
    //     companyName: ''
        
    // };
    //public property that recieve selected dealer type Id
    @api channelDealerTypeId;

    // property to hold selected Dealer account Id received from child component (Dealer Card)
    selectedDealerCardAccountId;

    dealerDataFromDB; //local property to hold all dealer from DB
    //make a call to apex method
    @wire(fetchDealerType,{dealerTypeId: '$channelDealerTypeId'})
    processOutput({data,error}) //use {data,error} default system properties from result
    {
        if (data) {
            console.log('Data from Database :: '+JSON.stringify(data));
            this.dealerDataFromDB = data;  //copy data 
        }else if (error) {
            console.log('Error');
        }
    }

    get IsDealerfound(){
        if (this.dealerDataFromDB != null && this.dealerDataFromDB.length > 0) {
            return true;
        }
        return false;
    }

    selectedDealerHandler(event){
        const dealerId = event.detail;
        this.selectedDealerCardAccountId = dealerId;
        console.log('selected dealer Id : ' + this.selectedDealerCardAccountId);
    }
}