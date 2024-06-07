public with sharing class DealerSearchClass {
    @AuraEnabled(cacheable=true)
    public static List<Dealer_Type__c> getAllDealerTypes(){
        try {
            return [Select Id,Name From Dealer_Type__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}