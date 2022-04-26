import { useState } from "react";
import ReviewComment from "../../../lib/domain/entities/reviewComment";
import { useLoading} from "equisoft-design-ui-elements";
import ConfigPackageService from "../../../lib/services/configPackageService";

const useConfigPackageCommentLogic = (configPackageService: ConfigPackageService, configPackageGuid: string, callback: () => void ) => {
    const [loading, load] = useLoading();
    const [comments, setComments] = useState('');

    const onChange = (value: string) => {
        setComments(value);
    }
    const addComment = load(async () => {
        const newReviewComment = new ReviewComment();
        newReviewComment.configPackageGuid = configPackageGuid;
        newReviewComment.content = comments;
        await configPackageService.addRuleComment(newReviewComment);
        typeof callback === 'function' && callback();

    });

    return {
        loading,
        comments,
        addComment,
        onChange,
    };
}

export default useConfigPackageCommentLogic;