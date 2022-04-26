
export default abstract class Comment {
    uuid = '';
    time = new Date();
    type : CommentType = '';
    value = '';
}

export type CommentType = 'XML' |  'INFO' | 'ERROR' | '';