<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    ooops

    <xsl:template match="foo">
        <qux>
            <xsl:copy-of select="bar"/>
        </qux>
    </xsl:template>


    <xsl:output method="xml" encoding="utf-8" indent="yes"/>


</xsl:stylesheet>
