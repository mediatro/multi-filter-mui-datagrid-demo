export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
};


export type NumOrDate = Scalars['Date'] | Scalars['Int'];

export type Location = {
    __typename?: 'Location';
    city?: Maybe<Array<Maybe<Scalars['String']>>>;
    state?: Maybe<Scalars['String']>;
    country?: Maybe<Scalars['String']>;
};

export type People = {
    __typename?: 'People';
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['String']>;
};

export type Sites = {
    __typename?: 'Sites';
    siteName?: Maybe<Scalars['String']>;
    location?: Maybe<Location>;
};

export type Record = {
    __typename?: 'Record';
    BriefTitle?: Maybe<Scalars['String']>;
    Status?: Maybe<Scalars['String']>;
    NCTID?: Maybe<Scalars['String']>;
    StudyPhase?: Maybe<Scalars['String']>;
    Conditions?: Maybe<Array<Maybe<Scalars['String']>>>;
    Interventions?: Maybe<Array<Maybe<Scalars['String']>>>;
    InterventionType?: Maybe<Scalars['String']>;
    Sponsor?: Maybe<Scalars['String']>;
    GenericName?: Maybe<Scalars['String']>;
    StartDate?: Maybe<NumOrDate>;
    EstimatedEndDate?: Maybe<NumOrDate>;
    PrimaryCompletionDate?: Maybe<NumOrDate>;
    StudyCompletionDate?: Maybe<NumOrDate>;
    StudyType?: Maybe<Scalars['String']>;
    Allocation?: Maybe<Scalars['String']>;
    InterventionModel?: Maybe<Scalars['String']>;
    Masking?: Maybe<Scalars['String']>;
    PrimaryPurpose?: Maybe<Scalars['String']>;
    Investigators?: Maybe<Array<Maybe<People>>>;
    TopInvestigators?: Maybe<Array<Maybe<People>>>;
    Location?: Maybe<Array<Maybe<Location>>>;
    Sites?: Maybe<Array<Maybe<Sites>>>;
    FunderType?: Maybe<Scalars['String']>;
    LastUpdated?: Maybe<NumOrDate>;
};
