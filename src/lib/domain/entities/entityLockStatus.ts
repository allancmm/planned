export const STATUS_UNLOCKED: string = 'unlocked';
export const STATUS_LOCKED: string = 'locked';
export default class EntityLockStatus {
    public status: typeof STATUS_UNLOCKED | typeof STATUS_LOCKED = STATUS_UNLOCKED;
    public user: string = '';
    public fullDisplay: string = '';
}
