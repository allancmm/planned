import {Exclude} from 'class-transformer';
import {immerable} from 'immer';
import {v4 as uuid} from 'uuid';

export default class MarketMaker {
    @Exclude()
    public static guid = '3F454136-7127-49DC-88BC-955AFCE32F86';

    [immerable] = true;

    public rowId: string = uuid();
    public marketMakerGuid: string = '';
    public marketMakerName: string = '';
    public crossRateRoundPlaces: number = 0;
    public crossRateRoundMethod: string = '';
    public crossRateCurrencyCode: string = '';
    public baseCurrencyCode: string = '';
    public calendarCode: string = '';
}
