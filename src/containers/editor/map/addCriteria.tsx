import { Button, Select, TextInput } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { FormEvent, useContext, useState } from 'react';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import MapCriteria from '../../../lib/domain/entities/mapCriteria';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import { MapCodeEnum } from '../../../lib/domain/enums/mapValueCode';
import MapHeader from "../../../lib/domain/entities/mapHeader";

const AddCriteria = ({ tabId }: { tabId: string }) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);

    const data = tab.data as EntityInformation;

    const [criteriaName, setCriteriaName] = useState('');
    const [criteriaTypeCode, setCriteriaTypeCode] = useState('02');

    const addCriteria = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.mapData.rows.forEach((r) => {
                        const newC = new MapCriteria();
                        newC.mapCriteriaName = criteriaName;
                        newC.mapCriteriaTypeCode = criteriaTypeCode;
                        newC.textValue = '';
                        newC.displayValue = '';
                        r.criteria.push(newC);
                    });
                    draft.mapData.headers.push(new MapHeader(criteriaName));
                }),
            },
        });
        closeRightbar();
    };

    return (
        <form onSubmit={addCriteria}>
            <TextInput
                label="Criteria Name:"
                value={criteriaName}
                onChange={(e) => setCriteriaName(e.target.value)}
                required
            />

            <Select
                label="Criterion Data Type:"
                value={criteriaTypeCode}
                options={MapCodeEnum.codes.map((c) => ({ label: c.value, value: c.code }))}
                onChange={(e) => setCriteriaTypeCode(e.target.value)}
                required
            />

            <Button type="submit" buttonType="primary">
                Add
            </Button>
        </form>
    );
};

export default AddCriteria;
