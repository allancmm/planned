import { CollapseContainer, Loading, Select, TextInput, useLoading } from 'equisoft-design-ui-elements';
import React, {ChangeEvent, useContext, useEffect, useRef, useState} from 'react';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { defaultCompanyService, defaultDataDictionaryService } from '../../../lib/context';
import CompanyList from '../../../lib/domain/entities/companyList';
import DataDictionarySelectable from '../../../lib/domain/entities/dataDictionarySelectable';
import CategorySession from '../../../lib/domain/entities/tabData/categorySession';
import DataModelSession from '../../../lib/domain/entities/tabData/dataModelSession';
import CompanyService from '../../../lib/services/companyService';
import DataDictionaryService from '../../../lib/services/dataDictionaryService';
import withLongJob from '../../general/longJob';
import {
    DataManagementFormContainer,
    EntityLevelContainer,
    SearchBarMenu,
    SearchButton,
    SearchFieldIcon,
    SearchFieldWrapper,
    SearchResultsWrapper,
    FieldFormWrapper
} from '../style';
import PopOverMenu, { ButtonAction } from "../../../components/general/popOverMenu";

interface DataDictionaryManagerProps {
    dataDictionaryService: DataDictionaryService;
    companyService: CompanyService;
}

export const DataDictionary = ({ dataDictionaryService, companyService }: DataDictionaryManagerProps) => {
    const { openRightbar } = useContext(RightbarContext);

    const [loading, load] = useLoading();
    const [companies, setCompanies] = useState(CompanyList.empty());
    const [products, setProducts] = useState<DataDictionarySelectable[]>([]);
    const [plans, setPlans] = useState<DataDictionarySelectable[]>([]);
    const [categories, setCategories] = useState<DataDictionarySelectable[]>([]);
    const [company, setCompany] = useState<string>('');
    const [product, setProduct] = useState<string>('');
    const [fieldName, setFieldName] = useState<string>('');
    const [openAction, setOpenAction] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(true);

    const [, , displayJobLog, startPollingWithAction] = withLongJob();
    useEffect(() => {
        setEntities();
    }, []);

    const dispatch = useTabActions();

    const setEntities = load(async () => {
        const list = await companyService.getSubAndPrimaryCompanyList();
        setCompanies(list);
    });

    const handleSelectCompany = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const companyGuid = e.target.value;
        setCompany(companyGuid);
        const productsList = await dataDictionaryService.getProducts(companyGuid);
        const plansList = await dataDictionaryService.getPlans(companyGuid, 'company');
        const categoryList = await dataDictionaryService.getCategoriesByEntityAndGuid(companyGuid, 'company');
        setProducts(productsList);
        setPlans(plansList);
        setCategories(categoryList);
    });

    const handleSelectProduct = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const productGuid = e.target.value;
        setProduct(productGuid);
        const plansList = await dataDictionaryService.getPlans(productGuid, 'prduct');
        const categoryList = await dataDictionaryService.getCategoriesByEntityAndGuid(productGuid, 'product');
        setCategories(categoryList);
        setPlans(plansList);
    });

    const handleSelectPlan = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const planGuid = e.target.value;
        const categoryList =
            company === 'All' && planGuid === 'All' && product === 'All'
                ? await dataDictionaryService.getCategories()
                : await dataDictionaryService.getCategoriesByEntityAndGuid(planGuid, 'plan');
        setCategories(categoryList);
    });

    const handleSelectCategory = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const category = e.target.value;
        const session = new CategorySession();
        session.categoryPath = 'category';
        session.categoryGuid = category;
        dispatch({ type: OPEN, payload: { data: session } });
    });

    const foundDataModels = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const session = new DataModelSession();
        session.dataModelPath = 'dataModel';
        session.dataModelGuid = fieldName;
        dispatch({ type: OPEN, payload: { data: session } });
    });

    const generateDataDictionary = load(async (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenAction(false);
        startPollingWithAction(dataDictionaryService.generateDataDictionary);
    });

    const openExportDataDictionary = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        e.stopPropagation();
        openRightbar('Export_Data_Dictionary');
        setOpenAction(false);
    }

    const itemsMenuAction =
        [{ label: 'Generate Data Dictionary',
          onClick: generateDataDictionary,
        },
        { label: 'Export Data Dictionary',
          onClick: openExportDataDictionary
        }];


    const handleClose = (_:  React.MouseEvent<Document, MouseEvent>) => {
        setOpenAction(false);
    };

    return (
        <CollapseContainer
            title="Data Dictionary"
            open={isOpen}
            toggleOpen={() => setIsOpen((prevState) => {
                if(prevState) {
                    setOpenAction(false);
                }
                return !prevState;
            })}
            actions={<ButtonAction
                        type='secondary'
                        anchorRef={anchorRef}
                        openAction={openAction}
                        onClick={() => {
                            setOpenAction((isPrevOpen) => !isPrevOpen);
                            setIsOpen(true);
                        }}
                        disabled={loading}
                    />}
        >
            <>
                <Loading loading={loading} />
                <DataManagementFormContainer id="SearchForm">
                    <EntityLevelContainer>
                        <>
                            {displayJobLog}
                            <SearchResultsWrapper>
                                <SearchFieldWrapper>
                                    <SearchFieldIcon />
                                    <SearchBarMenu>
                                        <TextInput
                                            placeholder="Search"
                                            value={fieldName}
                                            onChange={(e) => setFieldName(e.target.value)}
                                        />
                                    </SearchBarMenu>
                                </SearchFieldWrapper>
                                <SearchButton onClick={foundDataModels}>Search</SearchButton>
                            </SearchResultsWrapper>
                            <FieldFormWrapper>
                                <Select
                                    label="Company"
                                    emptySelectText="Select One"
                                    options={companies.companies.map((e) => ({
                                        label: e.companyName,
                                        value: e.companyGuid,
                                    }))}
                                    onChange={handleSelectCompany}
                                />
                            </FieldFormWrapper>
                            {company.length > 0 && (
                                <FieldFormWrapper>
                                    <Select
                                        label="Products"
                                        emptySelectText="Select One"
                                        options={products.map((e) => ({
                                            label: e.displayName,
                                            value: e.guid,
                                        }))}
                                        onChange={handleSelectProduct}
                                    />
                                </FieldFormWrapper>
                            )}
                            {company.length > 0 && (
                               <FieldFormWrapper>
                                   <Select
                                       label="Plans"
                                       emptySelectText="Select One"
                                       options={plans.map((e) => ({
                                           label: e.displayName,
                                           value: e.guid,
                                       }))}
                                       onChange={handleSelectPlan}
                                   />
                               </FieldFormWrapper>
                            )}
                            {company.length > 0 && (
                                <FieldFormWrapper>
                                    <Select
                                        label="Categories"
                                        emptySelectText="Select One"
                                        options={categories.map((e) => ({
                                            label: e.displayName,
                                            value: e.guid,
                                        }))}
                                        onChange={handleSelectCategory}
                                    />
                                </FieldFormWrapper>
                            )}
                        </>
                    </EntityLevelContainer>
                </DataManagementFormContainer>

                <PopOverMenu openAction={openAction}
                             setOpenAction={setOpenAction}
                             anchorRef={anchorRef}
                             itemsMenu={itemsMenuAction}
                             handleClose={handleClose}
                />
            </>
        </CollapseContainer>
    );
};

DataDictionary.defaultProps = {
    dataDictionaryService: defaultDataDictionaryService,
    companyService: defaultCompanyService,
};

export default DataDictionary;
