// NOTE: Users Collection:
// users/uid/<user doc>
export interface User {

    createdAt?: any;            // from angularfirebase's
    updatedAt?: any;            // from angularfirebase's

    uid?: string;               // auto generated

    email?: any;                // for auth, and contact
    password?: string;          // for auth

    companyName?: string;       // for profile
    companyNumber?: string;       // مكتب الشركة

    personName?: string;
    personNumber?: string;      // رقم موبايل الشخص الي سجل

    profilePicURL?: string;     //this is only for logo or profile pic!

    licenceURL?: string;        //this is for the company licence copy

    accountType?: number;       //1- indv 2- consul 3- contractor 4- supplier

    city?: number;
    // 1-dubai 2-shj 3-ajman 4-abudhabi 6- fujaira 7-rak 8- ummQ  -------  5- Al Ain was taken out!!!!

    govSector?: boolean; // true = govermental, false = private

    class?: number; //الفئة

    //TODO: Check with Eng Abdullah Which Supplier Categories to add.
    tags?: string[]; // Company Type & Supplier Category!!!

    numberOfTendersCreated?: number;
    // META, increment in create tender!

    address?: string; // in edit profile

    website?: string; // in edit profile

    TEST_RATING?: number;

    subscribedUntilDate?: Date;
}


// NOTE: Tenders Collection:
// tenders/tenderId/<TENDER_DOC_DETAILS_HERE>
export interface Tender {
    createdAt?: any;
    updatedAt?: any;

    tenderId?: string;

    tenderCategory?: string; // construction, maintenece, etc

    tenderTitle?: string;
    tenderSummary?: string;

    deadline?: any;

    //NOTE:  GET THESE FROM USER
    uid?: string; // uid
    creatorEmail?: string; // Get Company Email from CreatedBy
    companyName?: string;
    personName?: string;
    personNumber?: string;
    govSector?: boolean; // 1- goverment, 2- private
    city?: number;

    participationFee?: number; // رسوم الإشتراك في المناقصة
    bidBondPercent?: number; // الكفالة المصرفية

    participants?: string[];

    // documents explaining the project!
    // for each document show download button
    attachmentURLs?: string[];

    //NOTE META
    // META: Incremenet when new proposal added!
    numberOfProposals?: number;

    TESTPUBLISHED?: string;
    TESTDEADLINE?: string;
    TESTSTATUS?: string;

}

// Comments Collection:
// usercomments/commentby_commenton/<user comment doc>
export interface ProfileComment {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string;             // uid of comment writer
    creatorDisplayName?: string;    // name of comment writer
    creatorEmail?: string;          // email of comment writer
    creatorPhoneNumber?: string;    // phone of comment writer

    commentOn?: string;             // uid of comment reciever
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






// NOTE: Proposals Collection:
// proposals/createdByUid_tenderid/<PROPOSAL_DOC_DETAILS_HERE>
/*
export interface Proposal {
    createdAt?: any;
    updatedAt?: any;

    createdBy?: string; // uid
    tenderid?: string; // id of tender

    companyName?: string; // name of company
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
