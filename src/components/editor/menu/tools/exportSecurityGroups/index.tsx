import React, {ChangeEvent, useContext, useEffect, useMemo, useState} from 'react';
import { Loading, useLoading } from 'equisoft-design-ui-elements';
import { Button } from "@equisoft/design-elements-react";
import { InputText, Options } from "../../../../general";
import withLongJob from '../../../../../containers/general/longJob';
import { defaultCompanyService, defaultExportSecurityGroupsService } from '../../../../../lib/context';
import Company from '../../../../../lib/domain/entities/company';
import SecurityGroup from '../../../../../lib/domain/entities/securityGroup';
import CompanyService from '../../../../../lib/services/companyService';
import ExportSecurityGroupsService from '../../../../../lib/services/exportSecurityGroupsService';
import { RightbarContext } from '../../../../general/sidebar/rightbarContext';
import { LongJobContainer, PanelBreak, PanelContainer, PanelTitleContent} from "../../../../general/sidebar/style";

interface ExportSecurityGroupsWizardProps {
    exportSecurityGroupsService: ExportSecurityGroupsService;
    companyService: CompanyService;
}

const ExportSecurityGroupsWizard = ({
    companyService,
    exportSecurityGroupsService,
}: ExportSecurityGroupsWizardProps) => {
    useEffect(() => {
        fetchCompanies();
    }, []);

    const [loading, load] = useLoading();
    const { closeRightbar } = useContext(RightbarContext);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [company, setCompany] = useState<Company>(new Company());
    const [securityGroups, setSecurityGroups] = useState<SecurityGroup[]>([]);
    const [securityGroup, setSecurityGroup] = useState<SecurityGroup>(new SecurityGroup());
    const [fileName, setFileName] = useState<string>('');
    const [, job, displayJobLog, startPollingWithAction] = withLongJob();

    const canExport: boolean = fileName.length > 0 && job.status !== 'IN_PROGRESS';
    const renderExportButton: boolean = !(job.status === 'COMPLETED' || job.status === 'WARNINGS');

    const onSecurityGroupChange = load(async (option: Options) => {
        const securityGroupGuid: string = option.value;
        setSecurityGroup(
            securityGroups.filter((sg) => sg.securityGroupGuid === securityGroupGuid)[0] ?? new SecurityGroup(),
        );
    });

    const onCompanyChange = load(async (option: Options) => {
        const companyGuid: string = option.value;
        setSecurityGroups(await exportSecurityGroupsService.getSecurityGroups(companyGuid));
        setSecurityGroup(new SecurityGroup());
        setCompany(companies.filter((c) => c.companyGuid === companyGuid)[0] || new Company());
    });

    const onExport = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        startPollingWithAction(() =>
            exportSecurityGroupsService.exportSecurityGroupsData(
                company,
                'ALL',
                securityGroup,
                fileName,
            ),
        );
    });

    const onDownload = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        await exportSecurityGroupsService.getSecurityGroupDataAsExcel(job, fileName);
        closeRightbar();
    });

    const optionSecurityGroup = useMemo(() =>
        [ {label: 'Select security group', value: ''},
            ...securityGroups.map((sg: SecurityGroup) => ({
                label: sg.securityGroupName,
                value: sg.securityGroupGuid,
            }))], [securityGroups]);

    const fetchCompanies = load(async () => {
        setCompanies(await companyService.getPrimaryCompanies());
    });

    const optionsCompanies = useMemo(() =>
        [{label: 'Select company', value: ''},
            ...companies.map((c: Company) => ({
                label: c.companyName,
                value: c.companyGuid,
            }))], [companies]);

    return (
        <>
            <Loading loading={loading} />
            <PanelContainer>
                <PanelTitleContent>Export Security Groups</PanelTitleContent>
                <PanelBreak />

                <InputText
                    label="File name: "
                    value={fileName}
                    onChange={(e : ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
                />

                <InputText
                    type='select'
                    label="Company"
                    onChange={onCompanyChange}
                    options={optionsCompanies}
                    value={company.companyGuid}
                    required
                />

                <InputText
                    type='select'
                    label="Security Groups"
                    onChange={onSecurityGroupChange}
                    options={optionSecurityGroup}
                    value={securityGroup.securityGroupGuid}
                    required
                />

                {renderExportButton ?
                    <Button buttonType="primary" type="button" onClick={onExport} disabled={!canExport}>
                        Export
                    </Button> :  <Button type="submit" buttonType="secondary" onClick={onDownload}>
                        Download as Excel
                    </Button>
                }

                <LongJobContainer>{displayJobLog}</LongJobContainer>

            </PanelContainer>
        </>
    );
};

ExportSecurityGroupsWizard.defaultProps = {
    exportSecurityGroupsService: defaultExportSecurityGroupsService,
    companyService: defaultCompanyService,
};

export default ExportSecurityGroupsWizard;
