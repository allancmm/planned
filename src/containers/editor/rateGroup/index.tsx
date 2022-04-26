import {WindowContainer} from 'equisoft-design-ui-elements';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import {FileHeaderContainer} from '../../../components/editor/fileHeader/style';
import {useTabWithId} from '../../../components/editor/tabs/tabContext';
import {defaultRateService} from '../../../lib/context';
import Rate from '../../../lib/domain/entities/rate';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import Pageable from '../../../lib/domain/util/pageable';
import RateService from '../../../lib/services/rateService';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';

interface RateListProps {
    tabId: string;
    rateService: RateService;
}

const TabRateGroup = ({ tabId, rateService }: RateListProps) => {
    const tab = useTabWithId(tabId);
    const [page, setPage] = useState(Pageable.withPageOfSize());
    const [rateList, setRateList] = useState<Rate[]>([]);
    const {data} = tab;

    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const {rateGroup} = data;

    useEffect(() => {
        fetchRates(page);
    }, [page]);

    const fetchRates = async (newPage: Pageable): Promise<any> => {
        const ratesPage = await rateService.getRatesPage(rateGroup.rateGroupGuid, newPage);
        page.totalElements = ratesPage.page.totalElements;
        setRateList([...ratesPage.rates]);
    };

    const dateCriteriaCell = (row: Rate): React.ReactNode => {
        return <div>
            { row.dateCriteria ? row.dateCriteria : '' }
        </div>;
    };

    const columns: DataTableColumn[] = [
        {name: rateGroup.criteria1 + ' (Criteria 1)', selector: 'criteria1'}
    ];
    rateGroup.criteria2 && columns.push({name: rateGroup.criteria2 + ' (Criteria 2)', selector: 'criteria2'});
    rateGroup.criteria3 && columns.push({name: rateGroup.criteria3 + ' (Criteria 3)', selector: 'criteria3'});
    rateGroup.criteria4 && columns.push({name: rateGroup.criteria4 + ' (Criteria 4)', selector: 'criteria4'});
    rateGroup.criteria5 && columns.push({name: rateGroup.criteria5 + ' (Criteria 5)', selector: 'criteria5'});
    rateGroup.criteria6 && columns.push({name: rateGroup.criteria6 + ' (Criteria 6)', selector: 'criteria6'});
    rateGroup.criteria7 && columns.push({name: rateGroup.criteria7 + ' (Criteria 7)', selector: 'criteria7'});
    rateGroup.criteria8 && columns.push({name: rateGroup.criteria8 + ' (Criteria 8)', selector: 'criteria8'});
    rateGroup.criteria9 && columns.push({name: rateGroup.criteria9 + ' (Criteria 9)', selector: 'criteria9'});
    rateGroup.criteria10 && columns.push({name: rateGroup.criteria10 + ' (Criteria 10)', selector: 'criteria10'});
    columns.push(
        {name: rateGroup.integerCriteria + ' (Integer Criteria)', selector: 'integerCriteria'},
        {name: 'Date Criteria', selector: 'dateCriteria', cell: dateCriteriaCell},
        {name: 'Rate', selector: 'rate'});

    return (
        <WindowContainer>
            <FileHeaderContainer>
                <FileHeader tabId={tabId} />
            </FileHeaderContainer>
            <DataTable
                columns={columns}
                data={rateList}
                keyColumn={'rateGuid'}
                defaultSortColumn={'criteria1'}
                page={page}
                setPage={setPage}
            />
        </WindowContainer>
    );
};

TabRateGroup.defaultProps = {
    rateService: defaultRateService,
};

export default TabRateGroup;