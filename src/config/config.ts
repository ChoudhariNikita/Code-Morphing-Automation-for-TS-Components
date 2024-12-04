export interface MergeConfig {
    requiredImports: {
        moduleSpecifier: string;
        namedImports: string[];
    }[];
    requiredProviders: string[];
    validationLogicCriteria: string;
    templateFilePath: string;
    userFilePath: string;
    userClassName: string;
    newMethodName: string;
    newMethodCall: string;
    mergeProperties?: boolean;
    mergeConstructor?: boolean;
}

export const config: MergeConfig = {
    requiredImports: [
        {
            moduleSpecifier: '@magic-xpa/angular',
            namedImports: ['TaskBaseMagicComponent', 'magicProviders']
        }
    ],
    requiredProviders: ['[...magicProviders]'],
    validationLogicCriteria: 'this.fb.group',
    templateFilePath: 'C:/Users/nikita/Desktop/Task/Morphing/Registration Component/Registration.component.ts',
    userFilePath: 'C:/Users/nikita/Desktop/Task/Morphing/Angular Sample Component/src/app/magic/TestLoadModule/TestLoadProgram/TestLoadProgram.component.ts',
    userClassName: 'TestLoadProgram',
    newMethodName: 'initializeRegistrationForm',
    newMethodCall: 'this.initializeRegistrationForm();',
    mergeProperties: false,
    mergeConstructor: false
};