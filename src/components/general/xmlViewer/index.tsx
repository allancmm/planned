import React from 'react';
import ReactXMLViewer from 'react-xml-viewer';
import { XmlViewerContainer} from "./style";

const customTheme = { separatorColor: '#0000ff',
    tagColor: '#863b00',
    attributeKeyColor: '#ff0000',
    attributeValueColor: '#0000ff',
    textColor: '#000000'
};

const XmlViewer = ({ xml, indentSize = 3, collapsible = false } : { xml: string, indentSize?: number, collapsible?: boolean }) =>
    <XmlViewerContainer>
        <ReactXMLViewer
            xml={xml}
            indentSize={indentSize}
            theme={customTheme}
            invalidXml={<>{xml}</>}
            collapsible={collapsible}
        />
    </XmlViewerContainer>;

export default XmlViewer;