import React, { ReactElement } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DesignThemeProvider } from 'equisoft-design-ui-elements';
import { DesignSystem } from "@equisoft/design-elements-react";
import { editor } from 'monaco-editor';
import { anyString, anything, instance, mock, reset, verify, when } from 'ts-mockito';
import FileHeader from '.';
import ConfigPackage from '../../../lib/domain/entities/configPackage';
import ConfigPackageList from '../../../lib/domain/entities/configPackageList';
import EntityStatus, { ScmStatusType } from '../../../lib/domain/entities/entityStatus';
import OipaRule from '../../../lib/domain/entities/oipaRule';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import ValidateVersionResponse from '../../../lib/domain/entities/validateVersionResponse';
import ConfigPackageService from '../../../lib/services/configPackageService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import SourceControlService from '../../../lib/services/sourceControlService';
import TabProvider from '../tabs/tabContext';
import { LayoutItem, OPEN, STATUS_CHANGED, Store, TabItem } from '../tabs/tabReducerTypes';

const mockedStore = mock(Store);
const mockedTabItem = mock(TabItem);
const mockedScmService = mock(SourceControlService);
const mockedEntityInfService = mock(EntityInformationService);
const mockConfigPackageService = mock(ConfigPackageService);

const dispatch = jest.fn();

const renderWithTabContext = async (ui: ReactElement, { state = instance(mockedStore), ...options }: any = {}) => {
    const wrapper = (props: any) =>
            <DesignThemeProvider>
                <DesignSystem>
                    <TabProvider value={{ state, dispatch }} {...props} />
                </DesignSystem>
            </DesignThemeProvider>;

    const r = render(ui, { wrapper, ...options });
    await waitFor(() => {});
    return r;
};

/* const renderModal = async (configPackageList: ConfigPackageList) => {
    const wrapper = () =>
        <DesignThemeProvider>
            <DesignSystem>
                <ModalPackages
                    isOpen={true}
                    onConfirmPackage={() => {}} // checkIn(true)}
                    packages={configPackageList.packages}
                    selectedPackage={new ConfigPackage()}
                    comment={''}
                    onRequestClose={() => {}}
                    setSelectedPackage={() => {}}
                    setComment={() => {}}
                    createNewPackage={() => {}}
                    onSkipPackage={() => {}}
                />
            </DesignSystem>
        </DesignThemeProvider>;

    const r = render(<></>, { wrapper });
    await waitFor(() => {});
    return r;
}; */

describe('<FileHeader />', () => {
    let scmService: SourceControlService;
    let entityInfService: EntityInformationService;
    let state: Store;
    let tabItem: TabItem;
    const tabId = 'test';

    beforeEach(() => {
        scmService = instance(mockedScmService);
        entityInfService = instance(mockedEntityInfService);
        state = instance(mockedStore);
        tabItem = instance(mockedTabItem);

        when(mockedStore.tabs).thenReturn({ [tabId]: tabItem });
        when(mockedStore.layouts).thenReturn({ 0: instance(mock(LayoutItem)) });
        when(mockedStore.focusLayout).thenReturn(0);
    });
    afterEach(() => {
        reset(mockedScmService);
        reset(mockedEntityInfService);
        reset(mockConfigPackageService);
        reset(mockedStore);
        reset(mockedTabItem);
    });

    const getData = (statusType: ScmStatusType): EntityInformation => {
        const data = new EntityInformation();
        const status = new EntityStatus();
        status.status = statusType;
        data.status = status;
        return data;
    };

    test('should render without crashing', async () => {
        const data = getData('checkIn');
        when(mockedTabItem.data).thenReturn(data);
        data.fileType = 'XML_DATA';
        const { getByText } = await renderWithTabContext(
            <FileHeader
                tabId={tabId}
                sourceControlService={scmService}
                entityInformationService={entityInfService}
                toggleDebug={() => {}}
            />,
            { state },
        );

        expect(getByText(/Status/)).toBeInTheDocument();
        expect(getByText('Check out')).toBeInTheDocument();
    });

    test('should render checkIn without crashing', async () => {
        const data = getData('checkOut');
        when(mockedTabItem.data).thenReturn(data);

        const { getByText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        expect(getByText('Check In')).toBeInTheDocument();
    });

    // OIPATLS-4412: Test skiped because of an error in EquisoftDesign component. An email has been sent, waiting for answer.
    test.skip('should render a goTo dropdown when there is multiple files', async () => {
        const data = new EntityInformation();
        const copyBooks = new OipaRule();
        copyBooks.entityType = 'COPYBOOKS';
        copyBooks.ruleName = 'copyBook';

        const functions = new OipaRule();
        functions.entityType = 'FUNCTIONS';
        functions.ruleName = 'function';

        const attachedRules = new OipaRule();
        attachedRules.entityType = 'ATTACHED_RULES';
        attachedRules.ruleName = 'attachedRule';

        data.relatedEntities = [copyBooks, functions, attachedRules];
        when(mockedTabItem.data).thenReturn(data);

        const { getByText, getByLabelText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        expect(getByLabelText(/Go to/)).toBeInTheDocument();
        expect(getByText('copyBook')).toBeInTheDocument();
        expect(getByText('function')).toBeInTheDocument();
        expect(getByText('attachedRule')).toBeInTheDocument();
    });

    test.skip('should open a new relatedFile when selecting a file', async () => {
        const data = new EntityInformation();
        const copyBooks = new OipaRule();
        copyBooks.entityType = 'COPYBOOKS';
        copyBooks.ruleName = 'copyBook';
        copyBooks.ruleGuid = 'aCopyBookGuid';

        const functions = new OipaRule();
        functions.entityType = 'FUNCTIONS';
        functions.ruleName = 'function';
        functions.ruleGuid = 'aFunctionGuid';

        const attachedRules = new OipaRule();
        attachedRules.entityType = 'ATTACHED_RULES';
        attachedRules.ruleName = 'attachedRule';
        attachedRules.ruleGuid = 'anAttachedRuleGuid';

        data.relatedEntities = [copyBooks, functions, attachedRules];
        when(mockedTabItem.data).thenReturn(data);

        const otherData = new EntityInformation();
        when(mockedEntityInfService.getEntityInformation(anyString(), anyString(), anyString())).thenResolve(otherData);

        const { getByLabelText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        // Open copyBook
        fireEvent.change(getByLabelText(/Go to/), { target: { value: 'aCopyBookGuid' } });
        await waitFor(() => {});

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({ type: OPEN, payload: { data: otherData } });

        verify(mockedEntityInfService.getEntityInformation('BUSINESS_RULES', 'aCopyBookGuid', 'XML_DATA')).once();
        await waitFor(() => {});

        // Open function
        dispatch.mockClear();
        fireEvent.change(getByLabelText(/Go to/), { target: { value: 'aFunctionGuid' } });
        await waitFor(() => {});

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({ type: OPEN, payload: { data: otherData } });

        verify(mockedEntityInfService.getEntityInformation('BUSINESS_RULES', 'aFunctionGuid', 'XML_DATA')).once();
        await waitFor(() => {});

        // Open attached rule
        dispatch.mockClear();
        fireEvent.change(getByLabelText(/Go to/), { target: { value: 'anAttachedRuleGuid' } });
        await waitFor(() => {});

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({ type: OPEN, payload: { data: otherData } });

        verify(mockedEntityInfService.getEntityInformation('BUSINESS_RULES', 'anAttachedRuleGuid', 'XML_DATA')).once();
    });

    test.skip('should render a linkedFiles dropdown when there is multiple files', async () => {
        const data = new EntityInformation();
        data.oipaRule.linkedFiles = ['XML_DATA', 'XSLT'];
        when(mockedTabItem.data).thenReturn(data);

        const { getByText, getByLabelText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        expect(getByLabelText(/Linked Files/)).toBeInTheDocument();
        expect(getByText('XML_DATA')).toBeInTheDocument();
        expect(getByText('XSLT')).toBeInTheDocument();
    });

    test.skip('should open a new linkedFile when selecting a file', async () => {
        const data = new EntityInformation();
        data.oipaRule.linkedFiles = ['XML_DATA', 'XSLT'];
        when(mockedTabItem.data).thenReturn(data);
        const otherData = new EntityInformation();
        when(mockedEntityInfService.getEntityInformation(anyString(), anyString(), anyString())).thenResolve(otherData);

        const { getByLabelText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        fireEvent.change(getByLabelText(/Linked Files/), { target: { value: 'XSLT' } });
        await waitFor(() => {});

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({ type: OPEN, payload: { data: otherData } });

        verify(mockedEntityInfService.getEntityInformation(anyString(), anyString(), 'XSLT')).once();
    });

    test.skip('should do nothing if the user selects the currently opened file', async () => {
        const data = new EntityInformation();
        data.fileType = 'XML_DATA';
        data.oipaRule.linkedFiles = ['XML_DATA', 'XSLT'];
        when(mockedTabItem.data).thenReturn(data);

        const { getByLabelText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        fireEvent.change(getByLabelText(/Linked Files/), { target: { value: 'XML_DATA' } });
        await waitFor(() => {});

        expect(dispatch).not.toHaveBeenCalled();
        verify(mockedEntityInfService.getEntityInformation(anyString(), anyString(), anyString())).never();
    });

    test('should try to checkout the rule when pressing the button', async () => {
        const data = getData('checkIn');
        when(mockedTabItem.data).thenReturn(data);
        when(mockedEntityInfService.validateVersion(data.entityType, data.oipaRule.ruleGuid, data.fileType, data.getChecksum())).thenResolve(new ValidateVersionResponse())
        const { getByText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        const checkedOutStatus = new EntityStatus();
        checkedOutStatus.status = 'checkOut';
        when(mockedScmService.checkOut(data.getType(), data.getGuid())).thenResolve(checkedOutStatus);
        fireEvent.click(getByText('Check out'));
        await waitFor(() => {});

        verify(mockedScmService.checkOut(data.getType(), data.getGuid())).once();
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({
            type: STATUS_CHANGED,
            payload: { guid: '', status: checkedOutStatus },
        });
    });

    test.skip('should try to checkin the rule when pressing the button', async () => {
        const data = new EntityInformation();
        when(mockedTabItem.data).thenReturn(data);
        const mockedModel = mock<editor.ITextModel>();
        const model = instance(mockedModel);
        when(mockedTabItem.model).thenReturn([model]);
        when(mockedModel.getValue()).thenReturn('<test></test>');

        const { getByText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        const configPackageList = new ConfigPackageList();
        configPackageList.packages = [new ConfigPackage()];
        when(mockConfigPackageService.getOpenedPackage()).thenResolve(configPackageList);
        // const { getModal } = await renderModal(configPackageList);

        const checkedInStatus = new EntityStatus();
        checkedInStatus.status = 'checkIn';
        when(mockedScmService.checkIn(anyString(), anyString(), anything())).thenResolve(checkedInStatus);

        fireEvent.click(getByText('Check in'));
        await waitFor(() => {});

        // fireEvent.click(getModal('Confirm'));
        // await waitFor(() => {});

        verify(mockedScmService.checkIn(anyString(), anyString(), anything())).once();
        expect(dispatch).toHaveBeenCalledTimes(2); // status_changed, related entities
        expect(dispatch).toHaveBeenCalledWith({
            type: STATUS_CHANGED,
            payload: { guid: '', status: checkedInStatus },
        });
    });

    test('should try to undo checkout the rule when pressing the button', async () => {
        const data = getData('checkOut');
        when(mockedTabItem.data).thenReturn(data);

        const { getByText } = await renderWithTabContext(
            <FileHeader tabId={tabId} sourceControlService={scmService} entityInformationService={entityInfService} />,
            { state },
        );

        const newData = new EntityInformation();
        newData.dataString = 'different content';
        when(mockedScmService.undoCheckOut(data.getType(), data.getGuid())).thenResolve();
        when(mockedEntityInfService.getEntityInformation(anyString(), anyString(), anyString())).thenResolve(newData);
        fireEvent.click(getByText('Undo'));
        await waitFor(() => {});

        verify(mockedScmService.undoCheckOut(data.getType(), data.getGuid())).once();
        verify(mockedEntityInfService.getEntityInformation(anyString(), anyString(), anyString())).once();

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({
            type: OPEN,
            payload: { data: newData, reloadContent: true },
        });
    });
});
