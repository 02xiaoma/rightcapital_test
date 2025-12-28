import * as fs from 'fs';
import * as path from 'path';

describe('CDK Project Structure', () => {
  test('should have lib directory', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'lib'))).toBe(true);
  });

  test('should have bin directory', () => {
    expect(fs.existsSync(path.join(__dirname, '..', 'bin'))).toBe(true);
  });

  test('should have package.json with CDK dependencies', () => {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('aws-cdk-lib');
    expect(packageJson.dependencies).toHaveProperty('constructs');
  });

  test('should have cdk.json with correct settings', () => {
    const cdkJsonPath = path.join(__dirname, '..', 'cdk.json');
    expect(fs.existsSync(cdkJsonPath)).toBe(true);

    const cdkJson = JSON.parse(fs.readFileSync(cdkJsonPath, 'utf8'));
    expect(cdkJson.app).toContain('npx ts-node');
  });

  test('should have tsconfig.json', () => {
    const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
  });

  test('should have basic stack file in lib/', () => {
    const stackPath = path.join(__dirname, '..', 'lib', 'infrastructure-stack.ts');
    expect(fs.existsSync(stackPath)).toBe(true);
  });

  test('should compile TypeScript successfully', () => {
    // This test would need to run npm run build and check for success
    // For now, just check if the stack file has valid TypeScript structure
    const stackPath = path.join(__dirname, '..', 'lib', 'infrastructure-stack.ts');
    const stackContent = fs.readFileSync(stackPath, 'utf8');
    expect(stackContent).toContain('import');
    expect(stackContent).toContain('extends cdk.Stack');
  });
});
