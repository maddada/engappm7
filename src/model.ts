import * as firebase from 'firebase/app';

// NOTE: Users Collection:
// users/uid/<user doc>
export interface User {

    createdAt?: any;            // from angularfirebase's
    updatedAt?: any;            // from angularfirebase's

    uid?: string;               // auto generated

    email?: any;                // for auth, and contact
    password?: string;          // for auth

    profileName?: string;       // for profile
    profileNameAr?: string;       // for profile

    companyNumber?: string;       // مكتب الشركة

    personName?: string;
    personNumber?: string;      // رقم موبايل الشخص الي سجل

    profilePicURL?: string;     //this is only for logo or profile pic!

    licenceURL?: string;        //this is for the company licence copy

    accountType?: number;

    city?: city;
    // 1-dubai 2-shj 3-ajman 4-abudhabi 6- fujaira 7-rak 8- ummQ  -------  5- Al Ain was taken out!!!!

    govSector?: boolean; // true = govermental, false = private

    class?: number; //الفئة

    tags?: string[]; // Company Type & Supplier Category!!!

    numberOfTendersCreated?: number;
    // META, increment in create tender!

    address?: string; // in edit profile

    website?: string; // in edit profile

    TEST_RATING?: number;

    rating?: number;

    subscribedUntilDate?: Date;
}

export declare const enum city {
    dxb = 1,
    shj = 2,
    ajman = 3,
    ad = 4,
    fujaira = 6,
    rak = 7,
    umq = 8,
}

//1- indv 2- consul 3- contractor 4- supplier
export declare const enum accountType {
    indv = 1,
    consultant = 2,
    contractor = 3,
    supplier = 4,
}

// NOTE: Tenders Collection:
// tenders/tenderId/<TENDER_DOC_DETAILS_HERE>
export interface Tender {
    createdAt?: any;
    updatedAt?: any;

    tenderId?: string;

    tenderCategory?: string; // construction, maintenece, etc

    tenderTitle?: string;
    tenderTitleAr?: string;
    tenderSummary?: string;

    deadline?: number;

    //NOTE:  GET THESE FROM USER
    uid?: string; // uid
    creatorEmail?: string; // Get Company Email from CreatedBy
    profileName?: string; // User or Company Name!!
    profileNameAr?: string;       // Company Name!!
    personName?: string; // Company rep name
    personNumber?: string;
    companyNumber?: string;
    govSector?: boolean; // 1- goverment, 2- private
    city?: city;

    participationFee?: number; // رسوم الإشتراك في المناقصة
    bidBondPercent?: number; // الكفالة المصرفية

    participants?: string[];

    // documents explaining the project!
    // for each document show download button
    attachmentURLs?: string[];

    //NOTE META
    // META: Incremenet when new proposal added!
    numberOfProposals?: number;

    featured?: boolean;

    profilePicURL?: string;     //this is only for logo or profile pic!

    tenderContactWhatsapp?: string;
    tenderContactEmail?: string;
    tenderContactNumber?: string;

    TESTPUBLISHED?: string;
    TESTDEADLINE?: string;
    TESTSTATUS?: string;

}

// Comments Collection:
// usercomments/commentby_commenton/<user comment doc>
export interface ProfileComment {
    createdAt?: any;
    updatedAt?: any;

    createdById?: string;             // uid of comment writer
    creatorDisplayName?: string;    // name of comment writer
    creatorEmail?: string;          // email of comment writer
    creatorPhoneNumber?: string;    // phone of comment writer
    city?: city;

    commentOnId?: string;             // uid of comment reciever
    commentOnName?: string;
    commentOnCity?: city;
    commentOnNumber?: string;
    commentOnEmail?: string;

    commentStr?: string;
    rating?: number;

    // commentType?: number; // 1 = profile, 2 = tender, 3 = proposal.
    //This is for the future (only profile comments now!)
}


// LATER: THESE COMMENTS ARE FOR TENDERS/PROPOSALS (Not required in alpha)
// TenderComments Collection:
// tenderComments/generated_id/<tender comment doc>
export interface TenderComment {
    createdAt?: any;
    updatedAt?: any;

    uid?: string;             // uid of comment writer
    creatorDisplayName?: string;    // name of comment writer
    creatorEmail?: string;          // email of comment writer
    creatorPhoneNumber?: string;    // phone of comment writer

    commentOn?: string;             // uid of comment reciever
    commentStr?: string;
}


export interface SearchFilter {
    searchString?: string;
    city?: number;
    tag?: string;
}

export class M7LoadingOptions {
    translucent = false;
    spinner = 'bubbles';
    showBackdrop = true;
    animated = true;
    mode = 'md';
    keyboardClose = true;
}


// NOTE: Proposals Collection:
// proposals/createdByUid_tenderid/<PROPOSAL_DOC_DETAILS_HERE>
/*
export interface Proposal {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string; // uid
    tenderid?: string; // id of tender

    profileName?: string; // name of company
    personName?: string; // name of person that submitted this
    class?: number;

    bidAmount?: number;
    city?: number;

    creatorEmail?: string; // Get Company Email from CreatedBy
    personNumber?: string;
    companyNumber?: string;

    attachmentLicenceDoc?: string; // copy this from the company's doc.

    attachmentURLs: string[];

}
// attachmentTechnicalDoc?: string;
// link to technical document
// مستند العرض الفني

// attachmentCostDoc?: string;
// link to technical document
// مستند العرض المالي
*/
