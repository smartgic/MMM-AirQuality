/* 
 * Magic Mirror
 * Module: MMM-AirQuality
 *
 * By Smart'Gic
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
const fetch = require('node-fetch');

module.exports = NodeHelper.create({

  userAgent: 'MMM-AirQuality',

	start() {
		console.log('MMM-AirQuality helper started');
	},

	getMetrics() {
		const parent = this;
    const mq2Url = this.config.abstractApiUrl + '/v1/gas/' + this.config.sensor
		fetch(mq2Url, {
			headers: {'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': this.userAgent}
		})
			.then(res => res.json())
			.then(json => parent.sendSocketNotification('DATA_MQ2', json));
	},

  sendAlert() {
    let led = {
      gpio: this.config.ledGpio,
      frequency: this.config.ledFrequency,
      speed: this.config.ledSpeed,
      step: this.config.ledStep,
      duration: this.config.ledDuration
    };

    let speech = {
      utterance: this.config.speech,
      lang: this.config.speechLang
    };

    const ledUrl = this.config.abstractApiUrl + '/v1/leds/led'
		fetch(ledUrl, {
      method: 'POST',
      body: JSON.stringify(led),
			headers: {'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': this.userAgent}
		});

    const speechUrl = this.config.mycroftApiUrl + '/v1/voice/speech'
		fetch(speechUrl, {
      method: 'POST',
      body: JSON.stringify(speech),
			headers: {'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': this.userAgent,
                'Authorization': 'Bearer ' + this.config.mycroftApiToken}
		});
  },

	socketNotificationReceived(notification, payload) {
		if (notification == 'GET_MQ2') {
			this.getMetrics();
		} else if (notification == 'INIT_MQ2') {
    	this.config = payload;
    } else if (notification == 'ALERT_MQ2') {
      this.sendAlert();
    }
	}
});
