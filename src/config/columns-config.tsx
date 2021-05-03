import {GridColumnHeaderParams} from "@material-ui/data-grid";
import InfoIcon from '@material-ui/icons/Info';
import {Tooltip} from "@material-ui/core";
import * as apiSchema from "./api-schema";


export type ConfigKey = keyof apiSchema.Record | string;

export type FilterConfig = {
    type: string,
    choices?: string[]
}

export type FiltersCfg = { [key: string]: FilterConfig };

export const filterTypeDisplayNames: {[key: string]: string} = {
    'search': 'keyword',
    'choice': 'options',
    'date_range': 'date range'
}

export const columnsCfg: {[key in ConfigKey] : any} = {
    BriefTitle: {
        filters: {
            type: 'search'
        }
    },
    Status: {
        filters: {
            type: 'choice',
            choices: [
                "Not yet recruiting",
                "Recruiting",
                "Enrolling by invitation",
                "Active, not recruiting",
                "Suspended",
                "Terminated",
                "Completed",
                "Withdrawn",
                "Unknown status",
            ]
        }
    },
    NCTID: {
        label: 'NCT ID',
        filters: {
            type: 'search'
        }
    },
    StudyPhase: {
        filters: {
            type: 'choice',
            choices: [
                "Early Phase 1 ",
                "Phase 1 ",
                "Phase 2 ",
                "Phase 3  ",
                "Phase 4 ",
                "Not Applicable"
            ]
        }
    },
    Conditions: {
        filters: {
            type: 'search'
        }
    },
    Interventions: {
        filters: {
            type: 'search'
        }
    },
    InterventionType: {
        filters: {
            type: 'choice',
            choices: [
                "Behavioral ",
                "Biological",
                "Combination product",
                "Device",
                "Diagnostic test",
                "Dietary supplement",
                "Drug",
                "Genetic ",
                "Procedure ",
                "Radiation",
                "Other"
            ]
        }
    },
    Sponsor: {
        filters: {
            type: 'search'
        }
    },
    GenericName: {
        filters: {
            type: 'search'
        }
    },
    StartDate: {
        filters: {
            type: 'date_range'
        }
    },
    EstimatedEndDate: {
        filters: {
            type: 'date_range'
        }
    },
    PrimaryCompletionDate: {
        filters: {
            type: 'date_range'
        }
    },
    StudyCompletionDate: {
        filters: {
            type: 'date_range'
        }
    },
    StudyType: {
        filters: {
            type: 'search'
        }
    },
    Allocation: {
        filters: {
            type: 'search'
        }
    },
    InterventionModel: {
        filters: {
            type: 'search'
        }
    },
    Masking: {
        filters: {
            type: 'search'
        }
    },
    PrimaryPurpose: {
        filters: {
            type: 'search'
        }
    },
    Investigators: {
        renderHeaderInner: (params: GridColumnHeaderParams) => (
            <>
                {'Investigators'}
                <Tooltip title="People who have profiles">
                    <InfoIcon/>
                </Tooltip>
            </>
        ),
        filters: {
            type: 'search'
        }
    },
    TopInvestigators: {
        filters: {
            type: 'search'
        }
    },
    Location: {
        filters: {
            type: 'search'
        }
    },
    Sites: {
        filters: {
            type: 'search'
        }
    },
    FunderType: {
        filters: {
            type: 'choice',
            choices: [
                "NIH",
                "Other U.S. Federal agency",
                "Industry",
                "All others (individuals, universities, organizations)"
            ]
        }
    },
    LastUpdated: {
        filters: {
            type: 'date_range'
        }
    },
};
