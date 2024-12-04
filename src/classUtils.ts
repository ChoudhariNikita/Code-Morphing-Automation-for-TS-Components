import { ClassDeclaration } from 'ts-morph';

/*
 * Extracts class properties (variables) from the given class declaration.
 */
export function extractClassProperties(classDecl: ClassDeclaration): string[] {
    return classDecl.getProperties().map((prop: any) => prop.getText());
}

/*
 * Extracts the constructor and its parameters from the given class declaration.
 */
export function extractConstructor(classDecl: ClassDeclaration): string | null {
    const constructor = classDecl.getConstructors()[0];
    return constructor ? constructor.getText() : null;
}