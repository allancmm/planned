import { Type } from "class-transformer";
import GitFileStatus from "./gitFileStatus";
import Pageable from "../util/pageable";

export default class GitFileStatusList {

    @Type(() => GitFileStatus)
    public gitFileStatus: GitFileStatus[] = [];

    @Type(() => Pageable)
    public page: Pageable = new Pageable();
}