# Code Morphing Automation for TypeScript Components

This project is designed to automate the merging of code from a defined template TypeScript file into a user file while maintaining validation for essential components like imports, methods, and class names. The project leverages the `ts-morph` library for manipulating and transforming TypeScript code programmatically.


## Features

- **Code Extraction**: Identifies and extracts specific methods, logic, or validation patterns (e.g., Angular `FormGroup` initialization).
- **Code Merging**: Incorporates the extracted logic into the target user file while maintaining existing code integrity.
- **Import Validation**: Automatically ensures required imports from the template file are added to the user file.
- **Initialization Hook**: Inserts method calls into the `ngOnInit` lifecycle hook to ensure the new functionality is properly executed.
- **Customization**: The merging process can be tailored by editing the configuration file.

## Getting Started

### Prerequisites

- Node.js and npm should be installed on your system.


### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd node-project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```


### Code Explanation

Here’s a breakdown of the primary steps involved in the merging process:

1. **Loading Files**:
   - The program uses `ts-morph` to load the template file and user file.
   - These files are read into the project using their respective file paths.

2. **Extracting Validation Logic**:
   - The `extractValidationLogic` function scans the template class to find methods containing Angular `FormGroup` logic.
   - Specifically, it looks for a method where `this.fb.group` is used and extracts the code block.

3. **Merging Logic into Template**:
   - The extracted logic is added to the user file as a new method called `initializeRegistrationForm`.
   - This ensures that the core logic from the template file is available in the user class.

4. **Validating and Adding Imports**:
   - Imports from the template file are compared with those in the user file.
   - Missing imports are automatically appended at the top of the user file to ensure the new code compiles correctly.

5. **Updating Lifecycle Hooks**:
   - If the `ngOnInit` method exists in the user class, the `initializeRegistrationForm` method is called from it.
   - If `ngOnInit` does not exist, it is created and includes the necessary call to `initializeRegistrationForm`.

6. **Saving Changes**:
   - The modified user file is saved back to the filesystem.
   - Changes are persistent and ready for further development or testing.


### Configuration

The project uses a configuration file located at `src/config/config.ts`. Modify this file to customize:
- **File Paths**: Paths for user and template files.
- **Imports**: Additional imports required for the merging process.
- **Method Names**: Names of methods or hooks to be modified.


### Usage

Run the project using the following command:
```bash
npx ts-node src/index.ts
```
This will:
1. Extract the validation logic from the template file.
2. Merge it into the user file.
3. Update lifecycle hooks and imports as needed.
4. Save the updated user file.


## Example Input and Output

### Template File (`Registration.component.ts`):
```typescript
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      // Other form fields...
    });
  }
}
```

### User File (`TestLoadProgram.component.ts`) After Merging:
```typescript
@Component({
  selector: 'app-test-load-program',
  templateUrl: './test-load-program.component.html',
  styleUrls: ['./test-load-program.component.scss']
})
export class TestLoadProgram implements OnInit {
  constructor() {}

  initializeRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      title: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      // Other form fields...
    });
  }

  ngOnInit(): void {
    this.initializeRegistrationForm();
  }
}
```


### Dependencies

- **`ts-morph`**: A TypeScript library for programmatically creating and manipulating TypeScript/JavaScript code.

Install it via npm:
```bash
npm install ts-morph
```

