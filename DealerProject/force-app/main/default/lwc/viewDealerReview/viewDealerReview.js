import { LightningElement , api, wire } from 'lwc';
import GETDEALERREVIEWCLASS from '@salesforce/apex/delalerReviewController.getDealerReview';

// import message channel - Step 1: LMS
import DEALER_CHANNEL from '@salesforce/messageChannel/DealerAccountDataMessageChannel__c';
// import functions to publish data  - Step 1: LMS
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class ViewDealerReview extends LightningElement {
    // hold data received from publisher 
    dealerAccountId; // = '001J1000002T6JRIA0';

    channelName;
    selectedDealerAccountName;

    dealerReview = null;
    dealer;
    recordIndex = 0;

    subscription; //property to check if  subscription is already don or not
    selectedDealerAccountId;  // = '001J1000002T6JRIA0'; //TODO: Remove hard coding

    
    //Step 2: LMS - After import make a wire call to Message context
    @wire(MessageContext)
    messageContext;

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
        this.dealerAccountId = message.selectedDealerAccountId;
        this.selectedDealerAccountName = message.selectedDealerAccountName;
        this.channelname = message.channelname;
        
    }

    disconnectedCallback(){
        //Step 4: LMS - Unsubscribe to the channel
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    @wire(GETDEALERREVIEWCLASS,{dealerAccountId: '$dealerAccountId'})
    processOutput({data,error}){
        if (data) {
            this.dealerReview = data;
            console.log('dealerReview: '+ this.dealerReview);
            if (this.dealerReviewFound) {
                this.getcurrentdealerReview();
            }
        }
        else if (error) {
            console.log('Error');
        }
    }

    getcurrentdealerReview(){
        this.dealer = this.dealerReview[this.recordIndex];
        console.log('dealer:'+this.dealer);
    }

    navigateNextReview(){
        if(this.recordIndex === this.dealerReview.length -1){
            this.recordIndex = this.dealerReview.length -1;
        }else {
            this.recordIndex++;
        }
        this.getcurrentdealerReview(); 
    }


    navigatepreviousReview(){
        if(this.recordIndex <= 0){
            this.recordIndex = 0;
        }else {
            this.recordIndex--;
        }
        this.getcurrentdealerReview(); 
    }

    get dealerReviewFound(){
        if (this.dealerReview != null && this.dealerReview.length > 0) {
            return true;
        }
           return false;
    }

}