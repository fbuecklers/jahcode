require('../jahcode.js');

describe("Class declaration", function() {
    var myClass = Object.inherit({
        initialize : function(a, b, c) {
            this.called = true;
            this.params = [a, b, c];
        }
    });

    it("should call the initialize method at instantiation", function() {
        var obj = new myClass(1, 2, 3);
        expect(obj.params).toEqual([1, 2, 3]);
    });

    it("should add static members", function() {
        var myExtClass = myClass.inherit({
            extend : {
                create : function() {
                    return new this(1, 2, 3);
                },
                getInstance : function() {
                    return this.create();
                }
            }
        });

        expect(myExtClass.create()).isInstanceOf(myExtClass);
        expect(myExtClass.getInstance()).isInstanceOf(myExtClass);
    });

    it("should call the static initialize method", function() {
        var myExtClass = myClass.inherit({
            extend : {
                initialize : function() {
                    this.called = true;
                }
            }
        });

        expect(myExtClass.called).toBeTruthy();
    });

    describe("with extending a class", function() {
        it("should call both initialize methods at instantiation", function() {
            var myExtClass = myClass.inherit({
                initialize : function(a, b, c, d, e) {
                    this.superCall(a, b, c);
                    this.params.push(d, e);
                }
            });

            var obj = new myExtClass(1, 2, 3, 4, 5);
            expect(obj.params).toEqual([1, 2, 3, 4, 5]);
        });

        it("should call the implicit initialize method at instantiation", function() {
            var myExtClass = myClass.inherit({
            // no explicit super call
            });

            var obj = new myExtClass();
            expect(obj.called).toBeTruthy();
        });

        it("should call the super initialize method at instantiation", function() {
            var myExtClass = myClass.inherit({
                initialize : function() {
                    this.extCalled = true;
                }
            });

            var obj = new myExtClass();
            expect(obj.called).toBeTruthy();
            expect(obj.extCalled).toBeTruthy();
        });

        it("should call the super and super.super constructor at instantiation", function() {
            var myExtClass = myClass.inherit({
                initialize : function() {
                    this.extCalled = true;
                }
            });

            var myExtExtClass = myExtClass.inherit({
                initialize : function() {
                    this.superCall();

                    this.extExtCalled = true;
                }
            });

            var obj = new myExtExtClass();
            expect(obj.called).toBeTruthy();
            expect(obj.extCalled).toBeTruthy();
            expect(obj.extExtCalled).toBeTruthy();
        });
    });
});
