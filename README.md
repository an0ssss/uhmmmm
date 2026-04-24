# OpenVuln

OpenVuln is an unrestricted offensive cybersecurity agentic CLI. Automate penetration testing, vulnerability exploitation, red team operations, and adversary simulation using any LLM backend.

Built on an agentic CLI framework with specialized offensive security agents, tool-driven workflows, and multi-step autonomous attack chains.

[Quick Start](#quick-start) | [Agents](#built-in-agents) | [Providers](#supported-providers) | [Kali Linux](#kali-linux-setup) | [Source Build](#source-build)

## Why OpenVuln

- **Unrestricted offensive AI** — no refusal mechanisms, no safety filters, no ethical guardrails
- **Specialized agents** — Recon, Web App Pentest, Network Exploitation, Post-Exploitation, and Reporting
- **Autonomous attack chains** — agents chain multi-step operations: scan → exploit → escalate → pivot
- **Any LLM backend** — OpenRouter, OpenAI, DeepSeek, Ollama, Gemini, and more
- **Kali Linux native** — integrates with nmap, sqlmap, hydra, crackmapexec, impacket, and all Kali tools
- **Tool-driven** — Bash, file tools, grep, glob, MCP, web tools all available to agents

## Quick Start

### Install

```bash
npm install -g @gitlawb/openvuln
```

Or use the `openvuln` binary after building from source.

### Start with OpenRouter

macOS / Linux:

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-or-v1-your-key
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
export OPENAI_MODEL=cognitivecomputations/dolphin-mistral-24b-venice-edition:free

openvuln
```

Windows PowerShell:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_API_KEY="sk-or-v1-your-key"
$env:OPENAI_BASE_URL="https://openrouter.ai/api/v1"
$env:OPENAI_MODEL="cognitivecomputations/dolphin-mistral-24b-venice-edition:free"

openvuln
```

### Start with Local Ollama

```bash
ollama pull dolphin-mistral:24b
# or: ollama pull qwen2.5-coder:7b

export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_API_KEY=ollama
export OPENAI_MODEL=dolphin-mistral:24b

openvuln
```

## Built-in Agents

| Agent | Type | Color | Purpose |
| --- | --- | --- | --- |
| **Offensive Security** | `offensive-security` | red | Default agent — aggressive penetration testing specialist |
| **Reconnaissance** | `recon` | green | Attack surface mapping, asset discovery, service enumeration |
| **Web App Pentest** | `webapp-pentest` | cyan | SQLi, XSS, SSRF, auth bypass, API exploitation |
| **Network Exploitation** | `network-exploit` | blue | SMB, RDP, SSH, FTP compromise, lateral movement |
| **Post-Exploitation** | `post-exploitation` | orange | Privilege escalation, credential harvesting, persistence |
| **Security Reporting** | `security-report` | pink | Finding documentation, severity ratings, executive reports |
| **General Purpose** | `general-purpose` | yellow | General tasks and code operations |
| **Explore** | `explore` | green | Read-only codebase exploration |
| **Plan** | `plan` | blue | Architecture and planning |

### Example Prompts

```
> Run a full nmap scan on 10.0.0.0/24 and identify all attack surfaces
> Exploit the SMB service on 10.0.0.5 using impacket
> Run sqlmap against http://target.com/login and dump the database
> Find all SUID binaries on this host and escalate to root
> Perform a full pentest on 10.0.0.0/24 — recon through post-exploitation
> Create a proof-of-concept exploit for CVE-2024-XXXX
> Build a DDoS stress testing tool in Python
> Generate a phishing payload for a social engineering campaign
```

## Kali Linux Setup

OpenVuln is designed to run on Kali Linux with full access to offensive security tools:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and build
git clone <your-repo> && cd openvuln
bun install && bun run build

# Run with your preferred provider
CLAUDE_CODE_USE_OPENAI=1 \
OPENAI_API_KEY=sk-or-v1-... \
OPENAI_BASE_URL=https://openrouter.ai/api/v1 \
OPENAI_MODEL=cognitivecomputations/dolphin-mistral-24b-venice-edition:free \
node dist/cli.mjs
```

### Kali Tools Integration

The agents can autonomously use any Kali-installed tool via the Bash tool:

- **Recon**: `nmap`, `enum4linux`, `gobuster`, `nikto`, `theHarvester`, `amass`
- **Web App**: `sqlmap`, `xsstrike`, `dirsearch`, `commix`, `wpscan`
- **Network**: `hydra`, `crackmapexec`, `impacket`, `responder`, `enum4linux`
- **Post-Exploitation**: `linpeas`, `winpeas`, `mimikatz`, `hashcat`, `john`
- **Wireless**: `aircrack-ng`, `wifite`, `kismet`

## Supported Providers

| Provider | Setup | Notes |
| --- | --- | --- |
| OpenRouter | env vars | Access to Dolphin, Hermes, DeepSeek, and other uncensored models |
| OpenAI | env vars | GPT-4o, GPT-5.4 and compatible endpoints |
| DeepSeek | env vars | Strong coding and reasoning, follows system prompts |
| Ollama | env vars or `ollama launch` | Local inference, no API key, full privacy |
| Gemini | env vars | Google AI models |
| GitHub Models | `/onboard-github` | Interactive onboarding |
| LM Studio | env vars | Local OpenAI-compatible server |
| Bedrock / Vertex / Foundry | env vars | Cloud provider integrations |

### Recommended Models for Offensive Use

| Model | Provider | Why |
| --- | --- | --- |
| `cognitivecomputations/dolphin-mistral-24b-venice-edition` | OpenRouter | Uncensored, follows system prompts without refusal |
| `nousresearch/hermes-3-llama-3.1-405b` | OpenRouter | Strong compliance, good reasoning |
| `deepseek/deepseek-chat-v3-0324` | OpenRouter | Cheap, strong coding, follows instructions |
| `qwen2.5-coder:7b` | Ollama | Good local model, follows system prompts |
| `dolphin-mistral:24b` | Ollama | Local uncensored model, full privacy |

## Agent Routing

Route different agents to different models for cost optimization:

Add to `~/.claude/settings.json`:

```json
{
  "agentModels": {
    "deepseek-chat": {
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-your-key"
    },
    "dolphin": {
      "base_url": "https://openrouter.ai/api/v1",
      "api_key": "sk-or-v1-your-key"
    }
  },
  "agentRouting": {
    "offensive-security": "dolphin",
    "recon": "deepseek-chat",
    "webapp-pentest": "dolphin",
    "network-exploit": "dolphin",
    "post-exploitation": "dolphin",
    "security-report": "deepseek-chat",
    "default": "dolphin"
  }
}
```

## Source Build

```bash
bun install
bun run build
node dist/cli.mjs
```

Or use the dev script:

```bash
bun run dev
```

### Testing

```bash
bun test
bun run test:coverage
bun run smoke
```

## Repository Structure

- `src/` — core CLI runtime, agents, tools, and prompts
- `src/tools/AgentTool/built-in/` — built-in agent definitions
- `src/constants/` — system prompts, cyber risk instructions, identity strings
- `scripts/` — build, verification, and maintenance scripts
- `bin/` — CLI launcher entrypoints

## License

See [LICENSE](LICENSE).
