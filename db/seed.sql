-- Synthetic local demo metadata only; never use as production content or people.
-- Re-running is idempotent by fixed identifiers. Conflicting keys fail visibly.
INSERT INTO editorial_authors (id, author_key, display_name)
VALUES ('00000000-0000-4000-8000-000000000001', 'demo-editor', 'Demo editor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO editorial_objects (id, content_key, kind)
VALUES ('00000000-0000-4000-8000-000000000002', 'demo-article', 'article')
ON CONFLICT (id) DO NOTHING;

INSERT INTO editorial_object_authors (editorial_object_id, author_id)
VALUES ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001')
ON CONFLICT (editorial_object_id, author_id) DO NOTHING;

INSERT INTO catalog_products (id, product_key, label)
VALUES ('00000000-0000-4000-8000-000000000003', 'demo-product', 'Demo product')
ON CONFLICT (id) DO NOTHING;

INSERT INTO entitlement_types (id, entitlement_key, label)
VALUES ('00000000-0000-4000-8000-000000000004', 'demo-capability', 'Demo capability')
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_entitlement_types (product_id, entitlement_type_id)
VALUES ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000004')
ON CONFLICT (product_id, entitlement_type_id) DO NOTHING;
