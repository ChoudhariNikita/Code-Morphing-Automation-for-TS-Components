import {  ImportDeclarationStructure, StructureKind } from 'ts-morph';

/**
 * Adds named imports to an existing import declaration.
 */
export function addNamedImports(existingImport: any, namedImports: string[], importDecl: any): void {
    const existingNamedImports = existingImport.getNamedImports().map((namedImport: any) => namedImport.getText());
    namedImports.forEach((namedImport: any) => {
        if (!existingNamedImports.includes(namedImport)) {
            const alias = importDecl.getNamedImports().find((ni: any) => ni.getText() === namedImport)?.getAliasNode();
            existingImport.addNamedImport(alias ? { name: namedImport, alias: alias.getText() } : { name: namedImport });
        }
    });
}

/**
 * Copies imports from the source file to the target file, ensuring no duplicates.
 */
export function copyImports(sourceFile: any, targetFile: any): void {
    const sourceImports = sourceFile.getImportDeclarations();
    const targetImports = targetFile.getImportDeclarations();

    sourceImports.forEach((importDecl: any) => {
        const importModuleSpecifier = importDecl.getModuleSpecifierValue();
        const namedImports = importDecl.getNamedImports().map((namedImport: any) => namedImport.getText());
        const namespaceImport = importDecl.getNamespaceImport();
        const defaultImport = importDecl.getDefaultImport();

        const existingImport = targetImports.find((targetImport: any) => targetImport.getModuleSpecifierValue() === importModuleSpecifier);

        if (existingImport) {
            const existingNamedImports = existingImport.getNamedImports().map((namedImport: any) => namedImport.getText());
            const existingNamespaceImport = existingImport.getNamespaceImport();
            const existingDefaultImport = existingImport.getDefaultImport();

            if (namespaceImport && !existingNamespaceImport) {
                existingImport.addNamespaceImport(namespaceImport.getText());
            }
            if (defaultImport && !existingDefaultImport) {
                existingImport.addDefaultImport(defaultImport.getText());
            }
            addNamedImports(existingImport, namedImports, importDecl);
        } else {
            const importStructure: ImportDeclarationStructure = {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: importModuleSpecifier,
            };

            if (namespaceImport) {
                importStructure.namespaceImport = namespaceImport.getText();
            } else if (defaultImport) {
                importStructure.defaultImport = defaultImport.getText();
            } else {
                importStructure.namedImports = namedImports.map((namedImport: any) => {
                    const alias = importDecl.getNamedImports().find((ni: any) => ni.getText() === namedImport)?.getAliasNode();
                    return alias ? { name: namedImport, alias: alias.getText() } : { name: namedImport };
                });
            }

            targetFile.addImportDeclaration(importStructure);
            console.log('Added missing import:', importDecl.getText());
        }
    });
}