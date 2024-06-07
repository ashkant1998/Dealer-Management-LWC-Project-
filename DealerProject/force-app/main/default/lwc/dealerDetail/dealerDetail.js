import { LightningElement,wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_CONTRACT_START from '@salesforce/schema/Account.Dealer_Contract_StartDate__c';

import DEALER_PRIMARY_POC_FIELD from '@salesforce/schema/Account.Dealer_Type__c';
import DEALER_Budget__c_FIELD from '@salesforce/schema/Account.Dealer_Budget__c';
import DEALER_Total_Sales_Revenue_FIELD from '@salesforce/schema/Account.Dealer_Total_Sales_Revenue__c';
import DEALER_Active_Pipeline_Value_FIELD from '@salesforce/schema/Account.Dealer_active_pipeline_value__c';
import DEALER_Contract_End_Date__c_FIELD from '@salesforce/schema/Account.Dealer_Contract_EndDate__c';
import Number_of_trained_Dealer_contacts__c_FIELD from '@salesforce/schema/Account.Number_of_trained_Dealer_Contacts__c';

import Dealer_Latitude_FIELD from '@salesforce/schema/Account.Dealer_GioLocation__Latitude__s';
import Dealer_Longitude_FIELD from '@salesforce/schema/Account.Dealer_GioLocation__Longitude__s';

// import message channel - Step 1: LMS
import DEALER_CHANNEL from '@salesforce/messageChannel/DealerAccountDataMessageChannel__c';
// import functions to publish data  - Step 1: LMS
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class DealerDetail extends NavigationMixin(LightningElement) {

    objectApi = 'Account';
    selectedDealerAccountId;  // = '001J1000002T6JRIA0'; //TODO: Remove hard coding

    channelName;
    selectedDealerAccountName;

    showLocation = false;

    subscription; //property to check if  subscription is already don or not

    //Step 2: LMS - After import make a wire call to Message context
    @wire(MessageContext)
    messageContext;

    // Expose property and map fields
    // Bind the property in the template
    accountName = ACCOUNT_NAME;
    accContractStartDate = ACCOUNT_CONTRACT_START;
    primarypoc = DEALER_PRIMARY_POC_FIELD;
    budget = DEALER_Budget__c_FIELD;
    salesRevenue = DEALER_Total_Sales_Revenue_FIELD;
    activepipeline = DEALER_Active_Pipeline_Value_FIELD;
    contractEnd = DEALER_Contract_End_Date__c_FIELD;
    totalTrained = Number_of_trained_Dealer_contacts__c_FIELD;
    partnerLongitude = Dealer_Longitude_FIELD;
    partnerLatitude = Dealer_Latitude_FIELD;

    connectedCallback(){
        //Step 3: LMS - subscribe to the channel
        //check if subscription already exists
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, DEALER_CHANNEL, (message) => {
            this.processMessage(message);
        });
    }
    // call back function to unpack data received from the publisher
    processMessage(message){
        // unpack data
        this.selectedDealerAccountId = message.selectedDealerAccountId;
        this.selectedDealerAccountName = message.selectedDealerAccountName;
        this.channelname = message.channelname;
        
    }

    disconnectedCallback(){
        //Step 4: LMS - Unsubscribe to the channel
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    get IsDealerSelected(){
        if(this.selectedDealerAccountId != null && this.selectedDealerAccountId.length > 0){
            return true;
        }
        return false;
    }

    onDealerReviewScreenFlow(){
        // use navigation mixin and redirect user to flow screen
        const flowURL = '/flow/Rate_Dealer_Performance?Dealer_Account_Id=' + this.selectedDealerAccountId;

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url:'/flow/Rate_Dealer_Performance?Dealer_Account_Id=' + this.selectedDealerAccountId
            },
        });
    }

    openContactLocation(){
        this.showLocation = true;
    }
}