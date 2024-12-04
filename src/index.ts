import { Project } from 'ts-morph';
import { MergeConfig, config } from './config/config';
import { hasRequiredImports, hasRequiredProviders } from './checkImports_Provider';
import { extractValidationLogic } from './extractValidationLogic';
import { extractClassProperties, extractConstructor } from './classUtils';
import { copyImports } from './mergeImports';

/*
Merges validation logic from the template file into the user file.
 */
function mergeValidationLogic(config: MergeConfig): void {
    console.log('Starting mergeValidationLogic...');
    console.log('Template file path:', config.templateFilePath);
    console.log('User file path:', config.userFilePath);

    const project = new Project();
    const templateFile = project.addSourceFileAtPath(config.templateFilePath);
    const userFile = project.addSourceFileAtPath(config.userFilePath);

    if (!hasRequiredImports(userFile, config) || !hasRequiredProviders(userFile, config)) {
        console.log('Error: Required imports or providers not found in the target file.');
        return;
    }

    const templateClass = templateFile.getClasses()[0];
    console.log('Template class found:', templateClass.getName());

    const validationLogic = extractValidationLogic(templateClass, config);
    console.log('Validation logic extracted:', validationLogic);

    copyImports(templateFile, userFile);

    const userClass = userFile.getClassOrThrow(config.userClassName);
    console.log('User class found:', userClass.getName());

    // Optionally extract and log class properties
    if (config.mergeProperties) {
        const classProperties = extractClassProperties(templateClass);
        console.log('Class properties extracted:', classProperties);
    }

    // Optionally extract and log constructor
    if (config.mergeConstructor) {
        const constructor = extractConstructor(templateClass);
        console.log('Constructor extracted:', constructor);
    }

    // Add validation logic as a new method
    userClass.addMethod({
        name: config.newMethodName,
        statements: validationLogic
    });
    console.log(`Added ${config.newMethodName} method to user class.`);

    // Ensure validation logic is called in ngOnInit
    const ngOnInit = userClass.getMethod('ngOnInit');
    if (ngOnInit) {
        ngOnInit.addStatements(config.newMethodCall);
        console.log(`Added ${config.newMethodCall} call to existing ngOnInit method.`);
    } else {
        userClass.addMethod({
            name: 'ngOnInit',
            statements: config.newMethodCall
        });
        console.log(`Created new ngOnInit method with ${config.newMethodCall} call.`);
    }

    // Save the updated user file
    userFile.saveSync();
    project.saveSync();
    console.log('User file saved successfully.');
}

// Use the configuration from config.ts
mergeValidationLogic(config);