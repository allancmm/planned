import { ApiGateway } from "../config/apiGateway";
import XmlTemplate from "../../domain/entities/xmlTemplate";

export default class XmlTemplateApiRepository implements XmlTemplateApiRepository {
    constructor (private api: ApiGateway) {}

    getTemplates = async (typeName: string, name: string): Promise<XmlTemplate[]> => {
      return this.api.getArray(
          `/xml/templates?typeName=${typeName}&name=${name}`, 
          { outType: XmlTemplate},
      );
    };
}
