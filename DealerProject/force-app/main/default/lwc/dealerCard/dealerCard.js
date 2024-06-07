import { LightningElement, api, wire } from 'lwc';
// import message channel - Step 1: LMS
import DEALER_CHANNEL from '@salesforce/messageChannel/DealerAccountDataMessageChannel__c';
// import functions to publish data  - Step 1: LMS
import { publish, MessageContext } from 'lightning/messageService';

export default class DealerCard extends LightningElement {

    @api dealerAccount; //public property to receive data from dealersearch result
    @api selectedDealerAccountId;

    channelDealerStyle = 'slds-theme_success';   //property to hold class for dealer type
    userImg = 'https://www.lightningdesignsystem.com/assets/images/avatar2.jpg'; //property to hold user image url
    //dealerCardStyle; 

    //Step 2: LMS - After import make a wire call to Message context
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        //call to getDealertypeStyle function
        this.getDealertypeStyle(this.dealerAccount.Dealer_Type__r.Name);
        this.getUserImage(this.dealerAccount.Dealer_Primary_POC__r.Salutation);
    }
    getDealertypeStyle(dealerType) {
        switch (dealerType) {
            default:
                this.channelDealerStyle = 'slds-theme_success';
                break;
        }
    }
    getUserImage(saluation) {
        const randomId = Math.floor(Math.random() * 100);
        switch (saluation) {
            case 'Mr.':
                this.userImg = `https://randomuser.me/api/portraits/thumb/men/${randomId}.jpg`;
                break;
            case 'Ms.':
                this.userImg = `https://randomuser.me/api/portraits/thumb/women/${randomId}.jpg`;
                break;
            default:
                this.userImg = `https://www.lightningdesignsystem.com/assets/images/avatar2.jpg`;
                break;
        }

    }
    handleSelectedDealerAccount(event){
        const dealerAccountId = this.dealerAccount.Id;

        const dealerAccountSelect = new CustomEvent('dealerselect' , { detail: dealerAccountId  });
                this.dispatchEvent(dealerAccountSelect);

        //Step 3: LMS - publish
        // publish selected partner account id and other details
        // define the message to be published

        const msgToPublish = {
            selectedDealerAccountId: this.dealerAccount.Id,
            channelname: "Dealer Account",
            selectedDealerAccountName: this.dealerAccount.Name
        }
        // publish
        publish(this.messageContext, DEALER_CHANNEL,msgToPublish);        

    }
    
    get dealerCardStyle(){
        if (this.dealerAccount.Id === this.selectedDealerAccountId) {
            return "tile selected";
        }
        return "tile";
    }
}