import { SourceFile } from 'ts-morph';
import { MergeConfig } from './config/config';

/**
 * Checks if the target file contains the required imports specified in the configuration.
 */
export function hasRequiredImports(targetFile: SourceFile, config: MergeConfig): boolean {
    const importDeclarations = targetFile.getImportDeclarations();
    console.log('Total import declarations found:', importDeclarations.length);

    for (const requiredImport of config.requiredImports) {
        const importFound = importDeclarations.some((importDecl) =>
            importDecl.getModuleSpecifierValue() === requiredImport.moduleSpecifier &&
            requiredImport.namedImports.every((namedImport) =>
                importDecl.getNamedImports().some((imported) => imported.getName() === namedImport)
            )
        );

        if (!importFound) {
            console.log(`Required import not found: ${requiredImport.moduleSpecifier}`);
            return false;
        }
    }

    console.log('All required imports found');
    return true;
}

/**
 * Checks if the target file contains the required providers specified in the configuration.
 */
export function hasRequiredProviders(targetFile: SourceFile, config: MergeConfig): boolean {
    const classes = targetFile.getClasses();
    for (const classDecl of classes) {
        const decorator = classDecl.getDecorator('Component');
        if (decorator) {
            const decoratorCall = decorator.getCallExpression();
            if (decoratorCall) {
                const [decoratorArg] = decoratorCall.getArguments();
                if (decoratorArg && decoratorArg.getKindName() === 'ObjectLiteralExpression') {
                    const providersProperty = (decoratorArg as any).getProperty('providers');
                    if (providersProperty) {
                        const providersText = providersProperty.getText();
                        if (config.requiredProviders.every(provider => providersText.includes(provider))) {
                            console.log('All required providers found in component');
                            return true;
                        }
                    }
                }
            }
        }
    }

    console.log('Required providers not found in component');
    return false;
}

