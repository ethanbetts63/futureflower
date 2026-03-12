#!/usr/bin/env node
/**
 * Transform React.FC component definitions to plain typed function syntax.
 *
 * Patterns handled:
 * 1. const Foo: React.FC<Props> = ({ a, b }) => {   ->  const Foo = ({ a, b }: Props) => {
 * 2. const Foo: React.FC<Props> = (props) => {       ->  const Foo = (props: Props) => {
 * 3. const Foo: React.FC = () => {                   ->  const Foo = () => {
 * 4. Inline type: const Foo: React.FC<{ x: T }> = ({ x }) => {  ->  const Foo = ({ x }: { x: T }) => {
 *
 * Then optionally removes React import if React. is no longer referenced.
 */

const fs = require('fs');
const path = require('path');

const SKIP_FILES = [
  'frontend/src/components/ui/button.tsx'
];

function shouldSkip(filePath) {
  return SKIP_FILES.some(skip => filePath.replace(/\\/g, '/').endsWith(skip));
}

/**
 * Find the matching closing angle bracket for a generic type starting at position `start`
 * (the position of the opening `<`).
 * Returns the index of the closing `>`, or -1 if not found.
 */
function findMatchingAngleBracket(str, start) {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '<') depth++;
    else if (str[i] === '>') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Find the matching closing curly brace for an object starting at position `start`
 * (the position of the opening `{`).
 */
function findMatchingCurly(str, start) {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Find the matching closing paren for a param list starting at position `start`
 * (the position of the opening `(`).
 */
function findMatchingParen(str, start) {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '(') depth++;
    else if (str[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Transform all React.FC occurrences in content.
 * Returns { newContent, changed }
 */
function transformContent(content, filePath) {
  let result = content;
  let changed = false;

  // We need to find all occurrences of `: React.FC` and transform them.
  // We'll do this iteratively since replacements change string positions.

  let searchFrom = 0;
  while (true) {
    // Find next `: React.FC`
    const fcIdx = result.indexOf(': React.FC', searchFrom);
    if (fcIdx === -1) break;

    // The character right before `: React.FC` should be part of variable name
    // Make sure this is `: React.FC` not something else like `React.FC` in a type position
    // The pattern should be `identifier: React.FC`

    const afterFC = fcIdx + ': React.FC'.length;

    // Check what comes after React.FC
    let genericType = ''; // The <Props> part, or '' if no generic
    let endOfGeneric = afterFC;

    if (result[afterFC] === '<') {
      // Find matching >
      const closeAngle = findMatchingAngleBracket(result, afterFC);
      if (closeAngle === -1) {
        searchFrom = afterFC;
        continue;
      }
      genericType = result.substring(afterFC, closeAngle + 1); // includes < and >
      endOfGeneric = closeAngle + 1;
    }

    // After the generic (or React.FC), we expect ` = (`
    // There may be whitespace
    const afterGenericStr = result.substring(endOfGeneric);
    const eqMatch = afterGenericStr.match(/^(\s*=\s*)/);
    if (!eqMatch) {
      searchFrom = afterFC;
      continue;
    }

    const afterEq = endOfGeneric + eqMatch[0].length;

    // Now find the opening paren of the parameter list
    if (result[afterEq] !== '(') {
      searchFrom = afterFC;
      continue;
    }

    // Find matching closing paren
    const closeParenIdx = findMatchingParen(result, afterEq);
    if (closeParenIdx === -1) {
      searchFrom = afterFC;
      continue;
    }

    const params = result.substring(afterEq + 1, closeParenIdx); // content inside parens

    // Build replacement
    // Original: `: React.FC<Props> = (params)`
    // New:      ` = (params: Props)` or ` = (params)` if no generic

    const originalSegment = result.substring(fcIdx, closeParenIdx + 1);

    let innerType = '';
    if (genericType) {
      // Strip the < and > from genericType
      innerType = genericType.substring(1, genericType.length - 1);
    }

    let newSegment;

    if (!innerType) {
      // React.FC with no generic: just remove the type annotation entirely
      // `: React.FC = (params)` -> ` = (params)`
      newSegment = ` = (${params})`;
    } else {
      // We need to add the type to params
      const trimmedParams = params.trim();

      if (trimmedParams === '' || trimmedParams === 'props') {
        // No params or just 'props' identifier
        if (trimmedParams === 'props') {
          newSegment = ` = (props: ${innerType})`;
        } else {
          // Empty params - shouldn't type annotate an empty param
          newSegment = ` = (${params})`;
        }
      } else if (trimmedParams.startsWith('{')) {
        // Destructured params: { a, b, c }
        // We need to add `: Type` after the closing brace
        // Find the closing brace of the destructure
        const openBraceInParams = params.indexOf('{');
        // Find the matching close brace relative to params
        const closeBraceInParams = findMatchingCurly(params, openBraceInParams);

        if (closeBraceInParams === -1) {
          // Multiline destructure - the params don't contain the closing brace
          // This means the function params span multiple lines and we need to
          // handle differently - append type after the closing paren params
          // Actually in this case closeParenIdx already found the right place
          // params = everything between ( and )
          // We add `: Type` to the last non-whitespace position before )
          // But the closing } should be inside params if findMatchingParen worked correctly
          newSegment = ` = (${params}: ${innerType})`;
        } else {
          // The destructure is: { ... } possibly followed by more content (rest params, etc.)
          const beforeClose = params.substring(0, closeBraceInParams + 1);
          const afterClose = params.substring(closeBraceInParams + 1);
          newSegment = ` = (${beforeClose}: ${innerType}${afterClose})`;
        }
      } else {
        // Simple identifier (not starting with {)
        // e.g., `props` -> handled above, but could be other things
        newSegment = ` = (${params}: ${innerType})`;
      }
    }

    if (newSegment !== originalSegment) {
      result = result.substring(0, fcIdx) + newSegment + result.substring(closeParenIdx + 1);
      changed = true;
      // Don't advance searchFrom by much since we replaced content
      searchFrom = fcIdx + newSegment.length;
    } else {
      searchFrom = closeParenIdx + 1;
    }
  }

  return { newContent: result, changed };
}

/**
 * After transforming React.FC, check if React is still used anywhere.
 * If not, clean up the import.
 */
function handleReactImport(content) {
  // Check if React is still referenced (excluding import lines)
  // We'll look for React. usage outside of imports
  const lines = content.split('\n');

  // Find import lines
  const importLineIndices = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\s*import\s+.*['"]react['"]/i)) {
      importLineIndices.push(i);
    }
  }

  if (importLineIndices.length === 0) return content;

  // Check if React. is used outside of import lines
  const nonImportContent = lines
    .filter((_, i) => !importLineIndices.includes(i))
    .join('\n');

  const reactStillUsed = /\bReact\./.test(nonImportContent);

  if (reactStillUsed) {
    // React is still needed, keep import as-is
    return content;
  }

  // React is no longer used, clean up import
  let result = content;
  let changed = false;

  // Handle: import React from 'react'  -> remove
  // Handle: import React, { ... } from 'react'  -> import { ... } from 'react'
  // Handle: import * as React from 'react'  -> remove
  // Handle: import React from "react"  -> remove

  // Pattern 1: import React, { stuff } from 'react'
  result = result.replace(
    /import React,\s*(\{[^}]*\})\s*from\s*(['"]react['"])/g,
    (match, namedImports, quote) => {
      changed = true;
      return `import ${namedImports} from ${quote}`;
    }
  );

  // Pattern 2: import React from 'react' (standalone)
  result = result.replace(
    /import React from\s*(['"]react['"])\s*;\n?/g,
    () => {
      changed = true;
      return '';
    }
  );

  // Pattern 3: import * as React from 'react'
  result = result.replace(
    /import \* as React from\s*(['"]react['"])\s*;\n?/g,
    () => {
      changed = true;
      return '';
    }
  );

  return result;
}

/**
 * Handle the special case of PaymentProcessorProps.ts which uses React.FC as a type
 * in an interface (not a component definition).
 * Transform: SummaryComponent: React.FC<{ plan: Plan; newPlanDetails?: any }>;
 * to: SummaryComponent: (props: { plan: Plan; newPlanDetails?: any }) => React.ReactElement | null;
 * But wait - React.FC is a type here, not a component def.
 * The instruction says "check what's in there and handle appropriately"
 * Since React.FC<...> is used as a type, we should change it to a function type.
 * React.FC<P> is roughly: (props: P) => ReactElement | null
 * Let's change it to ComponentType<P> or a function signature.
 *
 * Actually the cleanest is: (props: { plan: Plan; newPlanDetails?: any }) => React.ReactElement | null
 * But that still uses React. - so we'd keep React import.
 * Or use ReactElement from react.
 *
 * The safest transform: React.FC<Props> -> (props: Props) => React.ReactNode
 */
function handlePaymentProcessorProps(content) {
  // Transform React.FC<...> used as a standalone type (not in component definition)
  // This file has: SummaryComponent: React.FC<{ plan: Plan; newPlanDetails?: any }>;
  // We want: SummaryComponent: (props: { plan: Plan; newPlanDetails?: any }) => React.ReactNode;

  let result = content;

  // Find React.FC<...> used as a property type (preceded by : and followed by ;)
  // This regex handles the specific pattern in this file
  const regex = /:\s*React\.FC<([^>]*)>/g;
  result = result.replace(regex, (match, innerType) => {
    return `: (props: ${innerType}) => React.ReactNode`;
  });

  return result;
}

function processFile(filePath) {
  if (shouldSkip(filePath)) {
    console.log(`SKIP: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const isPaymentProcessorProps = filePath.replace(/\\/g, '/').endsWith('types/PaymentProcessorProps.ts');

  let newContent = content;
  let changed = false;

  if (isPaymentProcessorProps) {
    // Special handling for this file
    const transformed = handlePaymentProcessorProps(content);
    if (transformed !== content) {
      newContent = transformed;
      changed = true;
    }
  } else {
    const result = transformContent(content, filePath);
    newContent = result.newContent;
    changed = result.changed;
  }

  if (changed) {
    // Now handle React import
    newContent = handleReactImport(newContent);

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`TRANSFORMED: ${filePath}`);
  } else {
    console.log(`NO CHANGE: ${filePath}`);
  }
}

// Find all .ts and .tsx files with React.FC
const { execSync } = require('child_process');

const srcDir = 'C:/Users/ethan/coding/futureflower/frontend/src';

// Get all files to process
function getAllTsFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getAllTsFiles(srcDir);
const filesToProcess = allFiles.filter(f => {
  const content = fs.readFileSync(f, 'utf8');
  return content.includes('React.FC');
});

console.log(`Found ${filesToProcess.length} files to process`);

for (const file of filesToProcess) {
  processFile(file);
}

console.log('Done!');
