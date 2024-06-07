import { LightningElement,api,wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import LEAFLET from '@salesforce/resourceUrl/Leaflet_File';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class DealerContactLocation extends LightningElement {

    // public property to receive Dealer account Id from Dealer component (Dealer Detail)
    @api dealerAccountId; //TODO: Remove hard coding

    // property to hold location coordinates
    latitude;
    longitude;

    leafletMap;

     // get lat and long values from DB using get Record
     @wire(getRecord, {recordId: '$dealerAccountId', fields: ['Account.Dealer_GioLocation__Latitude__s','Account.Dealer_GioLocation__Longitude__s']})
     processOutput({data,error}){
        if (data) {
            // Read values from field and assign to a local property
            this.latitude = data.fields.Dealer_GioLocation__Latitude__s.value;
            this.longitude = data.fields.Dealer_GioLocation__Longitude__s.value;

            console.log('lat:' + data.fields.Dealer_GioLocation__Latitude__s.value);
            console.log('longt:' + data.fields.Dealer_GioLocation__Longitude__s.value);
        }else if (error) {
            console.log('Error');
        }
     }

    connectedCallback(){
        Promise.all([
            loadStyle(this, LEAFLET + '/leaflet.css'),
            loadScript(this, LEAFLET + '/leaflet.js'),
        ]).then(() => {
            this.plotMap();
        });
    }
    plotMap(){
        // find the div where we wanted to plot the map
        const map = this.template.querySelector('.map');
        if(map){
            this.leafletMap = L.map(map, {zoomControl : true} ).setView([this.latitude, this.longitude], 13);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution : 'Dealer POC Location'}).addTo(this.leafletMap);
        }

        //const location = [51.505, -0.09];
        const location = [this.latitude, this.longitude];

        const leafletMarker = L.marker(location);
        leafletMarker.addTo(this.leafletMap);
        this.leafletMap.setView(location);
    }
}