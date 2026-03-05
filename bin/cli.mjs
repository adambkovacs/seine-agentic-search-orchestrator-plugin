#!/usr/bin/env node
import { cpSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const cmd = process.argv[2];

if (cmd === 'init') {
  const dest = resolve(process.cwd(), '.claude');
  mkdirSync(dest, { recursive: true });

  const agentsSrc = resolve(pkgRoot, 'agents');
  const skillsSrc = resolve(pkgRoot, 'skills');
  const pluginSrc = resolve(pkgRoot, '.claude-plugin');

  // Copy agents (including seine-kb/)
  if (existsSync(agentsSrc)) {
    cpSync(agentsSrc, resolve(dest, 'agents'), { recursive: true });
  }

  // Copy skills
  if (existsSync(skillsSrc)) {
    cpSync(skillsSrc, resolve(dest, 'skills'), { recursive: true });
  }

  // Copy plugin manifest
  if (existsSync(pluginSrc)) {
    cpSync(pluginSrc, resolve(dest, '.claude-plugin'), { recursive: true });
  }

  const agentCount = readdirSync(resolve(dest, 'agents'))
    .filter(f => f.startsWith('seine-') && f.endsWith('.md')).length;
  const skillCount = readdirSync(resolve(dest, 'skills'))
    .filter(f => f.startsWith('seine-')).length;

  console.log(`Seine plugin installed to ${dest}/`);
  console.log(`  ${agentCount} agents`);
  console.log(`  ${skillCount} skills`);
  console.log(`  Plugin manifest: .claude-plugin/plugin.json`);
  console.log();
  console.log('Usage:');
  console.log('  /seine:seine-search "your query" dig');
  console.log('  /seine:seine-council deliberate "topic" <results>');
  console.log('  /seine:seine-research "deep topic"');
} else {
  console.log('seine-search — Multi-domain agentic search orchestrator for Claude Code');
  console.log();
  console.log('Commands:');
  console.log('  init    Install Seine plugin into .claude/ directory');
  console.log();
  console.log('Usage:');
  console.log('  npx seine-search init');
  console.log();
  console.log('Learn more: https://seinesearch.com');
}
