import XmlTemplate from "../entities/xmlTemplate";

export default interface XmlTemplateRepository {
    getTemplates(typeName: string, name?: string): Promise<XmlTemplate[]>;
}