public with sharing class delalerReviewController {
    @AuraEnabled(cacheable=true)
    public static List<Dealer_Performance_Review__c> getDealerReview(String dealerAccountId){
        try {
            return [select Id, Name, CreatedById, CreatedBy.Name,CreatedBy.email, Overall_Feedback__c, 
            Dealer_Overall_Rating__c, Dealer_Account__c,Dealer_Account__r.Name, Dealer_Business_Planning__c, 
            Dealer_Implementation_Description__c, Dealer_Quality__c FROM Dealer_Performance_Review__c 
            Where Dealer_Account__c =: dealerAccountId];

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}