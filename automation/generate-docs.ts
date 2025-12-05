import * as fs from "fs";
import * as path from "path";

/**
 * @title FHEVM Documentation Generator
 * @notice Automatically generates documentation from TypeScript test files
 * @dev Parses JSDoc/TSDoc comments from test files to create GitBook-compatible
 * markdown documentation
 *
 * Features:
 * - Extracts @title, @notice, @dev tags from test descriptions
 * - Organizes documentation by @chapter tags
 * - Generates README.md with complete project overview
 * - Creates individual chapter files for GitBook
 */

interface DocSection {
  title: string;
  description: string;
  details: string;
  code?: string;
  chapters: string[];
}

interface ChapterContent {
  [chapter: string]: DocSection[];
}

/**
 * @notice Extract JSDoc comment block before a code section
 */
function extractJSDocComment(content: string, position: number): string {
  const beforeCode = content.substring(0, position);
  const commentMatch = beforeCode.match(/\/\*\*([\s\S]*?)\*\/\s*$/);
  return commentMatch ? commentMatch[1] : "";
}

/**
 * @notice Parse JSDoc tags from comment text
 */
function parseJSDocTags(comment: string): {
  title?: string;
  notice?: string;
  dev?: string;
  chapters: string[];
} {
  const tags: any = { chapters: [] };

  const titleMatch = comment.match(/@title\s+(.+)/);
  if (titleMatch) tags.title = titleMatch[1].trim();

  const noticeMatch = comment.match(/@notice\s+(.+)/);
  if (noticeMatch) tags.notice = noticeMatch[1].trim();

  const devMatch = comment.match(/@dev\s+([\s\S]+?)(?=@|$)/);
  if (devMatch) tags.dev = devMatch[1].trim().replace(/\s+/g, " ");

  const chapterMatches = comment.matchAll(/@chapter\s+(\S+)/g);
  for (const match of chapterMatches) {
    tags.chapters.push(match[1]);
  }

  return tags;
}

/**
 * @notice Parse test file and extract documentation
 */
function parseTestFile(filePath: string): DocSection[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const sections: DocSection[] = [];

  // Find all describe blocks
  const describeRegex = /describe\(['"](.*?)['"],\s*function\s*\(\)/g;
  let match;

  while ((match = describeRegex.exec(content)) !== null) {
    const describeTitle = match[1];
    const position = match.index;

    // Extract JSDoc before this describe block
    const comment = extractJSDocComment(content, position);
    const tags = parseJSDocTags(comment);

    sections.push({
      title: tags.title || describeTitle,
      description: tags.notice || "",
      details: tags.dev || "",
      chapters: tags.chapters,
    });
  }

  return sections;
}

/**
 * @notice Group sections by chapter
 */
function groupByChapter(sections: DocSection[]): ChapterContent {
  const chapters: ChapterContent = {
    overview: [],
  };

  for (const section of sections) {
    if (section.chapters.length === 0) {
      chapters.overview.push(section);
    } else {
      for (const chapter of section.chapters) {
        if (!chapters[chapter]) {
          chapters[chapter] = [];
        }
        chapters[chapter].push(section);
      }
    }
  }

  return chapters;
}

/**
 * @notice Generate README.md content
 */
function generateReadme(
  projectName: string,
  description: string,
  chapters: ChapterContent
): string {
  let readme = `# ${projectName}

${description}

## Overview

This is a comprehensive example of using FHEVM (Fully Homomorphic Encryption Virtual Machine) for building privacy-preserving smart contracts.

## What is FHEVM?

FHEVM enables smart contracts to perform computations on encrypted data without decrypting it. This example demonstrates:

- **Encryption**: How to encrypt sensitive data using FHE
- **Access Control**: Managing who can access encrypted data
- **User Decryption**: Allowing users to decrypt their own data
- **Privacy-Preserving Operations**: Performing computations on encrypted values

## Features

`;

  // Add features from overview sections
  for (const section of chapters.overview) {
    if (section.title && section.description) {
      readme += `- **${section.title}**: ${section.description}\n`;
    }
  }

  readme += `
## Project Structure

\`\`\`
├── contracts/          # Solidity smart contracts
├── test/              # Comprehensive test suite
├── scripts/           # Deployment scripts
├── automation/        # Example generation and docs tools
├── hardhat.config.ts  # Hardhat configuration
└── README.md          # This file
\`\`\`

## Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
npm test
\`\`\`

### Deploy

\`\`\`bash
# Local deployment
npm run deploy

# Sepolia testnet deployment
npm run deploy:sepolia
\`\`\`

## Key Concepts

`;

  // Add chapter summaries
  const chapterNames = Object.keys(chapters).filter((c) => c !== "overview");
  for (const chapterName of chapterNames) {
    readme += `### ${chapterName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")}

`;
    const chapterSections = chapters[chapterName];
    for (const section of chapterSections) {
      if (section.title) {
        readme += `#### ${section.title}\n\n`;
      }
      if (section.description) {
        readme += `${section.description}\n\n`;
      }
      if (section.details) {
        readme += `${section.details}\n\n`;
      }
    }
  }

  readme += `
## Testing

The test suite includes comprehensive tests for:

- Contract deployment and initialization
- Policy creation with encrypted data
- Claim submission with medical information
- Access control and authorization
- Claim review and approval workflows
- Payment processing
- Edge cases and security

Run tests with coverage:

\`\`\`bash
npm run coverage
\`\`\`

## Security Considerations

This example demonstrates privacy-preserving patterns but should not be used in production without:

1. Professional security audit
2. Comprehensive access control review
3. Gas optimization
4. Integration with real payment systems
5. Compliance with healthcare regulations (HIPAA, GDPR, etc.)

## Learn More

- [Zama FHEVM Documentation](https://docs.zama.ai/)
- [FHEVM Contracts](https://github.com/zama-ai/fhevm-contracts)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Built with ❤️ using Zama FHEVM**
`;

  return readme;
}

/**
 * @notice Generate chapter documentation files
 */
function generateChapterDocs(chapters: ChapterContent, outputDir: string): void {
  const docsDir = path.join(outputDir, "docs");

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const chapterNames = Object.keys(chapters).filter((c) => c !== "overview");

  for (const chapterName of chapterNames) {
    const sections = chapters[chapterName];
    let content = `# ${chapterName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")}

`;

    for (const section of sections) {
      content += `## ${section.title || "Section"}

`;
      if (section.description) {
        content += `${section.description}

`;
      }
      if (section.details) {
        content += `### Details

${section.details}

`;
      }
    }

    const fileName = `${chapterName}.md`;
    fs.writeFileSync(path.join(docsDir, fileName), content);
    console.log(`✓ Generated: docs/${fileName}`);
  }
}

/**
 * @notice Generate SUMMARY.md for GitBook
 */
function generateSummary(chapters: ChapterContent, outputDir: string): void {
  const docsDir = path.join(outputDir, "docs");
  let summary = `# Table of Contents

* [Introduction](../README.md)

## Chapters

`;

  const chapterNames = Object.keys(chapters).filter((c) => c !== "overview");
  for (const chapterName of chapterNames) {
    const title = chapterName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    summary += `* [${title}](${chapterName}.md)\n`;
  }

  fs.writeFileSync(path.join(docsDir, "SUMMARY.md"), summary);
  console.log(`✓ Generated: docs/SUMMARY.md`);
}

/**
 * @notice Main documentation generation function
 */
async function generateDocumentation(projectDir: string): Promise<void> {
  console.log("\n📚 Generating FHEVM Documentation...\n");

  const testDir = path.join(projectDir, "test");
  const testFiles = fs
    .readdirSync(testDir)
    .filter((f) => f.endsWith(".test.ts"));

  if (testFiles.length === 0) {
    console.log("❌ No test files found in test/ directory");
    return;
  }

  let allSections: DocSection[] = [];

  for (const testFile of testFiles) {
    const testPath = path.join(testDir, testFile);
    console.log(`📖 Parsing: ${testFile}`);

    const sections = parseTestFile(testPath);
    allSections = allSections.concat(sections);
  }

  // Group by chapter
  const chapters = groupByChapter(allSections);

  // Read project metadata
  const packageJsonPath = path.join(projectDir, "package.json");
  let projectName = "FHEVM Example";
  let description = "FHEVM Privacy-Preserving Example";

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    projectName = packageJson.name || projectName;
    description = packageJson.description || description;
  }

  // Generate README.md
  const readme = generateReadme(projectName, description, chapters);
  fs.writeFileSync(path.join(projectDir, "README.md"), readme);
  console.log(`✓ Generated: README.md`);

  // Generate chapter documentation
  generateChapterDocs(chapters, projectDir);

  // Generate GitBook summary
  generateSummary(chapters, projectDir);

  console.log(`\n✨ Documentation generated successfully!`);
  console.log(`📁 Output directory: ${projectDir}`);
  console.log(`\n📖 Files created:`);
  console.log(`   - README.md`);
  console.log(`   - docs/*.md (chapter files)`);
  console.log(`   - docs/SUMMARY.md (GitBook index)`);
}

/**
 * @notice CLI entry point
 */
async function main() {
  const projectDir = process.argv[2] || process.cwd();

  if (!fs.existsSync(projectDir)) {
    console.error(`❌ Directory not found: ${projectDir}`);
    process.exit(1);
  }

  await generateDocumentation(projectDir);

  console.log("\n💡 Pro Tip:");
  console.log("   Use GitBook or similar tools to publish your documentation!");
  console.log("   The generated docs/ folder is GitBook-compatible.\n");
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error generating documentation:");
    console.error(error);
    process.exit(1);
  });
}

export { generateDocumentation };
