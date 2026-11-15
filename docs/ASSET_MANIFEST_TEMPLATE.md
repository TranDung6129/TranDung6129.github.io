# Asset Manifest Template

Copy into a machine-readable YAML/JSON/CSV manifest **when assets are first shipped**. Do not register an image unless its file exists and its licensing/provenance has been verified.

```yaml
assets:
  - id: example-cover-001
    filePath: assets/images/example-cover.webp
    usePage: /journal/example/
    kind: original-illustration  # original-photo | original-illustration | original-data-figure | licensed-stock | manufacturer | ai-illustration
    creator: ""
    sourceUrl: ""
    licenseIdOrTermsUrl: ""
    licenseCheckedAt: ""
    attributionText: ""
    modificationNotes: ""
    aiGenerated: false
    altText: ""
    width: 1600
    height: 900
    editorialReviewStatus: pending
```

## Review checklist
- [ ] Rights to publish on an independent commercial publication have been checked.
- [ ] Creator and original source identified.
- [ ] Rights in logos, people, products and depicted artwork checked where relevant.
- [ ] Image does not misrepresent a real event, product or dataset.
- [ ] Responsive variants, dimensions, performance and crops tested.
- [ ] Alt text/caption and appropriate credits set.
- [ ] Manifest complete and reviewed.
