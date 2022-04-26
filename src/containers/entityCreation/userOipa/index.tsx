import React, {ChangeEvent, useEffect, useMemo, useState, useContext, FormEvent} from "react";
import produce, { Draft } from 'immer';
import { CollapseContainer, useLoading } from "equisoft-design-ui-elements";
import { Button, IconButton } from "@equisoft/design-elements-react";
import InputText, { Options } from "../../../components/general/inputText";
import OipaUser from "../../../lib/domain/entities/oipaUser";
import Label from "../../../components/general/label";
import CompanyService from "../../../lib/services/companyService";
import { defaultCodeService, defaultCompanyService,  defaultOipaUserService} from "../../../lib/context";
import Company from "../../../lib/domain/entities/company";
import DataTable, { DataTableColumn } from "../../general/dataTable/table";
import UserSecurityGroup from "../../../lib/domain/entities/userSecurityGroup";
import { v4 as uuid } from 'uuid';
import OipaUserService from "../../../lib/services/oipaUserService";
import { toast } from "react-toastify";
import { MSG_DIFFERENT_PASSWORDS, MSG_REQUIRED_FIELD} from "../../../lib/constants";
import InvalidField from "../../../components/general/inputText/invalidField";

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from "@material-ui/lab/ToggleButton";
import { TabContext } from "../../../components/editor/tabs/tabContext";
import { StatusContainer, ButtonSection } from "./style";
import SecurityGroupList from "../../../lib/domain/entities/securityGroupList";
import { Grid } from '@material-ui/core';
import CodeList from "../../../lib/domain/entities/codeList";
import { dateToString } from "../../../lib/util/date";
import { GenderEnum } from "../../../lib/domain/enums/gender";
import { UserStatus } from "../../../lib/domain/enums/userStatus";
import CodeService from "../../../lib/services/codeService";
import {RightbarContext} from "../../../components/general/sidebar/rightbarContext";
import FrameworkComponent from "../frameworkComponent";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";

type TypeFields = 'firstName' | 'lastName' | 'sex' | 'email' | 'userStatus' | 'clientNumber' | 'password' | 'password2' | 'company' | 'localCode';

const errorInitial = {
  hasError: false,
  messages: {
      firstName: "",
      lastName: "",
      sex: "",
      email: "",
      clientNumber: "",
      password: "",
      password2: "",
      company: "",
      localCode: "",
      userStatus: "",
      securityGroupName: "",
      effectiveFrom: "",
  }
};
const defaultOption :Options = { label: 'Select one', value: ''};
const optionsSex = [
     defaultOption,
     ...GenderEnum.codes.map(({ code, value }) => ({ value: code , label: value }))
];

const newUserSecurity = () : UserSecurityGroup => {
    const newUserSec = new UserSecurityGroup();
    newUserSec.effectiveTo = undefined;
    newUserSec.effectiveFrom = undefined;
    return newUserSec;
};

interface UserOipaProps {
    oipaUserService: OipaUserService,
    companyService: CompanyService,
    codeService: CodeService,
    isEdit: boolean,
    userOipa: OipaUser
}

const UserOipa = ({ oipaUserService, companyService, codeService,  isEdit, userOipa } : UserOipaProps) => {

    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);

    const { toggleRefreshTab } = useContext(TabContext);

    const [userSession, setUserSession] = useState<OipaUser>(userOipa);

    const [companies, setCompanies] = useState<Company[]>([]);

    const [securityGroups, setSecurityGroups] = useState<SecurityGroupList>();

    const [errorValidation, setErrorValidation] = useState(errorInitial);

    const [userSecurityGroup, setUserSecurityGroup] = useState<UserSecurityGroup>(newUserSecurity() );

    const [isEditSecurityGroup, setIsEditSecurityGroup] = useState(false);

    const [isShowFormRowTable, setIsShowFormRowTable] = useState(false);

    const [localeCodes, setLocaleCodes ] = useState<Options[]>([]);
    // const [error, setError] = useState(new ErrorUserOipa());

    const updateUserSession = (recipe: (draft: Draft<OipaUser>) => void) => {
        setUserSession(produce(userSession, recipe));
    };

    const updateUserSecurityGroup = (recipe: (draft: Draft<UserSecurityGroup>) => void) => {
       setUserSecurityGroup(produce(userSecurityGroup, recipe));
    };

    const listCompanies = useMemo(() =>
        [defaultOption, ...companies.map((c) =>
          ({ label: c.companyName, value: c.companyName }))], [companies]);

    const listSecurityGroups = useMemo(() =>
        [defaultOption, ...securityGroups?.securityGroups.map((s) =>
            ({ label: s.securityGroupName, value: s.securityGroupName})) ?? []], [securityGroups]);

    const fetchCompanies = () => {
        load(async () => {
            setCompanies(await companyService.getPrimaryCompanies());
        })();
    };

    const fetchSecurityGroups = () => {
        load(async () => {
           setSecurityGroups(await oipaUserService.getSecurityGroups());
        })();
    };

    const fetchLocaleCodes = () => {
        load(async () => {
            const locales: CodeList = await codeService.getLocaleCodes();
            setLocaleCodes([defaultOption, ...locales.codes.map(({ value, longDescription }) =>
                     ({ value, label: longDescription }))]);
        })();
    }

    const updateUser = load(async() => oipaUserService.saveUser(userSession));

    const createUser = load(async () => oipaUserService.createUser(userSession));

    useEffect(() => setUserSession(userOipa) , [userOipa]);

    useEffect(() => {
        fetchCompanies();
        fetchSecurityGroups();
        fetchLocaleCodes();
    }, []);

    const onEditRow = (row: UserSecurityGroup) => {
        setUserSecurityGroup(row);
        setIsEditSecurityGroup(true);
        setIsShowFormRowTable(true);
    };

    const onDeleteRow = (row: UserSecurityGroup) => {
        updateUserSession((draft) => {
             const indexUsg = draft.userSecurityGroups
                           .findIndex((usg) => usg.securityGroupName === row.securityGroupName);
             const begin = draft.userSecurityGroups.slice(0, indexUsg);
             const end = draft.userSecurityGroups.slice(indexUsg + 1, draft.userSecurityGroups.length);
             draft.userSecurityGroups = begin.concat(end);
        });
    }

    const securityGroupNameCell = (row: UserSecurityGroup) => <small>{row.securityGroupName}</small>;

    const dateCell = (field: 'effectiveFrom' | 'effectiveTo', row: UserSecurityGroup ) =>
               <small>{dateToString(row[field])} </small>;

    const actionCell = (row: UserSecurityGroup) =>
            <>
                <span>
                    <IconButton label="edit"
                                buttonType="tertiary"
                                iconName="edit"
                                onClick={() => onEditRow(row ) }
                    />
                </span>
                <IconButton label="delete"
                            buttonType="tertiary"
                            type="reset"
                            iconName="x"
                            onClick={ onDeleteRow.bind(null, row) }
                />
            </>;

    const columns: DataTableColumn[] = [
        { name: 'Name', selector: 'securityGroupName', cell: securityGroupNameCell},
        { name: 'From', selector: 'effectiveFrom', cell: dateCell.bind(null, 'effectiveFrom')},
        { name: 'To', selector: 'effectiveTo', cell: dateCell.bind(null, 'effectiveTo')},
        { name: '', selector: '', cell: actionCell }
    ];

    const onChange = (field: TypeFields, value: string | Company) => {
        updateUserSession((draft) => {
            (draft as any)[field] = value;
        });

        setErrorValidation(produce(errorValidation, (draft) => {
            draft.messages[field] = '';
        }))
    };

    const validateNewSecurityGroup = () =>
        Object.keys(userSecurityGroup).reduce((error: any, key) => {
            let msg;
            switch (key) {
                case 'securityGroupName':
                case 'effectiveFrom':
                    msg = !userSecurityGroup[key] && MSG_REQUIRED_FIELD;
                    break;
                default: return error;
            }
            return {...error, hasError: error.hasError || !!msg, messages: {...error.messages, [key]: msg}};
        }, {});

    const updateRow = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        const errors = validateNewSecurityGroup();
        setErrorValidation((prev) => ({...prev, ...errors}));
        if(errors.hasError){
            return;
        }
        updateUserSession((draft) => {
            const sg = (draft.userSecurityGroups
                .find((usg) =>
                    usg.securityGroupGuid === userSecurityGroup.securityGroupGuid) || new UserSecurityGroup() );
            sg.securityGroupName = userSecurityGroup.securityGroupName
            sg.effectiveFrom = userSecurityGroup.effectiveFrom;
            sg.effectiveTo = userSecurityGroup.effectiveTo;
        });
        setUserSecurityGroup(newUserSecurity());
        setIsEditSecurityGroup(false);
        setIsShowFormRowTable(false);
    }

    const cancelUpdateRow = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        setUserSecurityGroup(newUserSecurity());
        setIsEditSecurityGroup(false);
        setIsShowFormRowTable(false);
    }

    const addRow = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        const errors = validateNewSecurityGroup();
        setErrorValidation((prev) => ({...prev, ...errors}));
        if(errors.hasError){
            return;
        }
        updateUserSession((draft) => {
            const newUserSecGroup = new UserSecurityGroup();
            newUserSecGroup.securityGroupGuid = uuid();
            newUserSecGroup.securityGroupName = userSecurityGroup.securityGroupName;
            newUserSecGroup.effectiveFrom = userSecurityGroup.effectiveFrom;
            newUserSecGroup.effectiveTo = userSecurityGroup.effectiveTo;
            draft.userSecurityGroups.push(newUserSecGroup);
        });

        setUserSecurityGroup(newUserSecurity());
        setIsEditSecurityGroup(false);
        setIsShowFormRowTable(false);
    };

    const validate = () =>
        Object.keys(userSession).reduce((error: any, key) => {
            let msg;
            switch (key) {
                case 'firstName':
                case 'lastName':
                case 'clientNumber':
                case 'localCode':
                case 'userStatus':
                    msg = !userSession[key] && MSG_REQUIRED_FIELD;
                    break;
                case 'company':
                    msg = !userSession.company.companyGuid && MSG_REQUIRED_FIELD;
                    break;
                case 'password':
                    if(!isEdit && !userSession.password){
                        msg = MSG_REQUIRED_FIELD;
                    }

                    if(userSession.password && userSession.password.length < 6){
                        msg = 'Minimum 6 characters';
                    }
                    break;
                case 'password2': {
                    if((!isEdit && !userSession.password2) || (userSession.password && !userSession.password2)){
                        msg = MSG_REQUIRED_FIELD;
                    }
                    if(userSession.password2 && userSession.password !== userSession.password2){
                        msg = MSG_DIFFERENT_PASSWORDS;
                    }
                    break;
                }
                default: return error;
            }
            return {...error, hasError: error.hasError || !!msg, messages: {...error.messages, [key]: msg}};
        }, {});

    const onClickSave = load(async (e: FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const errors = validate();
        setErrorValidation(errors);
        if(errors.hasError){
            toast.error('Error during validation');
            return;
        }
        if(isEdit) {
            await updateUser();
            closeRightbar();
            toast.success(('User updated successfully'));
        } else {
            await createUser();
            setUserSession(new OipaUser());
            toast.success(('User created successfully'));
        }
        toggleRefreshTab();
        closeRightbar();
    });

    const userInformationContent = () =>
        <>
            <InputText type="text"
                       label="First name"
                       value={userSession.firstName}
                       feedbackMsg={errorValidation.messages.firstName}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('firstName', e.currentTarget.value)}
                       required
            />

            <InputText type="text"
                       label="Last name"
                       value={userSession.lastName}
                       feedbackMsg={errorValidation.messages.lastName}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('lastName', e.currentTarget.value)}
                       required
            />

            <InputText type="custom-select"
                       label="Sex"
                       value={userSession.sex}
                       options={optionsSex}
                       onChange={(e: Options) => onChange('sex', e.value)}
            />

            <InputText type="text"
                       label="Email"
                       value={userSession.email}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('email', e.currentTarget.value)}
            />
            <StatusContainer id="userStatus">
                <Label text='Status' />
                {errorValidation.messages.userStatus &&
                <InvalidField controlId=''
                              feedbackMsg={errorValidation.messages.userStatus}
                />
                }
                <ToggleButtonGroup
                    value={userSession.userStatus}
                    exclusive
                    onChange={(_, value) => {
                        value && onChange('userStatus', value);
                    }}
                    aria-label="status" size="small"
                >
                    { UserStatus.codes.map(({code, value}) => (
                        <ToggleButton key={code} value={code} aria-label={value}>
                            {value}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </StatusContainer>
        </>;

    const loginContent = () =>
        <>
            <InputText type="text"
                       label="Login name"
                       value={userSession.clientNumber}
                       feedbackMsg={errorValidation.messages.clientNumber}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('clientNumber', e.currentTarget.value)}
                       disabled={isEdit}
                       required
            />

            <InputText type="password"
                       label="New password"
                       value={userSession.password}
                       feedbackMsg={errorValidation.messages.password}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('password', e.currentTarget.value)}
                       required
            />

            <InputText type="password"
                       label="New password (confirm)"
                       value={userSession.password2}
                       feedbackMsg={errorValidation.messages.password2}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('password2', e.currentTarget.value)}
                       required
            />
        </>

    const CompanyContent = () =>
        <PanelSectionContainer>
            <InputText type="custom-select"
                       label="Company"
                       value={userSession.company.companyName}
                       feedbackMsg={errorValidation.messages.company}
                       options={listCompanies}
                       onChange={(e: Options) =>
                           onChange('company', new Company(e.value, e.value))}
                       disabled={isEdit}
                       required
            />

            <InputText type="custom-select"
                       label="Locale"
                       value={userSession.localCode}
                       feedbackMsg={errorValidation.messages.localCode}
                       options={localeCodes}
                       onChange={(e: Options) =>
                           onChange('localCode', e.value)}
                       required
            />
        </PanelSectionContainer>

    const SecurityGroupRowContent = () =>
        <PanelSectionContainer>
            <Grid container>
                <Grid item xs={12}>
                    <InputText type="custom-select"
                               label="Security group name"
                               value={userSecurityGroup.securityGroupName}
                               feedbackMsg={errorValidation.messages.securityGroupName}
                               options={listSecurityGroups}
                               onChange={(e: Options) => updateUserSecurityGroup((draft) => {
                                   draft.securityGroupName = e.value;
                               })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputText type="date"
                               label="Effective from"
                               feedbackMsg={errorValidation.messages.effectiveFrom}
                               value={dateToString(userSecurityGroup?.effectiveFrom)}
                               onChange={(date: Date) => updateUserSecurityGroup((draft) => {
                                   draft.effectiveFrom = date;
                               })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8}>
                            <InputText type="date"
                                       label="Effective to"
                                       value={dateToString(userSecurityGroup?.effectiveTo)}
                                       onChange={(date: Date) => updateUserSecurityGroup((draft) => {
                                           draft.effectiveTo = date;
                                       })}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ButtonSection>
                                <>
                                    <small>
                                        <IconButton label="delete"
                                                    buttonType="tertiary"
                                                    iconName="check"
                                                    onClick={isEditSecurityGroup ? updateRow : addRow }
                                        />
                                    </small>
                                    <small>
                                        <IconButton label="cancel"
                                                    buttonType="tertiary"
                                                    iconName="x"
                                                    onClick={ cancelUpdateRow }
                                        />
                                    </small>
                                </>
                            </ButtonSection>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PanelSectionContainer>

    return (
            <FrameworkComponent
                title={`${isEdit ?  'Update' : 'Create' } OIPA User`}
                labelButtons={{ main: `${ isEdit ?  'Save' : 'Create' }`, cancel: 'Cancel' }}
                loading={loading}
                onSubmit={onClickSave}
                onCancel={closeRightbar}
            >
                <CollapseContainer title="User information" defaultOpened>
                    <PanelSectionContainer>{userInformationContent()}</PanelSectionContainer>
                </CollapseContainer>

                <CollapseContainer title="Login">
                    <PanelSectionContainer>{loginContent()}</PanelSectionContainer>
                </CollapseContainer>

                <CollapseContainer title="Company">
                    <CompanyContent />
                </CollapseContainer>

                <CollapseContainer title="Security group">
                    <>
                        { isShowFormRowTable && <SecurityGroupRowContent/> }
                        <DataTable
                            columns={columns}
                            data={userSession.userSecurityGroups}
                            keyColumn='securityGroupGuid'
                            hasSearchBar={false}
                            actions={
                                <Button buttonType="tertiary"
                                        onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
                                        { e.preventDefault(); setIsShowFormRowTable( true)}}>
                                    + Add Row
                                </Button>
                            }
                        />
                    </>
                </CollapseContainer>
            </FrameworkComponent>
    );
}

UserOipa.defaultProps = {
    oipaUserService: defaultOipaUserService,
    companyService: defaultCompanyService,
    codeService: defaultCodeService
};

export default UserOipa;