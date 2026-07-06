# Task 1 report: Competitive Matrix Artifact

Date: 2026-07-05
Worktree: `/home/mehiel/Documents/Development/Projects/nest-cms/.worktrees/cms-validation`

## Outcome

Created `docs/product/cms-competitive-research.md` with the brief's fixed
structure and the requested competitive matrix.

## Verification

Ran the brief's verification command successfully:

```bash
rg -n "https://|re-check" docs/product/cms-competitive-research.md
MISSING_PATTERN='T''BD|TO''DO|un''known'
rg -n "$MISSING_PATTERN" docs/product/cms-competitive-research.md
test $? -eq 1
```

## Official sources checked

Checked official product, help, and pricing pages for the listed platforms on
2026-07-05:

- Webflow: `https://webflow.com/ai`, `https://webflow.com/ai-site-builder`,
  `https://webflow.com/feature/cms`, `https://webflow.com/pricing`
- Wix: `https://www.wix.com/`,
  `https://support.wix.com/en/article/about-wixs-ai-tools`,
  `https://support.wix.com/en/article/cms-formerly-content-manager-getting-started`
- Framer: `https://www.framer.com/ai/`, `https://www.framer.com/cms/`,
  `https://www.framer.com/publish/`, `https://www.framer.com/pricing`
- WordPress.com: `https://wordpress.com/`, `https://wordpress.com/pricing/`,
  `https://wordpress.com/features/`
- Elementor: `https://elementor.com/`, `https://elementor.com/pricing/`,
  `https://elementor.com/hosting/`
- Dorik: `https://dorik.com/`, `https://dorik.com/pricing`

## Commit

- `2360ffd` - `docs: add cms competitive research`

## Concerns

None.

## Fix notes

- Updated the Dorik row to reflect the official free-plan custom domain
  connection flow and free SSL.
- Added source-by-source checked dates for every official URL in the matrix.

## Retest

Reran the task brief verification command after the edits and it passed:

```bash
rg -n "https://|re-check" docs/product/cms-competitive-research.md
MISSING_PATTERN='T''BD|TO''DO|un''known'
rg -n "$MISSING_PATTERN" docs/product/cms-competitive-research.md
test $? -eq 1
```
