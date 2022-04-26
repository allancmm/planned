import { TypeCodeEnum } from './typeCodeEnum';

export const UserStatus = new TypeCodeEnum([{ code: '01', value: 'Active' }, { code: '02', value: 'Inactive' }]);

export enum UserStatusEnum {
    ACTIVE = "01",
    INACTIVE= "02",
}
