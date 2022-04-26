import XmlTemplateRepository from "../domain/repositories/xmlTemplateRepository";
import XmlTemplate from "../domain/entities/xmlTemplate";

export default class XmlTemplateService {
    constructor (private xmlTemplateRepository : XmlTemplateRepository) {}

    getTemplates = async (typeName?: string , name?: string): Promise<XmlTemplate[]> => {
        if(!typeName) {
            return Promise.resolve([]);
        }
        return this.xmlTemplateRepository.getTemplates(typeName, name);
    };
}