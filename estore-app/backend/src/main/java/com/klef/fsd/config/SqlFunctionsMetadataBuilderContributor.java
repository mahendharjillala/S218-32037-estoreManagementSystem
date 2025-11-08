package com.klef.fsd.config;

import org.hibernate.boot.MetadataBuilder;
import org.hibernate.boot.spi.MetadataBuilderContributor;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

@SuppressWarnings("removal")
public class SqlFunctionsMetadataBuilderContributor implements MetadataBuilderContributor {

    @Override
    public void contribute(MetadataBuilder metadataBuilder) {
        // Register the date_format function
        metadataBuilder.applySqlFunction("date_format", 
            new StandardSQLFunction("date_format", StandardBasicTypes.STRING));
    }
}