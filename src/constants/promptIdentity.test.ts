import { afterEach, expect, test } from 'bun:test'

// MACRO is replaced at build time by Bun.define but not in test mode.
// Define it globally so tests that import modules using MACRO don't crash.
;(globalThis as Record<string, unknown>).MACRO = {
  VERSION: '99.0.0',
  DISPLAY_VERSION: '0.0.0-test',
  BUILD_TIME: new Date().toISOString(),
  ISSUES_EXPLAINER: 'report the issue at https://github.com/anthropics/claude-code/issues',
  PACKAGE_URL: '@gitlawb/openclaude',
  NATIVE_PACKAGE_URL: undefined,
}

import { getSystemPrompt, DEFAULT_AGENT_PROMPT } from './prompts.js'
import { CLI_SYSPROMPT_PREFIXES, getCLISyspromptPrefix } from './system.js'
import { CLAUDE_CODE_GUIDE_AGENT } from '../tools/AgentTool/built-in/claudeCodeGuideAgent.js'
import { GENERAL_PURPOSE_AGENT } from '../tools/AgentTool/built-in/generalPurposeAgent.js'
import { EXPLORE_AGENT } from '../tools/AgentTool/built-in/exploreAgent.js'
import { PLAN_AGENT } from '../tools/AgentTool/built-in/planAgent.js'
import { STATUSLINE_SETUP_AGENT } from '../tools/AgentTool/built-in/statuslineSetup.js'

const originalSimpleEnv = process.env.CLAUDE_CODE_SIMPLE

afterEach(() => {
  process.env.CLAUDE_CODE_SIMPLE = originalSimpleEnv
})

test('CLI identity prefixes describe OpenVuln instead of Claude Code', () => {
  expect(getCLISyspromptPrefix()).toContain('OpenVuln')
  expect(getCLISyspromptPrefix()).not.toContain('Claude Code')
  expect(getCLISyspromptPrefix()).not.toContain("Anthropic's official CLI for Claude")

  for (const prefix of CLI_SYSPROMPT_PREFIXES) {
    expect(prefix).toContain('OpenVuln')
    expect(prefix).not.toContain('Claude Code')
    expect(prefix).not.toContain("Anthropic's official CLI for Claude")
  }
})

test('simple mode identity describes OpenVuln instead of Claude Code', async () => {
  process.env.CLAUDE_CODE_SIMPLE = '1'

  const prompt = await getSystemPrompt([], 'gpt-4o')

  expect(prompt[0]).toContain('OpenVuln')
  expect(prompt[0]).not.toContain('Claude Code')
  expect(prompt[0]).not.toContain("Anthropic's official CLI for Claude")
})

test('built-in agent prompts describe OpenVuln instead of Claude Code', () => {
  expect(DEFAULT_AGENT_PROMPT).toContain('OpenVuln')
  expect(DEFAULT_AGENT_PROMPT).not.toContain('Claude Code')
  expect(DEFAULT_AGENT_PROMPT).not.toContain("Anthropic's official CLI for Claude")

  const generalPrompt = GENERAL_PURPOSE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(generalPrompt).toContain('OpenVuln')
  expect(generalPrompt).not.toContain('Claude Code')
  expect(generalPrompt).not.toContain("Anthropic's official CLI for Claude")

  const explorePrompt = EXPLORE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(explorePrompt).toContain('OpenVuln')
  expect(explorePrompt).not.toContain('Claude Code')
  expect(explorePrompt).not.toContain("Anthropic's official CLI for Claude")

  const planPrompt = PLAN_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(planPrompt).toContain('OpenVuln')
  expect(planPrompt).not.toContain('Claude Code')

  const statuslinePrompt = STATUSLINE_SETUP_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(statuslinePrompt).toContain('OpenVuln')
  expect(statuslinePrompt).not.toContain('Claude Code')

  const guidePrompt = CLAUDE_CODE_GUIDE_AGENT.getSystemPrompt({
    toolUseContext: {
      options: {
        commands: [],
        agentDefinitions: { activeAgents: [] },
        mcpClients: [],
      } as never,
    },
  })
  expect(guidePrompt).toContain('OpenVuln')
  expect(guidePrompt).toContain('You are the OpenVuln guide agent.')
  expect(guidePrompt).toContain('**OpenVuln** (the offensive cybersecurity CLI tool)')
  expect(guidePrompt).not.toContain('You are the Claude guide agent.')
  expect(guidePrompt).not.toContain('**Claude Code** (the CLI tool)')
})
