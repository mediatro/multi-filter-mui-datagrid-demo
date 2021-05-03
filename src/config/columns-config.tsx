import {GridCellParams, GridColumnHeaderParams} from "@material-ui/data-grid";
import InfoIcon from '@material-ui/icons/Info';
import {Grid, Link, Tooltip} from "@material-ui/core";
import * as apiSchema from "./api-schema";
import {CustomChoiceLabel} from "../components/custom-choice-label";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {TableHeaderCell} from "../components/table-header-cell";

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

export const customChoiceLabels: {[key: string]: string[]} = {
    "Not yet recruiting": ['#e8eaed', '#6b778c'],
    "Recruiting": ['#ddf3ed', '#019a74'],
    "Enrolling by invitation": ['#ddf3ed', '#019a74'],
    "Active, not recruiting": ['#fff5e5', '#ec980c'],
    "Completed": ['#e2f2fd', '#178fff'],
    "Suspended": ['#feecef', '#d3393b'],
    "Terminated": ['#feecef', '#d3393b'],
    "Withdrawn": ['#feecef', '#d3393b'],
    "Unknown status": ['#feecef', '#d3393b'],

    "Early Phase 1 ": ['#f9fafb', '#797c86'],
    "Phase 1": ['#e8eaed', '#adb0b6'],
    "Phase 2": ['#c3cad4', '#484d5b'],
    "Phase 3": ['#6b778c', '#ffffff'],
    "Phase 4": ['#54617b', '#ffffff'],
    "Not Applicable": ['#e8eaed', '#959fb0'],

    'Interventional': ['','','LocalHospitalIcon'],
    'Observational': ['','','VisibilityIcon'],
}

export const columnsCfg: {[key in ConfigKey] : any} = {
    BriefTitle: {
        renderCell: (params: GridCellParams) => (
            <Tooltip title="View details page">
                <Link href={"#"}>{params.formattedValue}</Link>
            </Tooltip>
        ),
        filters: {
            type: 'search'
        }
    },
    Status: {
        renderCell: CustomChoiceLabel,
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
        renderCell: CustomChoiceLabel,
        filters: {
            type: 'choice',
            choices: [
                "Early Phase 1",
                "Phase 1",
                "Phase 2",
                "Phase 3",
                "Phase 4",
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
                "Behavioral",
                "Biological",
                "Combination product",
                "Device",
                "Diagnostic test",
                "Dietary supplement",
                "Drug",
                "Genetic",
                "Procedure",
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
            type: 'choice',
            choices: [
                'Interventional',
                'Observational',
            ]
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
        renderHeader: (params: GridColumnHeaderParams) => (
            <TableHeaderCell {...params}>
                <Grid container spacing={1}>
                    <Grid item>
                        {'Investigators'}
                    </Grid>
                    <Grid item>
                        <Tooltip title="People who have profiles">
                            <InfoIcon fontSize={"small"} color={"primary"}/>
                        </Tooltip>
                    </Grid>
                </Grid>
            </TableHeaderCell>
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
