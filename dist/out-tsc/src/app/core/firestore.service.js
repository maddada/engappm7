"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var firestore_1 = require("angularfire2/firestore");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var firebase = require("firebase/app");
var FirestoreService = /** @class */ (function () {
    function FirestoreService(afs) {
        this.afs = afs;
    }
    /// **************
    /// Get a Reference
    /// **************
    FirestoreService.prototype.col = function (ref, queryFn) {
        return typeof ref === 'string' ? this.afs.collection(ref, queryFn) : ref;
    };
    FirestoreService.prototype.doc = function (ref) {
        return typeof ref === 'string' ? this.afs.doc(ref) : ref;
    };
    /// **************
    /// Get Data
    /// **************
    FirestoreService.prototype.doc$ = function (ref) {
        return this.doc(ref)
            .snapshotChanges()
            .pipe(operators_1.map(function (doc) {
            return doc.payload.data();
        }));
    };
    FirestoreService.prototype.col$ = function (ref, queryFn) {
        return this.col(ref, queryFn)
            .snapshotChanges()
            .pipe(operators_1.map(function (docs) {
            return docs.map(function (a) { return a.payload.doc.data(); });
        }));
    };
    /// with Ids
    FirestoreService.prototype.colWithIds$ = function (ref, queryFn) {
        return this.col(ref, queryFn)
            .snapshotChanges()
            .pipe(operators_1.map(function (actions) {
            return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                return __assign({ id: id }, data);
            });
        }));
    };
    Object.defineProperty(FirestoreService.prototype, "timestamp", {
        /// **************
        /// Write Data
        /// **************
        /// Firebase Server Timestamp
        get: function () {
            return firebase.firestore.FieldValue.serverTimestamp();
        },
        enumerable: true,
        configurable: true
    });
    FirestoreService.prototype.set = function (ref, data) {
        var timestamp = this.timestamp;
        return this.doc(ref).set(__assign({}, data, { updatedAt: timestamp, createdAt: timestamp }));
    };
    FirestoreService.prototype.update = function (ref, data) {
        return this.doc(ref).update(__assign({}, data, { updatedAt: this.timestamp }));
    };
    FirestoreService.prototype.delete = function (ref) {
        return this.doc(ref).delete();
    };
    FirestoreService.prototype.add = function (ref, data) {
        var timestamp = this.timestamp;
        return this.col(ref).add(__assign({}, data, { updatedAt: timestamp, createdAt: timestamp }));
    };
    FirestoreService.prototype.geopoint = function (lat, lng) {
        return new firebase.firestore.GeoPoint(lat, lng);
    };
    /// If doc exists update, otherwise set
    FirestoreService.prototype.upsert = function (ref, data) {
        var _this = this;
        var doc = this.doc(ref)
            .snapshotChanges()
            .pipe(operators_1.take(1))
            .toPromise();
        return doc.then(function (snap) {
            return snap.payload.exists ? _this.update(ref, data) : _this.set(ref, data);
        });
    };
    /// **************
    /// Inspect Data
    /// **************
    FirestoreService.prototype.inspectDoc = function (ref) {
        var tick = new Date().getTime();
        this.doc(ref)
            .snapshotChanges()
            .pipe(operators_1.take(1), operators_1.tap(function (d) {
            var tock = new Date().getTime() - tick;
            console.log("Loaded Document in " + tock + "ms", d);
        }))
            .subscribe();
    };
    FirestoreService.prototype.inspectCol = function (ref) {
        var tick = new Date().getTime();
        this.col(ref)
            .snapshotChanges()
            .pipe(operators_1.take(1), operators_1.tap(function (c) {
            var tock = new Date().getTime() - tick;
            console.log("Loaded Collection in " + tock + "ms", c);
        }))
            .subscribe();
    };
    /// **************
    /// Create and read doc references
    /// **************
    /// create a reference between two documents
    FirestoreService.prototype.connect = function (host, key, doc) {
        return this.doc(host).update((_a = {}, _a[key] = this.doc(doc).ref, _a));
        var _a;
    };
    /// returns a documents references mapped to AngularFirestoreDocument
    FirestoreService.prototype.docWithRefs$ = function (ref) {
        var _this = this;
        return this.doc$(ref).pipe(operators_1.map(function (doc) {
            for (var _i = 0, _a = Object.keys(doc); _i < _a.length; _i++) {
                var k = _a[_i];
                if (doc[k] instanceof firebase.firestore.DocumentReference) {
                    doc[k] = _this.doc(doc[k].path);
                }
            }
            return doc;
        }));
    };
    /// **************
    /// Atomic batch example
    /// **************
    /// Just an example, you will need to customize this method.
    FirestoreService.prototype.atomic = function () {
        var batch = firebase.firestore().batch();
        /// add your operations here
        var itemDoc = firebase.firestore().doc('items/myCoolItem');
        var userDoc = firebase.firestore().doc('users/userId');
        var currentTime = this.timestamp;
        batch.update(itemDoc, { timestamp: currentTime });
        batch.update(userDoc, { timestamp: currentTime });
        /// commit operations
        return batch.commit();
    };
    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     * from: https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts
     */
    FirestoreService.prototype.deleteCollection = function (path, batchSize) {
        var _this = this;
        var source = this.deleteBatch(path, batchSize);
        // expand will call deleteBatch recursively until the collection is deleted
        return source.pipe(operators_1.expand(function (val) { return _this.deleteBatch(path, batchSize); }), operators_1.takeWhile(function (val) { return val > 0; }));
    };
    // Detetes documents as batched transaction
    FirestoreService.prototype.deleteBatch = function (path, batchSize) {
        var _this = this;
        var colRef = this.afs.collection(path, function (ref) { return ref.orderBy('__name__').limit(batchSize); });
        return colRef.snapshotChanges().pipe(operators_1.take(1), operators_1.mergeMap(function (snapshot) {
            // Delete documents in a batch
            var batch = _this.afs.firestore.batch();
            snapshot.forEach(function (doc) {
                batch.delete(doc.payload.doc.ref);
            });
            return rxjs_1.from(batch.commit()).pipe(operators_1.map(function () { return snapshot.length; }));
        }));
    };
    FirestoreService = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [firestore_1.AngularFirestore])
    ], FirestoreService);
    return FirestoreService;
}());
exports.FirestoreService = FirestoreService;
//# sourceMappingURL=firestore.service.js.map