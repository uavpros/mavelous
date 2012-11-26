
$(function(){
  window.Mavelous = window.Mavelous || {};

  Mavelous.LeafletView = Backbone.View.extend({
    initialize: function () {

      this.vehicleModel = this.options.vehicle;
      this.vehicleIconModel = this.options.vehicleIcon;;
      this.providerModel = this.options.provider;
      this.initializedposition = false;

      this.tileLayer = this.providerModel.getProvider();
      this.map = new L.Map('map', {
        layers: [this.tileLayer],
        zoomControl: false,
        attributionControl: false
      });

      this.providerModel.bind('change', this.providerChange, this);

      this.vehicleIconModel.bind('change', this.vehicleIconChange, this);

      this.vehicleModel.bind('change', this.panMapToVehicle, this);
      this.vehicleModel.bind('change', this.updateVehicleMarker, this);
      this.vehicleModel.bind('change', this.updateVehiclePath, this);
    },

    providerChange: function () {
      this.map.removeLayer(this.tileLayer);
      this.tileLayer = this.providerModel.getProvider();
      this.map.addLayer(this.tileLayer);
    },

    panMapToVehicle: function () {
      var p = this.vehicleModel.get('position');
      if (!p) return;
      if ( !this.initializedposition ) {
        this.map.setView(p, 16);
        this.initializedposition = true;
      }
    },

    updateVehicleMarker: function () {
      var p = this.vehicleModel.get('position');
      var h = this.vehicleModel.get('heading');
      if (!p || !h) return;
      if (this.vehicleMarker === undefined) {
        this.vehicleMarker = new L.Marker(p,
            { icon: this.vehicleIconModel.getIcon(),
              iconAngle: h });
        this.map.addLayer(this.vehicleMarker);
      } else {
        this.vehicleMarker.setLatLng(p);
        this.vehicleMarker.setIconAngle(h);
      }
    },

    vehicleIconChange: function () {
      var p = this.vehicleModel.get('position');
      var h = this.vehicleModel.get('heading');
      if (!p || !h) return;
      this.map.removeLayer(this.vehicleMarker);
      this.vehicleMarker = new L.Marker(p,
          { icon: this.vehicleIconModel.getIcon(),
            iconAngle: h });
      this.map.addLayer(this.vehicleMarker);
    },

    updateVehiclePath: function () {
      var p = this.vehicleModel.get('position');
      if (!p) return;
      if (this.vehiclePath === undefined) {
        this.vehiclePath = new L.Polyline([p], {color: 'red'});
        this.vehiclePath.addTo(this.map);
      } else {
        this.vehiclePath.addLatLng(p);
      }
    }
  });
});
