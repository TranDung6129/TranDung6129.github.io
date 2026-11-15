-- P1-09: reference metadata only. The migration runner provides the transaction.
-- Stable opaque UUIDs and explicit keys are independent of mutable public URLs.
-- Article bodies, real people, purchases, identities and grants do not belong here.

CREATE TABLE editorial_authors (
    id uuid PRIMARY KEY,
    author_key text NOT NULL UNIQUE CHECK (author_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'),
    display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 200)
);

CREATE TABLE editorial_objects (
    id uuid PRIMARY KEY,
    content_key text NOT NULL UNIQUE CHECK (content_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'),
    kind text NOT NULL CHECK (kind IN ('article', 'chapter', 'film', 'lab', 'resource'))
);

CREATE TABLE editorial_object_authors (
    editorial_object_id uuid NOT NULL REFERENCES editorial_objects(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES editorial_authors(id) ON DELETE RESTRICT,
    PRIMARY KEY (editorial_object_id, author_id)
);

CREATE TABLE catalog_products (
    id uuid PRIMARY KEY,
    product_key text NOT NULL UNIQUE CHECK (product_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'),
    label text NOT NULL CHECK (length(btrim(label)) BETWEEN 1 AND 200)
);

-- These describe possible future capabilities, not granted rights or access checks.
CREATE TABLE entitlement_types (
    id uuid PRIMARY KEY,
    entitlement_key text NOT NULL UNIQUE CHECK (entitlement_key ~ '^[a-z0-9]+([_-][a-z0-9]+)*$'),
    label text NOT NULL CHECK (length(btrim(label)) BETWEEN 1 AND 200)
);

CREATE TABLE product_entitlement_types (
    product_id uuid NOT NULL REFERENCES catalog_products(id) ON DELETE CASCADE,
    entitlement_type_id uuid NOT NULL REFERENCES entitlement_types(id) ON DELETE RESTRICT,
    PRIMARY KEY (product_id, entitlement_type_id)
);
