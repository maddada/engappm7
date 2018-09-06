
/* Types of Users:

1 = individual
2 = consultant
3 = contractor
4 = supplier
*/

/* Cities:

1- abu dhabi
2- dubai
3- sharjah
4- ajman
5- fujairah
6- al ain
7- ras al khaima
8- Umm al-Quwain
*/

/* User Properties:
createdAt
updatedAt

email
password

displayName
uid

phoneNumber
personName

mobileNumber

photoURL

licenceURL

city
type
class
*/

export interface User {

    createdAt?: any; // from angularfirebase's
    updatedAt?: any; // from angularfirebase's

    email?: any; // for auth
    password?: string; // for auth

    companyName?: string; // for profile
    uid?: string; // auto generated

    phoneNumber?: string;     // مكتب الشركة
    personName?: string;

    mobileNumber?: string;
    // رقم موبايل الشخص الي سجل

    photoURL?: string;
    //this is only for logo or profile pic!

    licenceURL?: string;
    //this is for the company licence copy

    city?: number;
    type?: number;
    class?: string; //الفئة

    //TODO: CHECK WITH
    category?: any; // نوع المورد

}





















export interface Type {
    consultant: boolean;
    contractor: boolean;
    person: boolean;
    admin: boolean;
}

export interface Rating {
    uid?: string;
    rating?: number;
}

export class Upload {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date = new Date();

    constructor(file: File) {
        this.file = file;
    }
}


export interface Tender {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string; // uid
    attachmentURL?: string;
    nameOfCompany?: string;
    nameOfPerson?: string;
    // formElementsArray?: FormElement[];
}

export interface Proposal {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string; // uid

    nameOfCompany?: string;
    // name of company
    nameOfPerson?: string;
    // name of person that submitted this

    attachmentURL?: string;
    // formElementsArray?: FormElement[];
}


// 6aaaf:


    //copied some things from here for the User class: https://firebase.google.com/docs/reference/js/firebase.UserInfo


// export class PhoneNumber {
//     country: string;
//     area: string;
//     prefix: string;
//     line: string;
//     // format phone numbers as E.164
//     get e164(): string {
//         const num = this.country + this.area + this.prefix + this.line;
//         return `+${num}`;
//     }
// }


// export interface Info {
//     numberOfCompetitions?: number;
// }


//7ykon fe array of these:
// export interface FormElement {
//     a?: string;
//     e?: string;

//     v?: any;

//     ar_desc?: string;
//     en_desc?: string;

//     value_type?: any;
//     // 0 = small text field
//     // 1 = big text box
//     // 2 = Big title
//     // 3 = Small title
//     // 4 = tickbox (boolean)
//     // 5 = Note

//     required?: boolean;
//     hiddenForJudges?: boolean;
// }



// export interface SingleEntry {
//     a?: any; //arabic
//     e?: any; //english

//     v?: any;

//     ar_desc?: string;
//     en_desc?: string;

//     value_type?: any;
//     // 0 = small text field
//     // 1 = big text box
//     // 2 = Big title
//     // 3 = Small title
//     // 4 = tickbox (boolean)
//     // 5 = Note

//     required?: boolean;
//     hiddenForJudges?: boolean;
//     checkboxNotePickOne?: boolean;
// }


// export interface Entry {
//     id?: string;
//     compID?: string;
//     approved?: boolean;
//     createdAt?: any;
//     updatedAt?: any;
//     // _time?: any;

//     _downloadURL?: any;
//     _downloadURLJudge?: any;

//     phase2?: boolean;
//     //IF THIS IS PHASE 2 THEN SHOW PHASE 1 ENTRIES BASED ON THE (comp.showPhase1Table value)

//     /*
//         IF THIS IS PHASE 1, SHOW THE "SEND THE YOU ADVANCED TO SECOND PHASE" EMAIL
//         (CONTAINS ID OF ENTRY SO IT'S ENTERED IN OTHER COMP WHEN JOINING,
//         AND CONTAINS LINK TO SECOND COMP.
//     */
//     idOfPhase1?: any;

//     xd?: SingleEntry[]; //this is the most important array in an entry xd

//     p?: any; //Project Names for Idea to Innovation, Arabic.

//     advancedToPhase2?: boolean;
// }
