/*
 * pubsub.js API unit tests
 *
 * @author Federico "Lox" Lucignano
 * <https://plus.google.com/117046182016070432246>
 */

/*global describe, it, expect, afterEach, PubSub*/
describe("API", function () {
	'use strict';

	describe("Subscribing to a channel", function () {
		var a = function () {};

		it("Shouldn't fail if channel doesn't exist", function () {
			expect(function () {
				PubSub.subscribe('/test/subscribing/1', a);
			}).not.toThrow();
		});

		it("Should fail if channel not passed", function () {
			expect(function () {
				PubSub.subscribe(undefined, a);
			}).toThrow();
		});

		it("Should fail if callback not passed", function () {
			expect(function () {
				PubSub.subscribe('/test/subscribing/2');
			}).toThrow();
		});

		it("Should return a valid handle", function () {
			var c = "/test/subscribing/3",
				h = PubSub.subscribe(c, a);

			expect(h).toBeDefined();
			expect(h instanceof Object).toEqual(true);
			expect(h.channel).toEqual(c);
			expect(h.callback).toBe(a);
		});
	});

	describe("Publishing a message", function () {
		it("Shouldn't fail if channel doesn't exist", function () {
			expect(function () {
				PubSub.publish("/test/publishing/1", 1);
			}).not.toThrow();
		});

		it("Shouldn't fail if data not passed", function () {
			expect(function () {
				PubSub.publish("/test/publishing/2");
			}).not.toThrow();
		});

		it("Should run the registered callback", function () {
			var check,
				c = "/test/publishing/3",
				a = function (val) {
					check = val;
				};

			PubSub.subscribe(c, a);
			PubSub.publish(c, 1);
			expect(check).toEqual(1);
		});

		it("Should support any type and number of data arguments", function () {
			var argCount,
				c = "/test/publishing/4",
				a = function () {
					argCount = arguments.length;
				};

			PubSub.subscribe(c, a);

			PubSub.publish(c, 1, "2", [3]);
			expect(argCount).toEqual(3);

			PubSub.publish(c, {type: "test"});
			expect(argCount).toEqual(1);
		});
	});

	describe("Subscribing wildcards", function() {
		it("shouldn't fail if the channel * doesn't exist", function() {
			expect(function() {
				PubSub.subscribe("*", function(msg){return msg;});
			}).not.toThrow();
		});
	});

	describe("Publishing wildcards", function() {
		it("Shouldn't fail if the channel [/test/*] doesn't exist", function() {
			expect(function() {
				PubSub.publish("/test/*");
			}).not.toThrow();
		});
		it("Shouldn't fail if the channel [/*] doesn't exist", function() {
			expect(function() {
				PubSub.publish("/*");
			}).not.toThrow();
		});
		it("Shouldn't fail if the channel [*] doesn't exist", function() {
			expect(function() {
				PubSub.publish("*");
			}).not.toThrow();
		});
		it("Shouldn't fail if the channel [test.*] doesn't exist", function() {
			expect(function() {
				PubSub.publish("test.*");
			}).not.toThrow();
		});

		it(`Only subscription #4 [...,"/hover/body/reviewStars/"] will match
			p=/hover/*`, () => {
			var check = 0,
				s1 = "/click/header/publishing/",
				s2 = "/click/footer/socialTag/",
				s3 = "/click/body/reviewStars/",
				s4= "/hover/body/reviewStars/",
				s5= "/bad/hover/body/reviewStars/",
				s6= "bad/hover/body/reviewStars/",
				s7= "bad/hover/body/reviewStars/",
				s8= "bad/hover/",
				s9= "bad/hover",
				s10= "/bad/hover",
				s11= "/bad/*/hover",
				s12= "*/bad/*/hover",
				s13= "*//bad/*/hover",
				p = "/hover/*",
				a = function () {
					check+=1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.subscribe(s6, a);
			PubSub.subscribe(s7, a);
			PubSub.subscribe(s8, a);
			PubSub.subscribe(s9, a);
			PubSub.subscribe(s10, a);
			PubSub.subscribe(s11, a);
			PubSub.subscribe(s12, a);
			PubSub.subscribe(s13, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(1);
		});

		it(`Only subscription #4 [...,"hover.body.reviewStars"] will match
			p=hover.*`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "click.footer.socialTag",
				s3 = "click.body.reviewStars",
				s4 = "hover.body.reviewStars",
				s5 = "bad.hover.body.reviewStars",
				s6 = "bad.hover.body.reviewStars",
				s7 = "bad.hover.body.reviewStars",
				s8 = "bad.hover",
				s9 = "bad.hover",
				s10 = "bad.hover",
				s11 = "bad.*.hover",
				s12 = "*.bad.*.hover",
				s13 = "*..bad.*.hover",
				p = "hover.*",
				a = function () {
					check+=1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.subscribe(s6, a);
			PubSub.subscribe(s7, a);
			PubSub.subscribe(s8, a);
			PubSub.subscribe(s9, a);
			PubSub.subscribe(s10, a);
			PubSub.subscribe(s11, a);
			PubSub.subscribe(s12, a);
			PubSub.subscribe(s13, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(1);
		});


		it(`No subscriptions will match p=/hover/*`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "click.footer.socialTag",
				s3 = "click.body.reviewStars",
				s4 = "hover.body.reviewStars",
				s4 = "hovers.body.reviewStars",
				s5 = "bad.hover.body.reviewStars",
				s6 = "bad.hover.body.reviewStars",
				s7 = "bad.hover.body.reviewStars",
				s8 = "bad.hover",
				s9 = "bad.hover",
				s10 = "bad.hover",
				s11 = "bad.*.hover",
				s12 = "*.bad.*.hover",
				s13 = "*..bad.*.hover",
				p = "hover*",
				a = function () {
					check+=1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.subscribe(s6, a);
			PubSub.subscribe(s7, a);
			PubSub.subscribe(s8, a);
			PubSub.subscribe(s9, a);
			PubSub.subscribe(s10, a);
			PubSub.subscribe(s11, a);
			PubSub.subscribe(s12, a);
			PubSub.subscribe(s13, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(1);
		});


		it(`1 subscription will match p=hover*`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "click.footer.socialTag",
				s3 = "click.body.reviewStars",
				s4 = "huver.body.reviewStars",
				s5 = "hover.body.reviewStars",
				s6 = "bad.hover.body.reviewStars",
				s7 = "bad.hover.body.reviewStars",
				s8 = "bad.hover.body.reviewStars",
				s9 = "bad.hover",
				s10 = "bad.hover",
				s11 = "bad.hover",
				s12 = "bad.*.hover",
				s13 = "*.bad.*.hover",
				s14 = "*..bad.*.hover",
				p = "hover*",
				a = function () {
					check+=1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.subscribe(s6, a);
			PubSub.subscribe(s7, a);
			PubSub.subscribe(s8, a);
			PubSub.subscribe(s9, a);
			PubSub.subscribe(s10, a);
			PubSub.subscribe(s11, a);
			PubSub.subscribe(s12, a);
			PubSub.subscribe(s13, a);
			PubSub.subscribe(s14, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(1);
		});


		it(`No subscriptions will match p=hover*`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "click.footer.socialTag",
				s3 = "click.body.reviewStars",
				s4 = "huver.body.reviewStars",
				s5 = "shover.body.reviewStars",
				s6 = "shover.body.reviewStars",
				s7 = "bad.hover.body.reviewStars",
				s8 = "bad.hover.body.reviewStars",
				s9 = "bad.hover.body.reviewStars",
				s10 = "bad.hover",
				s11 = "bad.hover",
				s12 = "bad.hover",
				s13 = "bad.*.hover",
				s14 = "*.bad.*.hover",
				s15 = "*..bad.*.hover",
				p = "hover*",
				a = function () {
					check+=1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.subscribe(s6, a);
			PubSub.subscribe(s7, a);
			PubSub.subscribe(s8, a);
			PubSub.subscribe(s9, a);
			PubSub.subscribe(s10, a);
			PubSub.subscribe(s11, a);
			PubSub.subscribe(s12, a);
			PubSub.subscribe(s13, a);
			PubSub.subscribe(s14, a);
			PubSub.subscribe(s15, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(0);
		});


		it(`6 subscriptions will match *.hover`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "click.footer.socialTag",
				s3 = "click.body.reviewStars",
				s4 = "huver.body.reviewStars",
				s5 = "shover.body.reviewStars",
				s6 = "shover.body.reviewStars",
				s7 = "bad.hover.body.reviewStars",
				s8 = "bad.hover.body.reviewStars",
				s9 = "bad.hover.body.reviewStars",
				s10 = "bad.hover",
				s11 = "bad.hover",
				s12 = "bad.hover",
				s13 = "bad.*.hover",
				s14 = "*.bad.*.hover",
				s15 = "*..bad.*.hover",
				p = "*.hover",
				a = function () {
					check+=1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.subscribe(s6, a);
			PubSub.subscribe(s7, a);
			PubSub.subscribe(s8, a);
			PubSub.subscribe(s9, a);
			PubSub.subscribe(s10, a);
			PubSub.subscribe(s11, a);
			PubSub.subscribe(s12, a);
			PubSub.subscribe(s13, a);
			PubSub.subscribe(s14, a);
			PubSub.subscribe(s15, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(6);
		});


		it(`4 subscriptions will match *.hover`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "nav.click.dresses",
				s3 = "nav.click.tops",
				s4 = "nav.click.bottoms",
				s5 = "nav.click.accessories",
				p = "*nav.click.*",
				a = function () {
					check += 1;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.publish(p, 1);
			expect(check).toEqual(4);
		});


		it(`4 subscriptions will match *.hover
			and two args will be passed back.
			One is for validation two is for incrementation.`, () => {
			var check = 0,
				s1 = "click.header.publishing",
				s2 = "nav.click.dresses",
				s3 = "nav.click.tops",
				s4 = "nav.click.bottoms",
				s5 = "nav.click.accessories",
				p = "*nav.click.*",
				a = function (msg, int) {
					(msg === 'hi there')
						? check += int
						: false;
				};

			PubSub.subscribe(s1, a);
			PubSub.subscribe(s2, a);
			PubSub.subscribe(s3, a);
			PubSub.subscribe(s4, a);
			PubSub.subscribe(s5, a);
			PubSub.publish(p, 'hi there', 1);
			expect(check).toEqual(4);
		});
		/*
		 * number: 1,
		 subs: [
		 '/click/header/logo',
		 '/click/header/dress',
		 '/click/header/dress/red'
		 ],
		 pubs: '/click/header/*',
		 callback: function callback_subscriptionTracker(msg) {
		 counter++;
		 //console.log(msg);
		 },
		 emissions: 3,
		 tearDown: [
		 '/click/header/logo',
		 '/click/header/dress',
		 '/click/header/dress/red'
		 ]
		 * */
		//it();
		//it();
		//it();
	});

	describe("Unsubscribing from a channel", function () {
		var invoked = false,
			a = function () {
				invoked = true;
			};

		afterEach(function () {
			invoked = false;
		});

		it("Should fail if channel not passed", function () {
			expect(function () {
				PubSub.unsubscribe(undefined, a);
			}).toThrow();
		});

		it("Should fail if callback not passed", function () {
			expect(function () {
				PubSub.unsubscribe("/test/unsubscribe/1");
			}).toThrow();
		});

		it("Should fail if not valid handle", function () {
			expect(function () {
				PubSub.unsubscribe(5, a);
			}).toThrow();

			expect(function () {
				PubSub.unsubscribe([5, a]);
			}).toThrow();

			expect(function () {
				PubSub.unsubscribe([a]);
			}).toThrow();
		});

		it("Should fail if not valid callback", function () {
			expect(function () {
				PubSub.unsubscribe("/test/unsubscribe/2", {});
			}).toThrow();
		});

		it("Shouldn't' fail if channel doesn't exists", function () {
			expect(function () {
				PubSub.unsubscribe("/test/unsubscribe/3", a);
			}).not.toThrow();
		});

		it("Shouldn't' fail when passing a valid handle", function () {
			expect(function () {
				PubSub.unsubscribe(
					PubSub.subscribe("/test/unsubscribe/4", a),
					a
				);
			}).not.toThrow();
		});

		it("Shouldn't run an unsubscribed handler", function () {
			var c = "/test/unsubscribe/5",
				x = PubSub.subscribe(c, a);


			PubSub.publish(c);
			expect(invoked).toEqual(true);

			invoked = false;
			PubSub.unsubscribe(x);
			PubSub.publish(c);
			expect(invoked).toEqual(false);

			x = PubSub.subscribe(c, a);
			PubSub.publish(c);
			expect(invoked).toEqual(true);

			invoked = false;
			PubSub.unsubscribe(c, a);
			PubSub.publish(c);
			expect(invoked).toEqual(false);
		});
	});
});