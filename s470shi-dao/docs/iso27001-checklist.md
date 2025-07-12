# OCOS DAO — ISO 27001 Compliance Checklist

| Control (Annex A)     | Description / Policy                         | Evidence / Artifact                             | Responsible        | Status   | Notes/Audit |
|-----------------------|----------------------------------------------|-------------------------------------------------|--------------------|----------|-------------|
| A.5 InfoSec Policies  | Security, compliance, open-source policies   | SECURITY.md, compliance.md, LICENSE             | Security Lead      | ✅        |             |
| A.6 Organization of IS| DAO governance, role assignment, multi-sig   | config/dao.json, audit logs/                    | Governance         | ✅        |             |
| A.7 HR Security       | Access revocation, onboarding, PR reviews    | Github PRs, contributors.md                     | Governance         | ✅        |             |
| A.8 Asset Management  | Node, key and log tracking, backup policy    | Node snapshots, logs/, backup script            | DevOps             | ✅        |             |
| A.9 Access Control    | Github 2FA, repo settings, secrets in vault  | Github settings, .env, CI/CD secrets            | Security Lead      | ✅        |             |
| A.10 Cryptography     | On-chain crypto standards, offline signing   | scripts/, SECURITY.md                           | DevOps             | ✅        |             |
| A.11 Physical Security| Cloud only, no on-prem data                  | Cloud provider docs, node backup logs           | DevOps             | ✅        |             |
| A.12 Ops Security     | Log monitoring, audit trails, CI/CD checks   | logs/, .github/workflows/, audit logs           | DevOps             | ✅        |             |
| A.13 Communication Sec| All APIs HTTPS, encrypted .env, access logs  | config/, API test results                       | DevOps             | ✅        |             |
| A.14 System Acquisition| Peer review, CI/CD, branch protection       | Github PR history, audit logs                   | Governance, DevOps | ✅        |             |
| A.15 Supplier Mngmt   | OSS only, npm/pip/docker scan for deps       | dependencies.txt, npm audit logs                | DevOps             | ✅        |             |
| A.16 Incident Mgmt    | Emergency logs, incident notification        | logs/manual-dao-emergency-test.log, community notice | Security Lead  | ✅        |             |
| A.17 Bus Continuity   | Node/data snapshot, regular backup/restore   | Node restore logs, backup policy                | DevOps             | ✅        |             |
| A.18 Compliance       | MIT license, open logs, audit ready          | LICENSE, logs/, audit-transparency-test.log     | Governance         | ✅        |             |

---

## Review Schedule

- **Checklist reviewed:** Quarterly (by Security Lead & DAO audit team)
- **Last updated:** 2025-07-13

---

## Evidence Storage

- **Logs:** logs/
- **Artifacts:** artifacts/
- **Config:** config/
- **Policies:** docs/, SECURITY.md, compliance.md

---

## Audit Notes

- All controls are versioned via Github
- Any change triggers CI/CD check and automatic audit log append
- External audit access available on request (admin@ocos.io)

---

**This checklist is part of the OCOS DAO compliance program and is maintained for ISO 27001 alignment.**
