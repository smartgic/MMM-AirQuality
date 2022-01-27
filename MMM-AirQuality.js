/* 
 * Magic Mirror
 * Module: MMM-AirQuality
 *
 * By Smart'Gic
 * MIT Licensed.
 */
Module.register('MMM-AirQuality', {

	result: {
		metrics: 'loading metrics...'
	},

	defaults: {
    abstractApiUrl: 'http://192.168.1.66:8123',
    mycroftApiUrl: 'http://192.168.1.94:8000',
    mycroftApiToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJteWNyb2Z0IiwiZXhwIjoxNjQzMjQzMDM5LCJpYXQiOjE2NDMyNDEyMzksImlzcyI6Im15Y3JvZnQtYXBpIiwic2NvcGUiOiJhY2Nlc3MifQ.Ilz3hVvcv76CRSWjjsEJSaxiyi-xYBf7GkcK8mT5jZY',
    symbol: 'fa fa-wind',
		interval: 15000,
		fadeSpeed: 4*1000,
    sensor: 'mq2',
    speechNotification: true,
    speech: 'alert, high ppm level detected in the air, check for gas leak or smoke!',
    speechLang: 'en-us',
    ledNotification: true,
    ledGpio: 20,
    ledFrequency: 1000,
    ledSpeed: 0.01,
    ledStep: 3,
    ledDuration: 10
	},

	start() {
	  //this.sendSocketNotification('INIT_MQ2', this.config.abstractApiUrl + '/v1/gas/' + this.config.sensor);
    this.sendSocketNotification('INIT_MQ2', this.config)
		this.getMetrics();
		this.scheduleUpdate();
	},

	scheduleUpdate() {
		setInterval(() => {
			this.getMetrics();
		}, this.config.interval);
	},

	getDom() {
		var wrapper = document.createElement('div');
		var metrics = document.createElement('div');
		var symbol = document.createElement('span');
		var text = document.createElement('span');

		if (this.result['alert']) {
      this.sendAlert();
			symbol.classList = 'symbol symbol-alert ' + this.config.symbol;
			metrics.appendChild(symbol);
			text.classList = 'alert';
			text.innerHTML = this.translate('ALERT');
			metrics.appendChild(text);
		} else {
			symbol.classList = 'symbol symbol-good ' + this.config.symbol;
			metrics.appendChild(symbol);
			text.classList = 'good';
			text.innerHTML = this.translate('GOOD');
			metrics.appendChild(text);
		}

		wrapper.appendChild(metrics);
		return wrapper;
	},

  sendAlert() {
    this.sendSocketNotification('ALERT_MQ2')
  },

	getMetrics() {
		this.sendSocketNotification('GET_MQ2');
	},

	socketNotificationReceived(notification, payload) {
		if (notification == 'DATA_MQ2') {
			if (this.result != payload) {
 				this.result = payload;
				this.updateDom(this.config.fadeSpeed);
			}
		}
	},

	getStyles () {
		return ['MMM-AirQuality.css'];
	},

	getTranslations() {
		return {
			en: 'translations/en.json',
			fr: 'translations/fr.json'
		};
	},

});
