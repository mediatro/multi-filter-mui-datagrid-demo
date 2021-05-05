import {GridCellClassParams, GridCellParams, GridColumnHeaderParams} from "@material-ui/data-grid";
import InfoIcon from '@material-ui/icons/Info';
import {Grid, Link, Tooltip} from "@material-ui/core";
import * as apiSchema from "./api-schema";
import {TableCellCustomOptionLabel} from "../components/table-cell/table-cell-custom-option-label";
import {TableCellHeader} from "../components/table-cell/table-cell-header";
import {TableCellTitle} from "../components/table-cell/table-cell-title";
import {TableCellDate} from "../components/table-cell/table-cell-date";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {TableCellArray} from "../components/table-cell/table-cell-array";
import {TableCellHeaderTitle} from "../components/table-cell/table-cell-header-title";

export type ConfigKey = keyof apiSchema.Record | string;

export type FilterConfig = {
    type: string,
    choices?: string[]
}

export type FiltersCfg = { [key: string]: FilterConfig };

export const filterTypeDisplayNameMap: {[key: string]: string} = {
    'search': 'keyword',
    'choice': 'options',
    'date_range': 'date range'
}

export const componentMap: {[key: string]: any} = {
    'LocalHospitalIcon': <LocalHospitalIcon/>,
    'VisibilityIcon': <VisibilityIcon/>,
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

const valueFormatters = {
    people: (value: apiSchema.People) => `${value.firstName} ${value.lastName}`,
    location: (value: apiSchema.Location) => `${value.country}/${value.state}/${value.city}`,
}

export const columnsCfg: {[key in ConfigKey] : any} = {
    BriefTitle: {
        label: 'Brief Title',
        width: 0,
        renderHeader: (params: GridColumnHeaderParams) => <TableCellHeaderTitle {...params} />,
        renderCell: (params: GridCellParams) => <TableCellTitle {...params} />, // wrap with anon function like this if you need to use hooks inside a component
        filters: {
            type: 'search'
        }
    },
    Status: {
        renderCell: TableCellCustomOptionLabel,
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
        label: 'Study Phase',
        renderCell: TableCellCustomOptionLabel,
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
        renderCell: (params: GridCellParams) => <TableCellArray {...params} limit={4}/>,
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
        label: 'Intervention Type',
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
        label: 'Generic Name',
        filters: {
            type: 'search'
        }
    },
    StartDate: {
        label: 'Start Date',
        renderCell: TableCellDate,
        filters: {
            type: 'date_range'
        }
    },
    EstimatedEndDate: {
        label: 'Estimated End Date',
        renderCell: TableCellDate,
        filters: {
            type: 'date_range'
        }
    },
    PrimaryCompletionDate: {
        label: 'Primary Completion Date',
        renderCell: TableCellDate,
        filters: {
            type: 'date_range'
        }
    },
    StudyCompletionDate: {
        label: 'Study Completion Date',
        renderCell: TableCellDate,
        filters: {
            type: 'date_range'
        }
    },
    StudyType: {
        label: 'Study Type',
        renderCell: TableCellCustomOptionLabel,
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
        label: 'Intervention Model',
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
        label: 'Primary Purpose',
        filters: {
            type: 'search'
        }
    },
    Investigators: {
        renderHeader: (params: GridColumnHeaderParams) => (
            <TableCellHeader {...params}>
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
            </TableCellHeader>
        ),
        renderCell: (params: GridCellParams) => <TableCellArray {...params} valueFormatter={valueFormatters.people}/>,
        filters: {
            type: 'search'
        }
    },
    TopInvestigators: {
        label: 'Top Investigators',
        filters: {
            type: 'search'
        }
    },
    Location: {
        renderCell: (params: GridCellParams) => <TableCellArray {...params} valueFormatter={valueFormatters.location}/>,
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
        label: 'Funder Type',
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
        label: 'Last Updated',
        renderCell: TableCellDate,
        filters: {
            type: 'date_range'
        }
    },
};
