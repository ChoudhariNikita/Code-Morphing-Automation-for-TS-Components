import { ClassDeclaration } from 'ts-morph';
import { MergeConfig } from './config/config';

/*
Extracts the validation logic from the given class declaration based on the criteria specified in the configuration.
 */
export function extractValidationLogic(classDecl: ClassDeclaration, config: MergeConfig): string {
    const methods = classDecl.getMethods();
    for (const method of methods) {
        const body = method.getBodyText();
        if (body && body.includes(config.validationLogicCriteria)) {
            console.log('Validation logic found in method:', method.getName());
            return body;
        }
    }
    throw new Error('Validation logic not found.');
}

