Drupal.Tealium = (function(){
  var instance;

  function Tealium() {
    var utagData,
        utag,
        mapping = Drupal.settings.tealiumFxBankTypeMap,
        changedContainers = {};

    this.setUtagData = function(data) {
      utagData = data
      return this;
    };

    this.setUtag = function(prmUtag) {
      if (typeof prmUtag != 'undefined') {
        utag = prmUtag;
      }
      return this;
    };

    this.triggerUpdate = function(container, object) {
      var method = 'update' + container.charAt(0).toUpperCase() + container.slice(1).replace(/_([a-z])/g, function (g) { return g[1].toUpperCase();})

      if (typeof this[method] == 'undefined') {
        return false;
      }

      this[method](object);

      this.link();

      return true;
    };

    this.updateProduct = function(object) {
      setProperties(Drupal.Tealium.CONTAINER_PRODUCT, object);
      return this;
    };

    this.updateCustomerProfile = function(object) {
      setProperties(Drupal.Tealium.CONTAINER_CUSTOMER_PROFILE, object);
      return this;
    }

    this.updateErrorMessage = function(object) {
      setProperties(Drupal.Tealium.CONTAINER_ERROR_MESSAGE, object);
      return this;
    }

    this.updateEvent = function(object) {
      setProperties(Drupal.Tealium.CONTAINER_EVENT, object);
      return this;
    }

    this.link = function(all) {
      var data = jQuery.extend({}, utagData);
      all = isBoolean(all) ? all : false;

      if (!all) {
        for (var prop in data) {
          if (prop.indexOf('page_') == -1 && !isChangedContainer(prop)) {
            delete data[prop];
          }
        }
      }
      changedContainers = {};
      utag.link(data);
    };

    function isChangedContainer(property) {
      for (var container in changedContainers) {
        if(property.indexOf(container) != -1) {
          return true;
        }
      }

      return false;
    }

    function isBoolean(obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    }

    function setProperties(container, data) {
      changedContainers[container] = true;
      for(var attr in data) {
          var poperty = getPropertyString(container, attr);
          setProperty(poperty, data[attr]);
       }
    }

    function setProperty(poperty, value) {
      switch (poperty) {

        case 'product_id':
          value = fxBankProductId(value);
          setProperties(Drupal.Tealium.CONTAINER_PRODUCT, {
            name: value
          });

          setProperties(Drupal.Tealium.CONTAINER_EVENT, {
            id: value,
            date: getDate()
          });
          break;

        case 'customer_profile_email':
        case 'customer_profile_phone':
          setProperties(Drupal.Tealium.CONTAINER_CUSTOMER_PROFILE, {
            last_update_date: getDate()
          });
          break;

        default :
          break
      }

      utagData[poperty] = value;
    }

    function isPropertyExist(property) {
      return utagData.hasOwnProperty(property);
    }

    function getPropertyString(container, property) {
      return container + '_' + property;
    }

    function fxBankProductId(id) {
      if (mapping.hasOwnProperty(id)) {
        return mapping[id];
      }

      return id;
    }

    function getDate() {
      var now     = new Date(),
          year    = now.getUTCFullYear(),
          month   = ('0' + (now.getUTCMonth() + 1)).slice(-2),
          day     = ('0' + now.getUTCDate()).slice(-2),
          hours   = ('0' + now.getUTCHours()).slice(-2),
          minutes = ('0' + now.getUTCMinutes()).slice(-2);

      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
    }
  }

  function createInstance() {
    var object = new Tealium();
    return object;
  }

  return {
    CONTAINER_LOGIN_STATUS_CHANGE : 'login_status_change',
    CONTAINER_CUSTOMER_PROFILE : 'customer_profile',
    CONTAINER_ERROR_MESSAGE : 'error_message',
    CONTAINER_PRODUCT : 'product',
    CONTAINER_EVENT : 'event',
    CONTAINER_PAGE : 'page',

    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();