// Users Collection:
// users/uid/<user doc>

export interface User {

    createdAt?: any;            // from angularfirebase's
    updatedAt?: any;            // from angularfirebase's

    email?: any;                // for auth, and contact
    password?: string;          // for auth

    companyName?: string;       // for profile
    uid?: string;               // auto generated

    phoneNumber?: string;       // مكتب الشركة
    personName?: string;

    mobileNumber?: string;      // رقم موبايل الشخص الي سجل

    profilePicURL?: string;     //this is only for logo or profile pic!

    licenceURL?: string;        //this is for the company licence copy

    accountType?: number;       //1- indv 2- consul 3- contractor 4- supplier

    city?: number;
    // 1-dubai 2-shj 3-ajman 4-abudhabi 5-AlAin 6- fujaira 7-rak 8- ummQ

    govSector?: boolean; // true = govermental, false = private

    class?: string; //الفئة

    //TODO: Check with Eng Abdullah Which Supplier Categories to add.
    supplierCategory?: any; // نوع المورد

    numberOfTendersCreated?: number;
    // META, increment in create tender!

    address?: string; // in edit profile

    website?: string; // in edit profile
}


// Tenders Collection:
// tenders/tenderId/<TENDER_DOC_DETAILS_HERE>
export interface Tender {
    createdAt?: any;
    updatedAt?: any; // publish date

    tenderId?: string;

    tenderCategory?: string; // construction, maintenece, etc

    tenderTitle?: string;
    tenderSummary?: string;

    deadline?: any;
    createdBy?: string; // uid
    creatorEmail?: string; // Get Company Email from CreatedBy
    nameOfCompany?: string;
    nameOfPerson?: string;
    numberOfContactPerson?: string;

    numberOfProposals?: number;
    // META: Incremenet when new proposal added!

    participationFee?: number;
    // رسوم الإشتراك في المناقصة

    bidBondPercent?: number;
    // الكفالة المصرفية

    sector?: number; // 1- goverment, 2- private

    city?: number;


    participants?: string[];

    numOfAttachments?: number;
    attachmentURLs?: string[];

    // documents explaining the project!
    // for each document show download button
    // (attachment 1 , attachment 2, etc.)


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

    createdBy?: string;             // uid of comment writer
    creatorDisplayName?: string;    // name of comment writer
    creatorEmail?: string;          // email of comment writer
    creatorPhoneNumber?: string;    // phone of comment writer

    commentOn?: string;             // uid of comment reciever
    commentStr?: string;
}









// Proposals Collection:
// proposals/createdByUid_tenderid/<PROPOSAL_DOC_DETAILS_HERE>
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

    attachementGeneralDoc?: string;

    attachmentLicenceDoc?: string;
    // copy this from the company's doc.

    attachmentTechnicalDoc?: string;
    // link to technical document
    // مستند العرض الفني

    attachmentCostDoc?: string;
    // link to technical document
    // مستند العرض المالي
}

