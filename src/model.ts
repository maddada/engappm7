
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

profilePicURL

licenceURL

city
type
class
*/


// All user to user comments will be in a single collection.
// Then use where queries to display subsets that you need only!

// Comments collection is:
// comments/createdby_recievedby/<COMMENT_DOC_DETAILS_HERE>
// query by commentOn to show comments on a page.
// query by createdBy = currentUserId -> show comments on user profile.

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

    profilePicURL?: string;
    //this is only for logo or profile pic!

    licenceURL?: string;
    //this is for the company licence copy

    city?: number;
    type?: number;
    class?: string; //الفئة

    //TODO: CHECK WITH
    category?: any; // نوع المورد

}




// All comments will be in a single collection.
// Then use where clauses to show what you need only
// Comments collection is:
// comments/createdby_recievedby/<COMMENT_DOC_DETAILS_HERE>
// query by commentOn to show comments on a page.
// query by createdBy = currentUserId -> show comments on user profile.
export interface Comment {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string; // uid of comment writer
    // go here and get details for UI (ples)
    commentOn?: string; // uid of comment reciever

    commentStr?: string;

    rating?: number; // only for commentType 1 (on a profile)

    commentType?: number; // 1 = profile, 2 = tender, 3 = proposal.

    // tenderComment?: boolean; // if the comment is on a tender
    // proposalComment?: boolean; // if the comment is on a proposal
    // profileComment?: boolean; // if the comment is on a profile.
}












// Proposals Collection:
// tenders/createdby_tenderid/<PROPOSAL_DOC_DETAILS_HERE>
export interface Tender {
    createdAt?: any;
    updatedAt?: any; // publish date

    deadline?: any;


    createdBy?: string; // uid

    creatorEmail?: string;
    // Get Company Email from CreatedBy

    nameOfCompany?: string;
    nameOfPerson?: string;
    numberOfContactPerson?: string;

    numberOfProposals?: number;

    participationFee?: number;
    // رسوم الإشتراك في المناقصة

    bidBondPercent?: number;
    // الكفالة المصرفية

    sector?: number; // 1- goverment, 2- private

    city?: number;

    category?: string;

    participants?: string[];

    attachmentURLs?: string[];

    // documents explaining the project!
    // for each document show download button
    // (attachment 1 , attachment 2, etc.)


}









// Proposals Collection:
// proposals/randomid/<PROPOSAL_DOC_DETAILS_HERE>
// didn't do /createdby_tenderid/ because might allow
// multiple proposals!!
export interface Proposal {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string; // uid
    tenderid?: string;

    nameOfCompany?: string;
    // name of company
    nameOfPerson?: string;
    // name of person that submitted this



    bidAmount?: number;

    attachmentLicenceDoc?: string;
    // copy this from the company's doc.

    attachmentTechnicalDoc?: string;
    // link to technical document
    // مستند العرض الفني

    attachmentCostDoc?: string;
    // link to technical document
    // مستند العرض المالي

    // formElementsArray?: FormElement[];
}



































































// 6aaaf:


// Not doing this, can't be queried in firestore
// export interface Type {
//     individual: // 1
//     consultant: boolean; //2
//     contractor: boolean; //3
//     supplier: boolean; //4
//     admin: boolean; // 5
// }



// export class Upload {
//     $key: string;
//     file: File;
//     name: string;
//     url: string;
//     progress: number;
//     createdAt: Date = new Date();

//     constructor(file: File) {
//         this.file = file;
//     }
// }


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
