public with sharing class dealerSearchResultController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getDealers(String dealerTypeId){
        if(String.isEmpty(dealerTypeId)){
            return [SELECT Id, Name, Dealer_Type__c, Dealer_Type__r.Name, Dealer_Budget__c, Dealer_Total_Sales_Revenue__c, 
            Dealer_active_pipeline_value__c,Dealer_Primary_POC__c, Dealer_Primary_POC__r.Name,Dealer_Primary_POC__r.title, 
            Dealer_Primary_POC__r.Salutation, Dealer_Contract_StartDate__c, Dealer_Contract_EndDate__c, 
            Dealer_Training_Completed__c,Dealer_Status__c, Number_of_trained_Dealer_Contacts__c, Dealer_Website__c, 
            Dealer_GioLocation__Latitude__s, Dealer_GioLocation__Longitude__s, Dealer_GioLocation__c,
            (Select FirstName,LastName,title,Salutation from Contacts) FROM Account WHERE Dealer_Status__c IN 
            ('Active','Inactive','Pending')];
        } else{
            return [SELECT Id, Name, Dealer_Type__c, Dealer_Type__r.Name, Dealer_Budget__c, Dealer_Total_Sales_Revenue__c, 
            Dealer_active_pipeline_value__c, Dealer_Primary_POC__c, Dealer_Primary_POC__r.Name,Dealer_Primary_POC__r.title, 
            Dealer_Primary_POC__r.Salutation,Dealer_Contract_StartDate__c,Dealer_Contract_EndDate__c,
            Dealer_Training_Completed__c,Dealer_Status__c, Number_of_trained_Dealer_Contacts__c, Dealer_Website__c, 
            Dealer_GioLocation__Latitude__s, Dealer_GioLocation__Longitude__s, Dealer_GioLocation__c,
            (Select FirstName,LastName,title,Salutation from Contacts) FROM Account 
            WHERE Dealer_Status__c IN ('Active','Inactive','Pending') AND Dealer_Type__c =: dealerTypeId];
        }
    }
}