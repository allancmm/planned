import { Type } from "class-transformer";
import Pageable from "../util/pageable";
import DisplayableStatInfos from "./displayableStatInfos";

export default class DisplayableStatInfosList {
	@Type(() => DisplayableStatInfos) public infos: DisplayableStatInfos[] = [];
	@Type(() => Pageable) public page: Pageable = Pageable.withPageOfSize();
}
