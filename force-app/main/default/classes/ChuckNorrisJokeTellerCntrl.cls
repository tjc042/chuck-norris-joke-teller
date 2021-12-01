public with sharing class ChuckNorrisJokeTellerCntrl {

    @AuraEnabled
    public static string getCategories(){
        try {
            
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://api.chucknorris.io/jokes/categories');
            request.setMethod('GET');
            request.setHeader('content-type','application/json');

            return new Http().send(request).getBody();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    } 

    @AuraEnabled
    public static string getJoke(string category){
        try {
            
            return category == null ? getRandomCategory() : getSpecificCategory(category);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static string getRandomCategory(){

        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://api.chucknorris.io/jokes/random');
        request.setMethod('GET');
        request.setHeader('content-type','application/json');

        return new Http().send(request).getBody();

    }

    public static string getSpecificCategory(string category){

        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://api.chucknorris.io/jokes/random?category=' + category);
        request.setMethod('GET');
        request.setHeader('content-type','application/json');

        return new Http().send(request).getBody();

    }

}
