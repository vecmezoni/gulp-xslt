<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


    <xsl:param name="elementName">qux</xsl:param>


    <xsl:template match="foo">
        <xsl:element name="{$elementName}">
            <xsl:copy-of select="bar"/>
        </xsl:element>
    </xsl:template>


    <xsl:output method="xml" encoding="utf-8" indent="yes"/>


</xsl:stylesheet>
