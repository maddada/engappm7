import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentChangeAction,
  Action,
  DocumentSnapshotDoesNotExist,
  DocumentSnapshotExists,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, tap, take, switchMap, mergeMap, expand, takeWhile } from 'rxjs/operators';

import * as firebase from 'firebase/app';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(public afs: AngularFirestore) { }


  /************************************************
  * M7 FORK OF ANGULARFIRE.COM FIRESTORE SERVICE *
  ************************************************/



  /*******************
   * GET A REFERENCE *
   *******************/

  /*
  Ex usage:
  const ref: AngularFirestoreCollection<User> = this.db.collection("user");
  */
  private col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  /*
  Ex usage:
  const ref: AngularFirestoreDocument<User> = this.db.document("user/1234");
  */
  private doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }


  /************
   * GET DATA *
   ************/

  /*
  Ex usage:
  const user: Observable<User> = this.db.document$("user/1234");
  */
  public doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
          return doc.payload.data() as T;
        }),
      );
  }

  /*
  Ex usage:
  const users: Observable<User[]> = this.db.collection$("user");
  */
  public col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs: DocumentChangeAction<T>[]) => {
          return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
        }),
      );
  }

  /*
  Ex usage:
  const users: Observable<User[]> = this.db.collectionWithIds$("user");
  */
  /// with Ids
  public colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((actions: DocumentChangeAction<T>[]) => {
          return actions.map((a: DocumentChangeAction<T>) => {
            const data: Object = a.payload.doc.data() as T;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
      );
  }

  /// **************
  /// Write Data
  /// **************

  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  public set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const timestamp = this.timestamp;
    return this.doc(ref).set(data);
  }

  // M7
  public setTS<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  public update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    return this.doc(ref).update(data);
  }

  public updateTS<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp,
    });
  }

  public delete<T>(ref: DocPredicate<T>): Promise<void> {
    return this.doc(ref).delete();
  }

  public add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  public geopoint(lat: number, lng: number): firebase.firestore.GeoPoint {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  /// If doc exists update, otherwise set (without timestamps)
  public upsert<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const doc = this.doc(ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();

    return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    });
  }

  /// If doc exists update, otherwise set (Added timestamps)
  public upsertTS<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const doc = this.doc(ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();

    return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {

      const dataTS = {
        ...data, // ... keeps it at the same level (doesn't add it as a nested object)
        createdAt: this.timestamp,
        updatedAt: this.timestamp,
      };

      return snap.payload.exists ? this.update(ref, dataTS) : this.set(ref, dataTS);
    });
  }

  /// **************
  /// Inspect Data
  /// **************

  public inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();
    this.doc(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((d: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<any>>) => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Document in ${tock}ms`, d);
        }),
      )
      .subscribe();
  }

  public inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    this.col(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((c: DocumentChangeAction<any>[]) => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Collection in ${tock}ms`, c);
        }),
      )
      .subscribe();
  }

  /// **************
  /// Create and read doc references
  /// **************

  /// create a reference between two documents
  public connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref });
  }

  /// returns a documents references mapped to AngularFirestoreDocument
  public docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(
      map((doc: T) => {
        for (const k of Object.keys(doc)) {
          if (doc[k] instanceof firebase.firestore.DocumentReference) {
            doc[k] = this.doc(doc[k].path);
          }
        }
        return doc;
      }),
    );
  }

  /// **************
  /// Atomic batch example
  /// **************

  /// Just an example, you will need to customize this method.
  /*
  atomic() {
    const batch = firebase.firestore().batch();
    /// add your operations here

    const itemDoc = firebase.firestore().doc('items/myCoolItem');
    const userDoc = firebase.firestore().doc('users/userId');

    const currentTime = this.timestamp;

    batch.update(itemDoc, { timestamp: currentTime });
    batch.update(userDoc, { timestamp: currentTime });

    /// commit operations
    return batch.commit();
  }
  */

  /**
   * Delete a collection, in batches of batchSize. Note that this does
   * not recursively delete subcollections of documents in the collection
   * from: https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts
   */
  /*
  deleteCollection(path: string, batchSize: number): Observable<any> {
    const source = this.deleteBatch(path, batchSize);

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize)),
      takeWhile(val => val > 0),
    );
  }*/

  // Detetes documents as batched transaction
  /*
  private deleteBatch(path: string, batchSize: number): Observable<any> {
    const colRef = this.afs.collection(path, ref => ref.orderBy('__name__').limit(batchSize));

    return colRef.snapshotChanges().pipe(
      take(1),
      mergeMap((snapshot: DocumentChangeAction<{}>[]) => {
        // Delete documents in a batch
        const batch = this.afs.firestore.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.payload.doc.ref);
        });

        return from(batch.commit()).pipe(map(() => snapshot.length));
      }),
    );
  }*/
}
